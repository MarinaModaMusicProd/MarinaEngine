import {
  CrupdateResourceSection,
  DirtyFormSaveDrawer,
} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@ui/i18n/trans';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import React, {useState} from 'react';
import {FormChipField} from '@ui/forms/input-field/chip-field/form-chip-field';
import {Item} from '@ui/forms/listbox/item';
import {Avatar} from '@ui/avatar/avatar';
import {AfterLoginStatusSection} from '@livechat/dashboard/agents/edit-agent-page/after-login-status-section';
import {UserRoleSection} from '@common/admin/users/update-user-page/user-role-section';
import {useAuth} from '@common/auth/use-auth';
import {useForm} from 'react-hook-form';
import {
  UpdateAgentPayload,
  useUpdateAgent,
} from '@livechat/dashboard/agents/edit-agent-page/use-update-agent';
import {useOutletContext} from 'react-router-dom';
import {AgentSettings, FullAgent} from '@helpdesk/agents/agent';
import {Form} from '@ui/forms/form';
import {useHelpdeskGroupsAutocomplete} from '@helpdesk/groups/requests/use-helpdesk-groups-autocomplete';

export function AgentDetailsTab() {
  const agent = useOutletContext() as FullAgent;
  const form = useForm<UpdateAgentPayload>({
    defaultValues: {
      first_name: agent.first_name ?? '',
      last_name: agent.last_name ?? '',
      agent_settings: {
        chat_limit: agent.agent_settings.chat_limit,
        accepts_chats: agent.agent_settings.accepts_chats,
        working_hours: buildWorkingHours(agent),
      },
      groups: agent.groups,
      roles: agent.roles,
    },
  });
  const updateAgent = useUpdateAgent(form);

  return (
    <Form
      onSubmit={values => {
        updateAgent.mutate(values);
      }}
      onBeforeSubmit={() => form.clearErrors()}
      form={form}
    >
      <div className="mb-24 flex gap-44">
        <FormTextField
          name="first_name"
          label={<Trans message="First name" />}
          className="flex-auto"
        />
        <FormTextField
          name="last_name"
          label={<Trans message="Last name" />}
          className="flex-auto"
        />
      </div>
      <FormTextField
        name="agent_settings.chat_limit"
        label={<Trans message="Chat limit" />}
        type="number"
        description={
          <Trans message="How many chats agent can handle at the same time" />
        }
      />
      <GroupSection />
      <UserRoleSection endpoint="helpdesk/autocomplete/roles" />
      <AfterLoginStatusSection />
      <DirtyFormSaveDrawer isLoading={updateAgent.isPending} />
    </Form>
  );
}

function GroupSection() {
  const [query, setQuery] = useState('');
  const {data} = useHelpdeskGroupsAutocomplete({query});
  const {hasPermission} = useAuth();
  return (
    <CrupdateResourceSection label={<Trans message="Groups" />} margin="my-44">
      <FormChipField
        className="mb-30"
        name="groups"
        suggestions={data?.groups}
        inputValue={query}
        onInputValueChange={setQuery}
        alwaysShowAvatar
        readOnly={!hasPermission('users.update')}
      >
        {suggestion => (
          <Item
            key={suggestion.id}
            value={suggestion.id}
            startIcon={<Avatar label={suggestion.name} />}
          >
            {suggestion.name}
          </Item>
        )}
      </FormChipField>
    </CrupdateResourceSection>
  );
}

function buildWorkingHours(agent: FullAgent) {
  const formWorkingHours: AgentSettings['working_hours'] = {};
  for (let i = 0; i < 7; i++) {
    const shouldEnable = !!agent.agent_settings.working_hours?.[i];
    formWorkingHours[i] = agent.agent_settings.working_hours?.[i] ?? {
      from: '09:00',
      to: '17:00',
    };
    formWorkingHours[i].enable = shouldEnable;
  }
  return formWorkingHours;
}
