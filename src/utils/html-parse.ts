import { parse, HTMLElement, TextNode, Node, NodeType } from 'node-html-parser';

// 需要替换成占位文字的标签
const TAG_TEXT: Record<string, string> = {
  img: '[图片]',
  video: '[视频]',
  audio: '[音频]',
  br: '\n',
  hr: '\n----\n',
};

// 块级标签，前后补换行
const BLOCK_TAGS = new Set([
  'p', 'div', 'li', 'tr', 'section', 'article', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]);
// 跳过的标签：内容不作为文本输出
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'head']);

function nodeToText(node: Node): string {
  if (node.nodeType === NodeType.TEXT_NODE) {
    return (node as TextNode).text;
  }
  if (node.nodeType !== NodeType.ELEMENT_NODE) {
    return '';
  }

  const el = node as HTMLElement;
  const tag = (el.rawTagName ?? '').toLowerCase();

  if (tag in TAG_TEXT) {
    return TAG_TEXT[tag];
  }

  if (SKIP_TAGS.has(tag)) return '';   // ← 关键：noscript 里的字面 img 文本被丢掉

  let text = el.childNodes.map(nodeToText).join('');

  if (BLOCK_TAGS.has(tag)) {
    text = '\n' + text + '\n';
  }
  return text;
}

export function htmlToText(root: HTMLElement): string {
  return nodeToText(root)
    .replace(/[ \t]+\n/g, '\n')   // 去掉行尾空格
    .replace(/\n{3,}/g, '\n\n')   // 折叠多余空行
    .trim();
}
