import React, {
  cloneElement,
  Fragment,
  MutableRefObject,
  ReactElement,
  Suspense,
  useCallback,
  useRef,
  useState,
} from 'react';
import {Editor, FocusPosition} from '@tiptap/react';
import {useDroppable} from '@ui/interactions/dnd/use-droppable';
import {useCallbackRef} from '@ui/utils/hooks/use-callback-ref';
import {FileEntry} from '@common/uploads/file-entry';
import {MixedDraggable} from '@ui/interactions/dnd/use-draggable';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {Trans} from '@ui/i18n/trans';
import {useUploadConversationReplyAttachments} from '@helpdesk/conversation-reply-editor/use-upload-conversation-reply-attachments';
import {ConversationReplyEditorAttachments} from '@helpdesk/conversation-reply-editor/conversation-reply-editor-attachments';
import {ConversationReplyEditorMenubar} from '@helpdesk/conversation-reply-editor/conversation-reply-editor-menubar';
import debounce from 'just-debounce-it';
import {getConversationReplyEditorBody} from '@helpdesk/conversation-reply-editor/use-conversation-reply-editor-ref';

const ArticleBodyEditor = React.lazy(
  () => import('@common/article-editor/article-body-editor'),
);

export interface ReplyEditorToolbarButtonsProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

export interface ConversationReplyEditorOnSubmitValues {
  body: string | null;
  attachments: FileEntry[];
}

interface Props {
  onSubmit: (values: ConversationReplyEditorOnSubmitValues) => void;
  isLoading: boolean;
  initialContent?: string;
  onChange?: () => void;
  className?: string;
  editorRef: MutableRefObject<Editor | null>;
  attachments: FileEntry[];
  onAttachmentsChange: (attachments: FileEntry[]) => void;
  footerButtons?: ReactElement<ReplyEditorToolbarButtonsProps>;
  menubarButtons?: ReactElement<{size: 'sm' | 'md'}>;
  minHeight?: string;
  autoFocus?: FocusPosition;
}
export function ConversationReplyEditor(props: Props) {
  const onSubmit = useCallbackRef(props.onSubmit);
  const {
    initialContent,
    isLoading,
    onChange,
    footerButtons,
    className,
    editorRef,
    attachments,
    onAttachmentsChange,
    menubarButtons,
    minHeight = 'min-h-[243px]',
    autoFocus = 'end',
  } = props;
  const uploadAttachments = useUploadConversationReplyAttachments({
    onSuccess: entry => onAttachmentsChange([...attachments, entry]),
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {droppableProps} = useDroppable({
    id: 'driveRoot',
    ref: containerRef,
    types: ['nativeFile'],
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDrop: async (draggable: MixedDraggable) => {
      if (draggable.type === 'nativeFile') {
        uploadAttachments(await draggable.getData());
      }
    },
  });

  const handleSubmit = useCallback(() => {
    onSubmit({
      body: getConversationReplyEditorBody(editorRef),
      attachments,
    });
  }, [attachments, onSubmit, editorRef]);

  return (
    <div className={className}>
      {!!attachments.length && (
        <ConversationReplyEditorAttachments
          attachments={attachments}
          onRemove={attachment => {
            onAttachmentsChange(
              attachments.filter(a => a.id !== attachment.id),
            );
          }}
        />
      )}
      <div
        className="relative overflow-hidden rounded border"
        {...droppableProps}
      >
        <div className={minHeight}>
          <Suspense>
            <ArticleBodyEditor
              autoFocus={autoFocus}
              initialContent={initialContent}
              minHeight="min-h-184"
              onCtrlEnter={handleSubmit}
              onLoad={editor => {
                editorRef.current = editor;
                //editor.commands.focus('end');

                editor.on(
                  'update',
                  debounce(() => onChange?.(), 300),
                );
              }}
            >
              {(content, editor) => (
                <Fragment>
                  <ConversationReplyEditorMenubar
                    endButtons={menubarButtons}
                    editor={editor}
                    onAttachmentUploaded={entry => {
                      onAttachmentsChange([...attachments, entry]);
                    }}
                  />
                  <div className="m-14">
                    <div className="ticket-reply-body max-w-none text-sm">
                      {content}
                    </div>
                  </div>
                </Fragment>
              )}
            </ArticleBodyEditor>
          </Suspense>
        </div>
        {footerButtons ? (
          <div className="flex justify-end border-t">
            {cloneElement(footerButtons, {isLoading, onSubmit: handleSubmit})}
          </div>
        ) : null}
        <DropTargetMask isVisible={isDragOver} />
      </div>
    </div>
  );
}

interface DropTargetMaskProps {
  isVisible: boolean;
}
function DropTargetMask({isVisible}: DropTargetMaskProps) {
  const mask = (
    <m.div
      key="dragTargetMask"
      {...opacityAnimation}
      transition={{duration: 0.3}}
      className="pointer-events-none absolute inset-0 min-h-full w-full border-2 border-dashed border-primary bg-primary-light/30"
    >
      <m.div
        initial={{y: '100%', opacity: 0}}
        animate={{y: '-10px', opacity: 1}}
        exit={{y: '100%', opacity: 0}}
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-max rounded bg-primary p-10 text-on-primary"
      >
        <Trans message="Drop files to attach them to this reply." />
      </m.div>
    </m.div>
  );
  return <AnimatePresence>{isVisible ? mask : null}</AnimatePresence>;
}
