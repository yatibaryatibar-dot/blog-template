import { visit } from 'unist-util-visit';

// Helper to create an empty paragraph node (representing <p>&nbsp;</p>)
// (重复定义以便独立，或者可以提取到公共 util)
/** @returns {{ type: 'paragraph', children: [{ type: 'text', value: string }] }} */
function createEmptyParagraph() {
  return {
    type: 'paragraph',
    children: [{ type: 'text', value: '\u00A0' }] // Use non-breaking space
  };
}

const BLANK_LINE_PLACEHOLDER = '<blank-line-placeholder />';

/**
 * A remark plugin to replace placeholder tags with empty paragraphs.
 */
export default function remarkBlankLinePlaceholder() {
  /**
   * @param {import('mdast').Root} tree
   */
  return (tree) => {
    visit(tree, ['html', 'paragraph', 'mdxJsxFlowElement'], (node, index, parent) => {
      let shouldReplace = false;

      // 检查是否是包含占位符的 HTML 节点
      if (node.type === 'html' && node.value === BLANK_LINE_PLACEHOLDER) {
        shouldReplace = true;
      }
      
      // 检查是否是只包含占位符文本的段落节点
      if (node.type === 'paragraph' && node.children.length === 1) {
          const child = node.children[0];
          if (child.type === 'text' && child.value.trim() === BLANK_LINE_PLACEHOLDER) {
              shouldReplace = true;
          }
      }

      // 检查是否是占位符 JSX 节点 (根据之前的 Input AST，这最可能)
      if (node.type === 'mdxJsxFlowElement' && node.name === 'blank-line-placeholder') {
          shouldReplace = true;
      }

      if (shouldReplace && parent && typeof index === 'number') {
        const newNode = createEmptyParagraph();
        parent.children.splice(index, 1, newNode);
        return [visit.SKIP, index];
      }
    });
   return tree; // Return the tree after replacements
  };
}
