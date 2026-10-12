import {ProcessMethod, RepostMethod} from "@snowball-bot/repost-adapter";

export abstract class SnowballException extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * 获取 Handle Data 失败错误
 */
export class FetchHandleDataFailedException extends SnowballException {
  constructor(
    public readonly method: RepostMethod,
    public readonly handleId: string,
    public readonly msg: string,
  ) {
    super(`Fetch Handle Data Failed Exception | Method: ${method} | Handle Id: ${handleId} | Message: ${msg}`);
  }
}

/**
 * zhihu-cli 执行失败错误
 */
export class ZhihuCliException extends SnowballException {
  constructor(
    public readonly args: string[],
    public readonly exitCode: number | string | undefined,
    public readonly output: string,
  ) {
    super(`Zhihu CLI Failed | Args: ${args.join(' ')} | Exit Code: ${exitCode} | Output: ${output}`);
  }
}

/**
 * 不支持的类型错误
 */
export class UnsupportedMethodException extends SnowballException {
  constructor(
    public readonly method?: RepostMethod,
    public readonly handleId?: string,
  ) {
    super(`Unsupported Method Exception | Method: ${method} | Handle Id: ${handleId}`);
  }
}

/**
 * 不支持的进程错误
 */
export class UnsupportedProcessException extends SnowballException {
  constructor(
    public readonly process: ProcessMethod,
    public readonly source: string,
  ) {
    super(`Unsupported Method Exception | Process: ${process} | Source: ${source}`);
  }
}
