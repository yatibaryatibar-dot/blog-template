import { visit } from 'unist-util-visit';
import pangu from 'pangu';

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Text} Text
 */

/**
 * A remark plugin to add spacing between CJK and Latin characters using pangu.js.
 */
export default function remarkPanguSpacing() {
  /**
   * @param {Root} tree
   */
  return (tree) => {
    visit(tree, 'text', (node) => {
      // 只处理文本节点
      if (node.type === 'text') {
        // 使用 pangu.spacing 处理文本内容
        node.value = pangu.spacing(node.value);
      }
    });
  };
} 