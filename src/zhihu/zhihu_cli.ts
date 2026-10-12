import { execFile } from 'node:child_process';
import { ILogger } from '@snowball-bot/repost-adapter';
import { ZhihuAnswerDetailItem, ZhihuFetchAnswerDetailParams } from './types/answer';
import { ZhihuCliException } from '../utils/error';

export interface ZhihuBaseCliParams {
  /**
   * zhihu-cli 可执行文件路径，默认从 PATH 中查找 `zhihu`
   */
  bin?: string;
  timeoutMs?: number;
  logger?: ILogger;
}

/**
 * 执行 zhihu-cli 并将 stdout 解析为 JSON
 *
 * - 强制 UTF-8：管道模式下 Python 默认按系统代码页 (Windows 为 GBK) 输出，中文会乱码
 * - 失败时 CLI 以非 0 退出码结束，并在 stdout 打印 `✗ Failed ...` 错误信息
 * @param base
 * @param args CLI 参数 (不含 `--json`)
 */
export function runZhihuCliJson<T>(base: ZhihuBaseCliParams, args: string[]): Promise<T> {
  const { bin = 'zhihu', timeoutMs = 30_000, logger } = base;
  const fullArgs = [...args, '--json'];

  logger?.debug(`[zhihu-cli] ${bin} ${fullArgs.join(' ')}`);

  return new Promise((resolve, reject) => {
    execFile(
      bin,
      fullArgs,
      {
        timeout: timeoutMs,
        maxBuffer: 64 * 1024 * 1024,
        windowsHide: true,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' },
      },
      (error, stdout, stderr) => {
        // 错误信息可能出现在 stdout (`✗ Failed ...`) 或 stderr (traceback)
        const output = () => [stdout, stderr]
          .map((s) => s.trim())
          .filter(Boolean)
          .join('\n')
          .replace(/^✗\s*/, '');

        if (error) {
          return reject(new ZhihuCliException(fullArgs, error.code ?? error.signal ?? undefined, output() || error.message));
        }

        try {
          resolve(JSON.parse(stdout) as T);
        } catch {
          reject(new ZhihuCliException(fullArgs, 0, `Invalid JSON output: ${output()}`));
        }
      },
    );
  });
}

/**
 * Zhihu Fetch Answer Detail (via `zhihu answer <AnswerID> --json`)
 * @param base
 * @param params
 */
export async function fetchAnswerDetail(
  base: ZhihuBaseCliParams,
  params: ZhihuFetchAnswerDetailParams,
): Promise<ZhihuAnswerDetailItem> {
  return runZhihuCliJson<ZhihuAnswerDetailItem>(base, ['answer', params.answerId]);
}
