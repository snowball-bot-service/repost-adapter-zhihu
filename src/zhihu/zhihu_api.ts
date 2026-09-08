import { HttpManager } from '../utils/http';
import { ILogger } from '@snowball-bot/repost-adapter';
import { ZhihuBaseHttpParams } from './types/base';
import { ZhihuAnswerDetailItem, ZhihuFetchAnswerDetailParams } from './types/answer';
import { ZhihuUserProfileParams, ZhihuUserProfileResponse } from './types/profile';

/**
 * Zhihu Base HTTP Instance
 * @param cookie
 * @param logger
 */
export function buildHttpApi(cookie: string, logger?: ILogger) {
  return new HttpManager({
    baseUrl: "https://www.zhihu.com",
    timeoutMs: 3000,
    retries: 2,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
      "Cookie": cookie,
    },
    logger: logger,
  });
}

/**
 * Zhihu Fetch Answer Detail
 * @param base
 * @param params
 */
export async function fetchAnswerDetail(
  base: ZhihuBaseHttpParams,
  params: ZhihuFetchAnswerDetailParams,
): Promise<ZhihuAnswerDetailItem> {
  const {cookie, logger} = base;
  const {
    answerId,
    offset = 0,
    limit = 1,
    order = "default",
    ws_qiangzhisafe = 0,
    platform = "desktop",
    includes = [
      "comment_count", "content", "editable_content",
      "attachment", "voteup_count", "created_time", "updated_time",
      "review_info", "relevant_info", "question", "excerpt", "reaction",
      "reaction_instruction", "hot_comment", "voting",
    ]
  } = params;

  const http = buildHttpApi(cookie, logger);

  const include = includes.join(",");

  return await http.getJson(`/api/v4/answers/${answerId}`, {
    query: {
      offset, limit, order, ws_qiangzhisafe, platform, include,
    }
  });
}

/**
 * Zhihu Fetch User Profile
 * @param base
 * @param params
 */
export async function fetchUserProfile(
  base: ZhihuBaseHttpParams,
  params: ZhihuUserProfileParams,
): Promise<ZhihuUserProfileResponse> {
  const {cookie, logger} = base;
  const {
    urlToken,
    includes = [ "cover_url", "created_at", "following_count", "follower_count", "badge", "voteup_count" ],
  } = params;

  const http = buildHttpApi(cookie, logger);

  const include = includes.join(",");

  return await http.getJson(`/api/v4/members/${urlToken}`, {
    query: { include },
  });
}
