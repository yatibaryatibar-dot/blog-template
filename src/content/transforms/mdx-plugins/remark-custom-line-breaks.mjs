// Removed mdast/unist type imports for JS compatibility

export default function remarkCustomLineBreaks() {
  /**
   * @param {import('mdast').Root} tree
   */
  return (tree) => {
    const newChildren = []; 
    // We need to iterate through the original children and build a new list
    // because we might replace one node (paragraph) with multiple nodes.

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      // --- 处理单个换行 (需求 1) 和段落间的空行占位 (需求 2) --- 
      if (node.type === 'paragraph') {
        const originalChildren = [...node.children]; // Copy children
        // Removed ': Paragraph[]' type annotation
        const splitParagraphs = []; 
        // Removed ': Paragraph' type annotation
        let currentParagraph = { type: 'paragraph', children: [] };

        for (const child of originalChildren) {
          if (child.type === 'text') {
            // Split text nodes by newline characters 
            const lines = child.value.split('\n');
            
            lines.forEach((line, index) => {
              const isLastSegment = index === lines.length - 1;
              
              // Preserve line if it has content, or if it's not the last line 
              // (effectively turning single newlines into breaks, multiple into paragraphs)
              if (line.length > 0 || !isLastSegment) { 
                currentParagraph.children.push({ type: 'text', value: line });
              }

              // If this wasn't the last line segment produced by split(\n)
              if (!isLastSegment) {
                // Finalize the paragraph ending before the newline
                if (currentParagraph.children.length > 0) {
                  splitParagraphs.push(currentParagraph);
                }
                // Reset for the paragraph starting after the newline
                currentParagraph = { type: 'paragraph', children: [] };
              }
            });
          } else {
            // -- MODIFIED LOGIC for non-text nodes --
            // Directly add the non-text node (link, image component, etc.) 
            // to the children of the current paragraph being built.
            currentParagraph.children.push(child);
            // DO NOT finalize the paragraph here.
            // DO NOT wrap the node in its own paragraph.
            // DO NOT reset currentParagraph.
            // -----------------------------------------
          }
        }
        if (currentParagraph.children.length > 0) {
          splitParagraphs.push(currentParagraph);
        }
        
        // Filter out empty paragraphs before adding to newChildren
        // Removed ': Paragraph[]' type annotation
        const paragraphsToAdd = [];
        // Removed 'as Paragraph[]' assertion
        const finalParagraphs = splitParagraphs; 
        for (const p of finalParagraphs) {
          // Assuming p is a paragraph-like structure
          if (p.children && p.children.length > 0) { 
            paragraphsToAdd.push(p);
          }
        }
        newChildren.push(...paragraphsToAdd);

      } else {
        // If not a paragraph, add the node as is
        // Removed 'isValidRootContent' check as type guard is TS specific
        // Trusting the input AST structure for now
        newChildren.push(node);
        // console.warn('remark-custom-line-breaks: Skipping/Adding unexpected node type:', node.type);
      }
    }

    // Replace the original tree children with the new structure
    tree.children = newChildren;
  };
}

// Removed 'isValidRootContent' type guard function 