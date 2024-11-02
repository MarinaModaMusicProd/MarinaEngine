export function getTextBetweenHashAndCaret() {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  if (!range) return null;

  // Get the current node and its text content before the caret
  let caretNode = range.endContainer;
  const caretOffset = range.endOffset;
  // Check if the caretNode is an element with one text node child
  if (
    caretNode.nodeType === Node.ELEMENT_NODE &&
    caretNode.childNodes.length === 1 &&
    caretNode.firstChild?.nodeType === Node.TEXT_NODE
  ) {
    caretNode = caretNode.firstChild; // If so, use the text node as the caretNode
  }

  // If the caret is in a text node, retrieve the text before the caret
  if (caretNode.nodeType === Node.TEXT_NODE) {
    const textBeforeCaret = caretNode.textContent?.substring(0, caretOffset);
    if (!textBeforeCaret) return null;

    // Find the last occurrence of #
    const hashIndex = textBeforeCaret.lastIndexOf('#');

    if (hashIndex !== -1) {
      const distanceFromHashToCaret = textBeforeCaret.length - (hashIndex + 1);

      // Get the bounding rectangle of the hash symbol
      const rangeForHash = document.createRange();
      rangeForHash.setStart(caretNode, hashIndex);
      rangeForHash.setEnd(caretNode, hashIndex + 1);

      // If the # is within 30 characters of the caret, return the substring
      if (distanceFromHashToCaret === 0 || distanceFromHashToCaret <= 30) {
        return {
          text: textBeforeCaret.substring(hashIndex + 1),
          rect: domRectToVirtualPoint(rangeForHash.getBoundingClientRect()),
        };
      }
    }
  }

  return null;
}

export function domRectToVirtualPoint(rect: DOMRect) {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
}
