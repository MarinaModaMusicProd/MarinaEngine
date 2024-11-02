import {Avatar} from '@ui/avatar/avatar';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import React, {Fragment} from 'react';
import {
  FormVerboseRadioGroup,
  VerboseRadioItem,
} from '@ui/forms/verbose-radio-group/verbose-radio-group';
import {Group} from '@helpdesk/groups/group';
import {CrupdateGroupSectionHeader} from '@livechat/dashboard/groups/crupdate-group-form/crupdate-group-section-header';
import {CrupdateGroupMembersTable} from '@livechat/dashboard/groups/crupdate-group-form/crupdate-group-members-table';
import {useSettings} from '@ui/settings/use-settings';

interface Props {
  group?: Group;
}
export function CrupdateGroupFormContent({group}: Props) {
  const {chat_integrated} = useSettings();
  return (
    <Fragment>
      <div className="mb-44 flex items-center gap-16">
        <Avatar
          label={group?.name ?? 'Group'}
          fallback="initials"
          size="w-66 h-66 text-2xl"
        />
        <FormTextField
          name="name"
          label={<Trans message="Name" />}
          className="flex-auto"
          required
        />
      </div>
      {chat_integrated && <ChatAssignmentSelector />}
      <CrupdateGroupMembersTable group={group} />
    </Fragment>
  );
}

function ChatAssignmentSelector() {
  return (
    <div className="mb-44">
      <CrupdateGroupSectionHeader>
        <Trans message="Choose new chat assignment method" />
      </CrupdateGroupSectionHeader>
      <FormVerboseRadioGroup
        name="chat_assignment_mode"
        layout="horizontalDesktop"
      >
        <VerboseRadioItem
          value="auto"
          label={<Trans message="Auto assignment" />}
          description={
            <Trans message="Chats are evenly distributed among agents with accepting chats status. When all agents hit their limit, new visitors are queued." />
          }
        />
        <VerboseRadioItem
          value="manual"
          label={<Trans message="Manual assignment" />}
          description={
            <Trans message="All agents get notified about a customer waiting in the queue. Chat will be assigned to the first agent who picks it up." />
          }
        />
      </FormVerboseRadioGroup>
    </div>
  );
}
