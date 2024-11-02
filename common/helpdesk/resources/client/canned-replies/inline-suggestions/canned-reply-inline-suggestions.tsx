import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {useCannedReplies} from '@helpdesk/canned-replies/requests/use-canned-replies';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {VirtualElement} from '@floating-ui/react-dom';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {List} from '@ui/list/list';
import {ListItemBase} from '@ui/list/list-item-base';
import {
  domRectToVirtualPoint,
  getTextBetweenHashAndCaret,
} from '@helpdesk/canned-replies/inline-suggestions/get-text-between-hash-and-caret';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';

interface Props {
  onSelected: (text: string, reply: CannedReply) => void;
  contentEditableElRef: React.RefObject<HTMLElement | null>;
}

interface Value {
  text: string;
  rect: ReturnType<typeof domRectToVirtualPoint>;
}

export function CannedReplyInlineSuggestions({
  onSelected,
  contentEditableElRef,
}: Props) {
  const [value, setValue] = useState<Value | null>(null);
  const searchTerm = value?.text;

  const {replies} = useCannedReplies(searchTerm);

  useEffect(() => {
    const el = contentEditableElRef.current;
    const events = ['input', 'keyup', 'pointerup'];
    const handler = () => {
      const newValue = getTextBetweenHashAndCaret();
      if (newValue) {
        triggerRef.current = {
          contextElement: contentEditableElRef.current ?? undefined,
          getBoundingClientRect: () => {
            return newValue.rect;
          },
        };
      }
      setValue(newValue);
    };
    if (el) {
      events.forEach(e => el.addEventListener(e, handler));
      return () => {
        events.forEach(e => el.removeEventListener(e, handler));
      };
    }
  }, [contentEditableElRef]);

  const triggerRef = useRef<VirtualElement>(null!);

  const onClose = useCallback(() => {
    setValue(null);
  }, []);

  return (
    <DialogTrigger
      type="popover"
      isOpen={value != null && !!replies.length}
      onOpenChange={isOpen => !isOpen && onClose()}
      moveFocusToDialog={false}
      returnFocusToTrigger={false}
      triggerRef={triggerRef}
      placement="bottom-start"
      shiftCrossAxis={false}
      offset={6}
    >
      <Dialog size="2xs">
        <DialogBody padding="p-0">
          <ReplyList
            replies={replies}
            onClose={onClose}
            onSelected={reply => {
              if (searchTerm != null) {
                onSelected(searchTerm, reply);
              }
            }}
            contextElementRef={contentEditableElRef}
          />
        </DialogBody>
      </Dialog>
    </DialogTrigger>
  );
}

interface ReplyListProps {
  replies: CannedReply[];
  contextElementRef: React.RefObject<HTMLElement | null>;
  onSelected: (reply: CannedReply) => void;
  onClose: () => void;
}
function ReplyList({
  replies,
  contextElementRef,
  onSelected,
  onClose,
}: ReplyListProps) {
  const {close} = useDialogContext();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const callbackRef = useRef<(index?: number) => void>(null!);
  callbackRef.current = (index?: number) => {
    onSelected(replies[index ?? activeIndex]);
    close();
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [replies]);

  useEffect(() => {
    const contextEl = contextElementRef.current;

    const scrollIntoView = (index: number) => {
      if (listRef.current) {
        listRef.current.children[index]?.scrollIntoView({
          block: 'nearest',
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setActiveIndex(prev => {
          const newIndex = Math.min(prev + 1, replies.length - 1);
          scrollIntoView(newIndex);
          return newIndex;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setActiveIndex(prev => {
          const newIndex = Math.max(prev - 1, 0);
          scrollIntoView(newIndex);
          return newIndex;
        });
      } else if (e.key === 'Enter') {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
        callbackRef.current();
      }
    };
    // override tiptap editor keybinds
    contextEl?.addEventListener('keydown', handleKeyDown, {capture: true});
    return () => {
      contextEl?.removeEventListener('keydown', handleKeyDown, {capture: true});
    };
  }, [replies.length, contextElementRef, onClose]);

  return (
    <List className="max-h-384 overflow-y-auto" listRef={listRef}>
      {replies.map((reply, index) => (
        <ListItemBase
          key={reply.id}
          isActive={activeIndex === index}
          onClick={() => {
            onSelected(reply);
            close();
          }}
        >
          {reply.name}
        </ListItemBase>
      ))}
    </List>
  );
}
