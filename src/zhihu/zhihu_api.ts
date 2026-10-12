import { HttpManager } from '../utils/http';
import { ILogger } from '@snowball-bot/repost-adapter';
import { ZhihuBaseHttpParams } from './types/base';
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
