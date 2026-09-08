import 'dotenv/config';   // 自动加载 .env 文件
import adapter from '../src';
import { MockAdapterHost } from './harness';
import * as process from 'node:process';
import { fetchAnswerDetail, fetchUserProfile } from '../src/zhihu/zhihu_api';

async function main() {
  // {
  //   const zhihuCookie = process.env.ZHIHU_COOKIE as string;
  //   const profile = await fetchUserProfile({ cookie: zhihuCookie }, { urlToken: "hbrw" });
  //   console.log("PROFILE", profile);
  // }

  {
    const host = new MockAdapterHost({
      zhihuCookie: process.env.ZHIHU_COOKIE as string,
    });

    await host.register(adapter);

    // 测试 URL 列表：随便改、随便加
    const testUrls = [
      'https://www.zhihu.com/question/662538042/answer/2023343409935459985',
      // 'https://www.zhihu.com/people/hbrw',
    ];

    for (const url of testUrls) {
      try {
        const res = await host.emitRepost(url);

        // 转发 post 后，模拟用户点 🍓 触发 strawberry 进程（取原图）
        if (res?.method === 'post' && res.strawberry) {
          await host.emitProcess('strawberry', res.postId);
        }
      } catch (err) {
        console.error(`✗ Failed:`, err);
      }
    }

    await host.dispose();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
