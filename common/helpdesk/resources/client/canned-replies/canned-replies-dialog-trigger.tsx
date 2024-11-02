import {IconButton} from '@ui/buttons/icon-button';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {Trans} from '@ui/i18n/trans';
import {Tooltip} from '@ui/tooltip/tooltip';
import React, {Fragment, ReactElement, useRef, useState} from 'react';
import {useCannedReplies} from '@helpdesk/canned-replies/requests/use-canned-replies';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {List, ListItem} from '@ui/list/list';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {TextField} from '@ui/forms/input-field/text-field/text-field';
import {AddIcon} from '@ui/icons/material/Add';
import {SettingsIcon} from '@ui/icons/material/Settings';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {SearchIcon} from '@ui/icons/material/Search';
import {Link} from 'react-router-dom';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {CreateCannedReplyDialog} from '@helpdesk/canned-replies/datatable/create-canned-reply-dialog';
import {ButtonProps} from '@ui/buttons/button';
import {CannedReply} from '@helpdesk/canned-replies/canned-reply';
import {CreateCannedReplyPayload} from '@helpdesk/canned-replies/requests/use-create-canned-reply';
import {Placement} from '@floating-ui/react-dom';

interface Props {
  children: ReactElement<ButtonProps>;
  onSelected: (reply: CannedReply) => void;
  getInitialData?: () => Partial<CreateCannedReplyPayload>;
  placement?: Placement;
}
export function CannedRepliesDialogTrigger({
  children,
  onSelected,
  getInitialData,
  placement,
}: Props) {
  const [newReplyDialogIsOpen, setNewReplyDialogIsOpen] = useState(false);

  return (
    <Fragment>
      <DialogTrigger
        type="popover"
        placement={placement}
        onClose={reply => {
          if (reply) {
            onSelected(reply);
          }
        }}
      >
        <Tooltip label={<Trans message="Saved replies" />}>{children}</Tooltip>
        <RepliesDialog
          onNewReplyDialogOpen={() => setNewReplyDialogIsOpen(true)}
        />
      </DialogTrigger>
      <DialogTrigger
        type="modal"
        isOpen={newReplyDialogIsOpen}
        onOpenChange={setNewReplyDialogIsOpen}
      >
        <CreateCannedReplyDialog getInitialData={getInitialData} />
      </DialogTrigger>
    </Fragment>
  );
}

interface RepliesDialogProps {
  onNewReplyDialogOpen: () => void;
}
function RepliesDialog({onNewReplyDialogOpen}: RepliesDialogProps) {
  const [query, setQuery] = useState('');
  const {trans} = useTrans();
  const {replies, isLoading, isFetching} = useCannedReplies(query);
  const {close} = useDialogContext();
  const firstListItemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog size="xs">
      <DialogBody padding="p-0">
        <div className="flex min-h-48 items-center border-b focus-within:border-primary">
          <TextField
            value={query}
            onChange={e => setQuery(e.target.value)}
            inputRef={inputRef}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                firstListItemRef.current?.focus();
              }
            }}
            startAdornment={
              !isLoading && isFetching ? (
                <ProgressCircle size="w-24 h-24" isIndeterminate />
              ) : (
                <SearchIcon />
              )
            }
            className="flex-auto"
            inputBorder="border-none"
            inputShadow="shadow-none"
            inputRing="ring-0"
            placeholder={trans(message('Search...'))}
          />
          <Tooltip label={<Trans message="Create new reply" />}>
            <IconButton
              onClick={() => {
                close();
                onNewReplyDialogOpen();
              }}
              className="ml-8"
              variant="outline"
              size="xs"
              iconSize="sm"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label={<Trans message="Manage saved replies" />}>
            <IconButton
              elementType={Link}
              to={'/agent/saved-replies'}
              className="mx-8"
              variant="outline"
              size="xs"
              iconSize="sm"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </div>
        <List padding="p-0 overflow-y-auto max-h-400">
          {replies.map((reply, index) => (
            <ListItem
              radius="rounded-none"
              key={reply.id}
              ref={index === 0 ? firstListItemRef : null}
              onKeyDownCapture={
                index === 0
                  ? e => {
                      if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        e.stopPropagation();
                        inputRef.current?.focus();
                      }
                    }
                  : undefined
              }
              onSelected={() => close(reply)}
            >
              {reply.name}
            </ListItem>
          ))}
        </List>
        {isLoading && (
          <div className="flex justify-center py-8">
            <ProgressCircle size="w-24 h-24" isIndeterminate />
          </div>
        )}
        {replies.length === 0 && !isLoading && (
          <div className="p-8 text-sm text-muted">
            <Trans message="No canned replies found" />
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
}
