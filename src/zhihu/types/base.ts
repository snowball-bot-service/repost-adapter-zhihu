import { ILogger } from '@snowball-bot/repost-adapter';

export interface ZhihuBaseHttpParams {
  cookie: string;
  logger?: ILogger;
}
