import 'dotenv/config';   // 自动加载 .env 文件
import adapter from '../src';
import { MockAdapterHost } from './harness';
import * as process from 'node:process';
import { fetchAnswerDetail } from '../src/zhihu/zhihu_api';

async function main() {
  {
    const zhihuCookie = process.env.ZHIHU_COOKIE as string;
    const answer = await fetchAnswerDetail({ cookie: zhihuCookie }, { answerId: "2031204172268299364" });
    console.log("ANSWER", answer);
  }

  // const host = new MockAdapterHost({
  //   userAgent: process.env.USER_AGENT,
  // });
  //
  // await host.register(adapter);
  //
  // // 测试 URL 列表：随便改、随便加
  // const testUrls = [
  //   'https://example.com/post/44716',
  // ];
  //
  // for (const url of testUrls) {
  //   try {
  //     const res = await host.emitRepost(url);
  //
  //     // 转发 post 后，模拟用户点 🍓 触发 strawberry 进程（取原图）
  //     if (res?.method === 'post' && res.strawberry) {
  //       await host.emitProcess('strawberry', res.postId);
  //     }
  //   } catch (err) {
  //     console.error(`✗ Failed:`, err);
  //   }
  // }
  //
  // await host.dispose();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
