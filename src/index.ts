import {
  Adapter,
  AdapterContext,
  AdapterProcessRequestParams, AdapterProcessResponsePayload,
  AdapterRepostRequestParams,
  AdapterRepostResponsePayload, ContentItem,
  SocialProvider,
} from '@snowball-bot/repost-adapter';
import { HttpManager } from './utils/http';
import {extractHandleId, fetchHandleDataFromAPI} from "./manager";
import {UnsupportedMethodException, UnsupportedProcessException} from "./utils/error";
import dayjs from "dayjs";
import {RepostExtraParams} from "./type";
import { fetchAnswerDetail, fetchUserProfile } from './zhihu/zhihu_api';
import { parse, HTMLElement } from 'node-html-parser';
import { htmlToText } from './utils/html-parse';

export { HttpManager, HttpError } from './utils/http';
export type {
  HttpManagerOptions,
  HttpRequestOptions,
  HttpMethod,
  QueryParams,
} from './utils/http';

// ============================================================================
// TODO: 1. 修改下方 manifest 信息
// ============================================================================
//
// - manifest.name: 必须以 `repost-adapter-` 开头
// - manifest.provider: 你的平台标识符，比如 'twitter' / 'bilibili'
// - manifest.whitelistHosts: 你的 adapter 接管的域名列表（不带 www）
// - manifest.version: 适配器自己的版本号，每次有重大变化时递增
// - manifest.author: 你的昵称
// - manifest.billing: 各类费用雪花定价
// - manifest.providerInfo: 该适配器的基本信息
//
// ============================================================================

interface AdapterOptions {
  zhihuCookie: string;
}

// 递归解析 HTML 时跳过的标签：其内容不参与 contents 组装
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'head']);

/**
 * 常量仓库
 * @param apiBaseURL API 基础地址
 * @param provider 提供商
 * @param apiTimeout API 超时时间（毫秒）
 * @param apiRetries API 重试次数
 */
const CONST: {
  provider: SocialProvider,
} = {
  provider: "zhihu",
}

const adapter: Adapter = {
  manifest: {
    name: `repost-adapter-${CONST.provider}`,
    provider: CONST.provider,
    whitelistHosts: ['zhihu.com'],
    version: 1,
    author: 'Rominwolf',
    billing: {
      text: 100,
      token: 100,
      media: 1000,
      green: 1,
    },
    providerInfo: {
      name: '知乎',
      icon: '📚',
      color: '#FFFFFF',
      bgColor: '#1772F6',
    }
  },

  /**
   * 适配器初始化时触发，在此处注册各类资源
   * @param ctx
   */
  async initState(ctx: AdapterContext) {
    // 读取配置（可选）。配置由核心通过 `ctx.config(key)` 提供。
    // 比如 API key、限流参数等，建议把所有可调项都从 config 取。
    const zhihuCookie = ctx.config<string>('zhihuCookie') ?? "";

    // 注册转发请求处理器
    ctx.on('onRepostRequest', (req) => handleRepostRequest(req, ctx, { zhihuCookie }));
    ctx.on('onProcessRequest', (req) => handleProcessingRequest(req, ctx, { zhihuCookie }));

    ctx.logger.info(`[${CONST.provider}] Adapter initialized.`);
  },

  /**
   * 适配器销毁时触发，在此处清理各类资源
   *
   * eg. 关闭 HTTP 客户端, 清空定时器, 断开长连接...
   */
  async dispose() {

  },
};

// ============================================================================
// TODO: 2. 实现下方的 handle 函数
// ============================================================================
//
// 这是 adapter 的核心：接收一个 URL，返回标准化的转发数据。
//
// ============================================================================

async function handleRepostRequest(
  req: AdapterRepostRequestParams,
  ctx: AdapterContext,
  options: AdapterOptions,
): Promise<AdapterRepostResponsePayload | null> {
  const { helper, logger } = ctx;

  logger.debug(`[${CONST.provider}] fetching ${req.source}`);

  // 从 req.source 解析出 Handle Info
  const [handleMethod, handleId] = extractHandleId(req.source);

  // 不支持的转发模式
  if (!handleMethod || !handleId || handleMethod === "live")
    throw new UnsupportedMethodException(handleMethod, handleId);

  const response: AdapterRepostResponsePayload<RepostExtraParams> = {
    method: handleMethod,
    provider: CONST.provider,
    code: req.code,
    originalUrl: req.source,
    requester: req.requester,
    postId: handleId,
    author: {
      nickname: 'Failed Parse',
    },
  };

  // To Post...
  if (handleMethod === "post") {
    const answer = await fetchAnswerDetail(
      { cookie: options.zhihuCookie, logger: logger },
      { answerId: handleId },
    );

    logger.debug("Answer", answer);

    const { statistics } = answer.reaction;

    const html = parse(answer.content);
    const images = html.querySelectorAll("img").map((image) => ({
      src: image.getAttribute("data-original"),
      token: image.getAttribute("data-original-token"),
    }));

    const contents: ContentItem[] = [];

    // 递归到该分支下第一个真实 img（跳过 noscript 里的镜像 img）
    const findImageSrc = (node: HTMLElement): string | undefined =>
      node.getAttribute("data-original") ??
      node.getAttribute("data-actualsrc") ??
      node.getAttribute("src") ??
      undefined;

    // 递归遍历 HTML 层级，把符合条件的 tag 依序 insert 到 contents 中。
    // - p    -> 段落文本
    // - img  -> 图片（取原图地址）
    // - code -> 代码块
    // 命中上述 tag 后不再深入其子树；其余 tag 继续向下递归；
    const doInsertContent = (node: HTMLElement) => {
      const tag = (node.rawTagName ?? "").toLowerCase();

      // if (SKIP_TAGS.has(tag)) return;

      if (tag === "p") {
        const text = node.textContent?.trim();
        if (text) contents.push({ element: "p", text });
        return;
      }

      if (tag === "img") {
        const src = findImageSrc(node);
        if (src) contents.push({ element: "img", buffer: src });
        return;
      }

      if (tag === "pre") {
        const rawCode = node.textContent ?? "";
        const parsedCode = parse(rawCode);
        contents.push({ element: "code", text: parsedCode.textContent });
        return;
      }

      // 非目标 tag：继续向子元素递归
      for (const child of node.childNodes) {
        if (child instanceof HTMLElement) doInsertContent(child);
      }
    };

    doInsertContent(html);

    Object.assign(response, {
      publishAt: dayjs.unix(answer.created_time).toDate(),
      author: {
        nickname: answer.author.name,
        userId: answer.author.url_token,
        headshotUrl: answer.author.avatar_url,
      },

      title: answer.question.title,
      cover: images[0]?.src,

      contents: contents,

      badges: [
        [
          {
            emoji: '🔼',
            name: helper.extraHumanable('赞同', statistics.up_vote_count, '票'),
          },
          {
            emoji: '💬',
            name: helper.extraHumanable('评论', statistics.comment_count, '条'),
          },
          {
            emoji: '⭐',
            name: helper.extraHumanable('收藏', statistics.favorites, '次'),
          },
        ],
      ],
    } as AdapterRepostResponsePayload<RepostExtraParams>);
  }

  // To Profile...
  if (handleMethod === "profile") {
    const profile = await fetchUserProfile(
      { cookie: options.zhihuCookie, logger: logger },
      { urlToken: handleId },
    );

    logger.debug("Profile", profile);

    Object.assign(response, {
      publishAt: dayjs.unix(profile.created_at).toDate(),
      author: {
        nickname: profile.name,
        userId: profile.url_token,
        headshotUrl: profile.avatar_url,
      },

      cover: profile.cover_url,

      content: profile.headline_render,

      badges: [
        [
          { emoji: "📍", name: profile.ip_info },
          { emoji: "✨", name: profile.badge_v2.title === "" ? "无称号" : profile.badge_v2.title },
        ],
        [
          { emoji: "🔼", name: helper.extraHumanable("获赞", profile.voteup_count, "次") },
          { emoji: "💐", name: helper.extraHumanable("被", profile.follower_count, "人关注") },
          { emoji: "👤", name: helper.extraHumanable("关注", profile.following_count, "人") },
        ],
      ],
    } as AdapterRepostResponsePayload<RepostExtraParams>);
  }

  return response;
}

async function handleProcessingRequest(
  req: AdapterProcessRequestParams,
  ctx: AdapterContext,
  _options: AdapterOptions
): Promise<AdapterProcessResponsePayload | null> {
  const { logger } = ctx;
  const { method, source, requester, code, repostMethod, extra: _extra } = req;
  const extra = _extra as RepostExtraParams;

  logger.debug(`[${CONST.provider}] fetching ${method}: ${source}`);

  // 草莓 + Post -> 获取原图
  if (method === 'strawberry' && repostMethod === "post") {

  }

  // 抛出不支持的进程
  throw new UnsupportedProcessException(method, source);
}

export default adapter;
