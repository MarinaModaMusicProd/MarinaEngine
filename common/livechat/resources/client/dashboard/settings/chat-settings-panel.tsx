import {Trans} from '@ui/i18n/trans';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import React, {ReactNode, useState} from 'react';
import {useForm, useFormContext} from 'react-hook-form';
import {Checkbox, FormCheckbox} from '@ui/forms/toggle/checkbox';
import {message} from '@ui/i18n/message';
import {MessageDescriptor} from '@ui/i18n/message-descriptor';
import clsx from 'clsx';
import {Tabs} from '@ui/tabs/tabs';
import {TabList} from '@ui/tabs/tab-list';
import {Tab} from '@ui/tabs/tab';
import {TabPanel, TabPanels} from '@ui/tabs/tab-panels';
import {
  FormVerboseRadioGroup,
  VerboseRadioItem,
} from '@ui/forms/verbose-radio-group/verbose-radio-group';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@ui/buttons/external-link';
import {RouteIcon} from '@ui/icons/material/Route';
import {StyleIcon} from '@ui/icons/material/Style';

const agentTimeoutLabel = message(
  'When agent has not responded for :minutes minutes, transfer visitor to another agent.',
);
const inactivityTimeoutLabel = message(
  'When there are no messages for :minutes minutes, mark chat as inactive.',
);
const archiveTimeoutLabel = message(
  'When there are no messages for :minutes minutes, close the chat.',
);

export function ChatSettingsPanel() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Chat settings" />}
      description={
        <div>
          <Trans message="Configure settings related to chat assignment, routing, inactivity and file sharing." />
          <div className="mt-14 flex items-center gap-8">
            <RouteIcon size="sm" className="text-primary" />
            <Link to="/admin/triggers" className={LinkStyle} target="_blank">
              <Trans message="Route chats to groups by creating a trigger" />
            </Link>
          </div>
          <div className="mt-14 flex items-center gap-8">
            <StyleIcon size="sm" className="text-primary" />
            <Link
              to="/admin/appearance/chat-widget"
              className={LinkStyle}
              target="_blank"
            >
              <Trans message="Edit chat widget appearance" />
            </Link>
          </div>
        </div>
      }
    >
      {data => <Form data={data} />}
    </AdminSettingsLayout>
  );
}

interface FormProps {
  data: AdminSettings;
}

function Form({data}: FormProps) {
  const form = useForm<AdminSettings>({
    defaultValues: {
      client: {
        lc: {
          assignment: data.client.lc?.assignment ?? 'auto',
          timeout: {
            agent: data.client.lc?.timeout?.agent ?? 5,
            inactive: data.client.lc?.timeout?.inactive ?? 10,
            archive: data.client.lc?.timeout?.archive ?? 15,
          },
          uploads: {
            agent: data.client.lc?.uploads?.agent ?? false,
            visitor: data.client.lc?.uploads?.visitor ?? false,
          },
        },
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <Tabs>
        <TabList>
          <Tab>
            <Trans message="General" />
          </Tab>
          <Tab>
            <Trans message="Routing" />
          </Tab>
        </TabList>
        <TabPanels className="pt-24">
          <TabPanel>
            <SectionTitle>
              <Trans message="Chat assignments" />
            </SectionTitle>
            <FormVerboseRadioGroup
              name="client.lc.assignment"
              className="mb-24"
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
            <SectionTitle>
              <Trans message="Inactivity timeouts" />
            </SectionTitle>
            <TimeoutSettingLayout
              name="client.lc.timeout.agent"
              defaultValue={5}
              label={agentTimeoutLabel}
              description={
                <Trans
                  message="Applies only if the chat has just started. All subsequent responses
            can taken longer and will not result in a transfer."
                />
              }
            />
            <TimeoutSettingLayout
              name="client.lc.timeout.inactive"
              defaultValue={10}
              label={inactivityTimeoutLabel}
              description={
                <Trans message="Inactive chats are not included in agents' concurrent chats limit." />
              }
            />
            <TimeoutSettingLayout
              name="client.lc.timeout.archive"
              defaultValue={15}
              label={archiveTimeoutLabel}
              description={
                <Trans message="Visitors can reopen closed chats by sending a new message to that chat." />
              }
            />
            <SectionTitle>
              <Trans message="File sharing" />
            </SectionTitle>
            <FormCheckbox name="client.lc.uploads.agent">
              <Trans message="Enable for agents" />
            </FormCheckbox>
            <FormCheckbox name="client.lc.uploads.visitor">
              <Trans message="Enable for visitors" />
            </FormCheckbox>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AdminSettingsForm>
  );
}

interface SectionTitleProps {
  children: ReactNode;
}
function SectionTitle({children}: SectionTitleProps) {
  return <div className="mb-10 text-sm font-semibold">{children}</div>;
}

interface TimeoutSettingLayoutProps {
  name: string;
  defaultValue: number;
  label: MessageDescriptor;
  description: ReactNode;
}
function TimeoutSettingLayout({
  name,
  defaultValue,
  label,
  description,
}: TimeoutSettingLayoutProps) {
  const {getValues, setValue} = useFormContext<any>();
  const [isActive, setIsActive] = useState(() => {
    return !!getValues('client.lc.timeout.agent');
  });

  const handleToggle = () => {
    if (!isActive) {
      setIsActive(true);
      setValue(name, defaultValue);
    } else {
      setIsActive(false);
      setValue(name, '');
    }
  };

  return (
    <div
      className="mb-16 flex h-[116px] select-none items-start gap-14 rounded-panel border p-16"
      onClick={() => handleToggle()}
    >
      <Checkbox checked={isActive} />
      <div className={clsx(!isActive && 'opacity-60')}>
        <div className="mb-6 text-sm">
          <Trans
            message={label.message}
            values={{
              minutes: (
                <FormTextField
                  name={name}
                  size="2xs"
                  type="number"
                  className="mx-4 inline-block max-w-60"
                  onClick={e => e.stopPropagation()}
                />
              ),
            }}
          />
        </div>
        <div className="text-xs text-muted">{description}</div>
      </div>
    </div>
  );
}
