import { visit } from 'unist-util-visit';

/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Text} Text
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 */

// Regexes are now separate and used in different passes
// Defined using new RegExp() with carefully escaped strings
const WIKI_IMAGE_PATTERN_STR = '[!\uff01]\\[\\[([^|\\]]+)(?:\\|([^\\]]+))?\\\]\\\]'; // Escaped for RegExp constructor
const WIKI_IMAGE_REGEX = new RegExp(WIKI_IMAGE_PATTERN_STR, 'g');

const WIKI_LINK_PATTERN_STR = '\\[\\[([^\\]]+)\\\]\\\]'; // Escaped for RegExp constructor
const WIKI_LINK_REGEX = new RegExp(WIKI_LINK_PATTERN_STR, 'g');

// Add options and postIdMap
const defaultOptions = { postIdMap: {}, lang: '' };

/**
 * A remark plugin to handle custom wiki-style images and links,
 * and convert standard images to a custom component format.
 * Uses separate passes for images and links.
 * Images are elevated to siblings of paragraphs to prevent hydration errors.
 * NOTE: Link resolution is now basic (encoded title), pending external postIdMap generation.
 */
export default function remarkCustomImagesAndLinks(options = defaultOptions) {
  // Receive postIdMap from options
  const { postIdMap, lang } = { ...defaultOptions, ...options };
  let unresolvedWikiLinkCount = 0;

  /**
   * @param {import('mdast').Root} tree
   */
  return (tree) => {
    // Phase 1: Handle standard images first (Elevate them too)
    visit(tree, 'image', (node, index, parent) => {
      if (!parent) return;
      const src = node.url;
      const alt = node.alt || '';
      const caption = node.title || alt || '';

      const newNode = {
        type: 'mdxJsxFlowElement',
        name: 'CenteredImage',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'src', value: src },
          { type: 'mdxJsxAttribute', name: 'alt', value: alt },
          { type: 'mdxJsxAttribute', name: 'caption', value: caption },
        ],
        children: [],
        data: { _mdxExplicitJsx: true },
      };
      // Replace the image node with the component node at the parent level
      parent.children.splice(index, 1, newNode);
      return [visit.SKIP, index]; // Skip further processing for this node
    });

    // Phase 2: Handle Wiki Images - Elevate to sibling
    visit(tree, 'paragraph', (paragraphNode, paragraphIndex, grandparent) => {
      if (!grandparent || !paragraphNode || !paragraphIndex === undefined) return; // Need parent and index
  
      let nodesToInsert = []; // Nodes that will replace the original paragraph
      let currentParagraphChildren = []; // Children for the current paragraph being built
      let processedOriginalParagraph = false; // Flag if we actually split/processed the paragraph
  
      for (let i = 0; i < paragraphNode.children.length; i++) {
        const childNode = paragraphNode.children[i];
  
        if (childNode.type === 'text') {
          const text = childNode.value;
          WIKI_IMAGE_REGEX.lastIndex = 0; // Reset regex state for global flag
          const matches = Array.from(text.matchAll(WIKI_IMAGE_REGEX));
          let lastIndex = 0;
  
          if (matches.length === 0) {
            // No image in this text node, add it to the current paragraph being built
            currentParagraphChildren.push(childNode);
            continue; // Move to next child node in the original paragraph
          }
  
          // Images found in this text node - process splits
          processedOriginalParagraph = true; // Mark that we are processing this paragraph
  
          for (const match of matches) {
            const matchIndex = match.index;
            const fullMatch = match[0];
            const fileName = match[1].trim();
            const width = match[2]?.trim();
  
            // 1. Add text before the match to the current paragraph
            if (matchIndex > lastIndex) {
              currentParagraphChildren.push({ type: 'text', value: text.substring(lastIndex, matchIndex) });
            }
  
            // 2. Finalize and add the preceding paragraph if it has content
            if (currentParagraphChildren.length > 0) {
              nodesToInsert.push({ type: 'paragraph', children: currentParagraphChildren });
            }
            currentParagraphChildren = []; // Reset for potential paragraph after the image
  
            // 3. Add the image node itself as a sibling
            const alt = fileName;
            const caption = fileName;
            const src = `/image/${fileName.includes('.') ? fileName : fileName + '.png'}`;
            const imageNode = {
              type: 'mdxJsxFlowElement',
              name: 'CenteredImage',
              attributes: [
                { type: 'mdxJsxAttribute', name: 'src', value: src },
                { type: 'mdxJsxAttribute', name: 'alt', value: alt },
                { type: 'mdxJsxAttribute', name: 'caption', value: caption },
                ...(width ? [{ type: 'mdxJsxAttribute', name: 'width', value: width }] : []),
              ],
              children: [],
              data: { _mdxExplicitJsx: true },
            };
            nodesToInsert.push(imageNode);
  
            lastIndex = matchIndex + fullMatch.length;
          }
  
          // 4. Add remaining text after the last match to the start of the next potential paragraph
          if (lastIndex < text.length) {
            currentParagraphChildren.push({ type: 'text', value: text.substring(lastIndex) });
          }
        } else {
          // Not a text node, just add it to the current paragraph segment being built
          currentParagraphChildren.push(childNode);
        }
      }
  
      // After iterating all children, finalize the last paragraph if it has content
      if (currentParagraphChildren.length > 0) {
        nodesToInsert.push({ type: 'paragraph', children: currentParagraphChildren });
      }
  
      // If we processed the paragraph (found images), replace the original paragraph
      if (processedOriginalParagraph) {
          if (nodesToInsert.length === 0) {
              // If processing resulted in no nodes (e.g., paragraph only contained an image), remove the original paragraph node
               grandparent.children.splice(paragraphIndex, 1);
               return paragraphIndex; // Adjust index for deletion
          } else {
              // Replace the original paragraph with the new sequence of nodes
              grandparent.children.splice(paragraphIndex, 1, ...nodesToInsert);
              // Return the index adjusted by the number of inserted nodes minus the one removed
              return paragraphIndex + nodesToInsert.length;
          }
      }
      // If not processed (no images found), leave the original paragraph as is.
      // visit will continue to the next node.
    });


    // Phase 3: Handle Wiki Links within paragraphs (Using direct splice)
     visit(tree, 'paragraph', (paragraphNode) => {
        let i = 0;
        while (i < paragraphNode.children.length) {
            const node = paragraphNode.children[i];

            // Skip nodes that are already links or image components
            if (node.type === 'link' || node.type === 'mdxJsxFlowElement') {
                 i++; // Move to next node
                 continue;
            }

            if (node.type === 'text') {
                const text = node.value;
                WIKI_LINK_REGEX.lastIndex = 0; // Reset regex state
                const matches = Array.from(text.matchAll(WIKI_LINK_REGEX));

                if (matches.length > 0) {
                    let newNodesForThisText = [];
                    let lastIndex = 0;

                    for (const match of matches) {
                        const matchIndex = match.index;
                        const fullMatch = match[0];
                        const title = match[1].trim();

                        // Add text before match
                        if (matchIndex > lastIndex) {
                            newNodesForThisText.push({ type: 'text', value: text.substring(lastIndex, matchIndex) });
                        }

                        // --- Replace link generation logic ---
                        const postId = postIdMap[title]; // Try to find postid by title
                        const prefix = lang && lang !== 'zh' ? `/${lang}` : '';
                        const isResolved = Boolean(postId);
                        const href = isResolved ? `${prefix}/posts/${postId}` : '#';

                        if (!isResolved) {
                          unresolvedWikiLinkCount++;
                        }

                        newNodesForThisText.push({
                            type: 'link',
                            url: href,
                            title: isResolved ? undefined : 'Unresolved wiki link',
                            data: isResolved
                              ? undefined
                              : {
                                  hProperties: {
                                    'aria-disabled': 'true',
                                    'data-unresolved': 'true',
                                  },
                                },
                            children: [{ type: 'text', value: title }],
                        });
                        // --- End of replaced logic ---

                        lastIndex = matchIndex + fullMatch.length;
                    }
                    // Add remaining text
                    if (lastIndex < text.length) {
                         newNodesForThisText.push({ type: 'text', value: text.substring(lastIndex) });
                    }

                    // Replace the original text node with the new sequence using splice
                    paragraphNode.children.splice(i, 1, ...newNodesForThisText);
                    
                    // Adjust the index to continue scanning after the inserted nodes
                    i += newNodesForThisText.length;
                    continue; // Skip the final i++ for this iteration
                }
            } 
            
            i++; // Move to the next node if no replacement happened
        }
    });

    if (unresolvedWikiLinkCount > 0) {
      console.info(`[remarkCustomImagesAndLinks] unresolved wiki links: ${unresolvedWikiLinkCount}`);
    }
  };
} 
