import {MutableRefObject, useCallback, useRef} from 'react';
import type {Editor} from '@tiptap/react';

export function useConversationReplyEditorRef() {
  const ref = useRef<Editor | null>(null);

  const getReplyBody = useCallback(() => {
    return getConversationReplyEditorBody(ref);
  }, []);

  return {editorRef: ref, getReplyBody};
}

export function getConversationReplyEditorBody(
  editorRef: MutableRefObject<Editor | null>,
): string | null {
  const body = editorRef.current?.getHTML();
  if (body === '<p></p>') {
    return null;
  }
  return body ?? null;
}
