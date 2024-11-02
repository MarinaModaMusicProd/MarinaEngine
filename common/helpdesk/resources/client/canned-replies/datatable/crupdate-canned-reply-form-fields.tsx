import React, {useState} from 'react';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {UseFormReturn, useWatch} from 'react-hook-form';
import {CreateCannedReplyPayload} from '@helpdesk/canned-replies/requests/use-create-canned-reply';
import {ButtonGroup} from '@ui/buttons/button-group';
import {Button} from '@ui/buttons/button';
import {PeopleIcon} from '@ui/icons/material/People';
import {PersonIcon} from '@ui/icons/material/Person';
import {ConversationReplyEditor} from '@helpdesk/conversation-reply-editor/conversation-reply-editor';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {Avatar} from '@ui/avatar/avatar';
import {FormChipField} from '@ui/forms/input-field/chip-field/form-chip-field';
import {useTags} from '@common/tags/use-tags';
import {useTrans} from '@ui/i18n/use-trans';
import {useConversationReplyEditorRef} from '@helpdesk/conversation-reply-editor/use-conversation-reply-editor-ref';
import {useHelpdeskGroupsAutocomplete} from '@helpdesk/groups/requests/use-helpdesk-groups-autocomplete';

interface Props {
  onSubmit: (value: CreateCannedReplyPayload) => void;
  form: UseFormReturn<CreateCannedReplyPayload>;
}
export function CrupdateCannedReplyFormFields({onSubmit, form}: Props) {
  const {editorRef, getReplyBody} = useConversationReplyEditorRef();
  const bodyError = form.formState.errors.body?.message;
  const isShared = useWatch({control: form.control, name: 'shared'});
  const attachments = useWatch({control: form.control, name: 'attachments'});
  const groupQuery = useHelpdeskGroupsAutocomplete();

  const handleSubmit = () => {
    onSubmit({
      ...form.getValues(),
      body: getReplyBody(),
    });
  };

  return (
    <FileUploadProvider>
      <div className="mb-24">
        <ButtonGroup
          size="xs"
          value={isShared}
          onChange={newValue => {
            form.setValue('shared', newValue, {shouldDirty: true});
          }}
        >
          <Button variant="outline" startIcon={<PeopleIcon />} value={true}>
            <Trans message="Shared" />
          </Button>
          <Button variant="outline" startIcon={<PersonIcon />} value={false}>
            <Trans message="Private" />
          </Button>
        </ButtonGroup>
        <div className="mt-10 text-xs text-muted">
          <Trans message="Shared replies will be visible to all agents, not just you." />
        </div>
      </div>
      <FormTextField
        autoFocus
        className="mb-24"
        label={<Trans message="Name" />}
        name="name"
        description={
          <Trans message="Type # followed by the name to quickly insert canned reply." />
        }
      />
      <FormSelect
        className="mb-24"
        selectionMode="single"
        name="groupId"
        label={<Trans message="Group" />}
        description={
          <Trans message="Only agents in this group will see this reply." />
        }
      >
        {groupQuery.data?.groups.map(group => (
          <Item
            value={group.id}
            key={group.id}
            startIcon={<Avatar label={group.name} size="sm" />}
          >
            {group.name}
          </Item>
        ))}
      </FormSelect>
      <div className="mb-4 text-sm">
        <Trans message="Reply text" />
      </div>
      <ConversationReplyEditor
        initialContent={form.getValues('body') || ''}
        className="mb-24"
        minHeight="min-h-[300px]"
        isLoading={false}
        editorRef={editorRef}
        attachments={attachments || []}
        onAttachmentsChange={attachments =>
          form.setValue('attachments', attachments, {shouldDirty: true})
        }
        onSubmit={handleSubmit}
        onChange={() =>
          form.setValue('body', getReplyBody(), {shouldDirty: true})
        }
      />
      {bodyError && (
        <div className="pt-10 text-xs text-danger">{bodyError}</div>
      )}
      <TagField />
    </FileUploadProvider>
  );
}

function TagField() {
  const {trans} = useTrans();
  const [query, setQuery] = useState('');
  const {data, isFetching} = useTags({type: 'custom', query});
  return (
    <FormChipField
      name="tags"
      label={<Trans message="Tags" />}
      isAsync
      isLoading={isFetching}
      inputValue={query}
      onInputValueChange={setQuery}
      suggestions={data?.pagination.data}
      placeholder={trans({message: 'Type tag name...'})}
      description={
        <Trans message="Selected tags will be automatically assigned to conversation." />
      }
    />
  );
}
