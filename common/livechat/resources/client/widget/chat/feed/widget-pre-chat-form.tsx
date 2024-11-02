import {useSettings} from '@ui/settings/use-settings';
import React from 'react';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {HelpOutlineIcon} from '@ui/icons/material/HelpOutline';
import {Button} from '@ui/buttons/button';
import {WidgetFormElementConfig} from '@livechat/widget/widget-config';
import {FormRadioGroup} from '@ui/forms/radio-group/radio-group';
import {FormRadio} from '@ui/forms/radio-group/radio';
import {FormCheckboxGroup} from '@ui/forms/toggle/checkbox-group';
import {Checkbox} from '@ui/forms/toggle/checkbox';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {useForm} from 'react-hook-form';
import {Form} from '@ui/forms/form';
import {useAppearanceEditorMode} from '@common/admin/appearance/commands/use-appearance-editor-mode';
import {useCreateChat} from '@livechat/widget/chat/use-create-chat';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {createPlaceholderChatMessage} from '@livechat/widget/chat/use-submit-chat-message';
import {useTrans} from '@ui/i18n/use-trans';
import {useWidgetBootstrapData} from '@livechat/widget/use-widget-bootstrap-data';

type FormValue = Record<string, any>;

export function WidgetPreChatForm() {
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {trans} = useTrans();
  const {chatWidget} = useSettings();
  const navigate = useNavigate();
  const elements = chatWidget?.forms?.preChat?.elements;
  const form = usePreChatForm();
  const createChat = useCreateChat();
  if (!elements?.length) {
    return null;
  }

  const handleCreateChat = (values: FormValue) => {
    if (isAppearanceEditorActive) return;
    // todo: check if group is set correctly when selected in pre-chat form
    // todo: either store group name as "valueLabel" in form data or get group name from allGroups hook, instead of showing group id in chat feed
    // todo: check Argument of type array will be interpreted as string in the error in logs
    // todo: if form data contains name or email or group_id, assign those to visitor in "storePreChatFormData" method in php
    // todo: implement helpcenter tab in dashboard chat sidebar
    const messages = [];
    if (chatWidget?.defaultMessage) {
      messages.push(
        createPlaceholderChatMessage({
          body: trans({message: chatWidget.defaultMessage}),
          author: 'agent',
        }),
      );
    }

    createChat.mutate(
      {
        messages,
        preChatForm: values,
      },
      {
        onSuccess: ({chat}) => {
          navigate(`/chats/${chat.id}`, {replace: true});
        },
      },
    );
  };

  return (
    <div className="relative mt-44 rounded-panel border px-16 pb-16 pt-24">
      <div className="absolute -top-20 left-0 right-0 mx-auto h-40 w-40 rounded-full bg-primary p-8 text-on-primary">
        <HelpOutlineIcon className="block" />
      </div>
      <Form form={form} className="space-y-16" onSubmit={handleCreateChat}>
        {elements.map(field => (
          <WidgetFormElement element={field} key={field.name} />
        ))}
        <Button
          type="submit"
          variant="flat"
          color="primary"
          className="w-full"
          disabled={createChat.isPending}
        >
          <Trans message="Start the chat" />
        </Button>
      </Form>
    </div>
  );
}

interface WidgetFormElementProps {
  element: WidgetFormElementConfig;
}
function WidgetFormElement({element}: WidgetFormElementProps) {
  switch (element.name) {
    case 'information':
      return <div className="text-sm">{element.message}</div>;
    case 'name':
      return (
        <FormTextField
          size="sm"
          label={<Trans message={element.label} />}
          name={element.id}
          required={element.required}
        />
      );
    case 'email':
      return (
        <FormTextField
          size="sm"
          label={<Trans message={element.label} />}
          name={element.id}
          type="email"
          required={element.required}
        />
      );
    case 'input':
      return (
        <FormTextField
          size="sm"
          label={<Trans message={element.label} />}
          name={element.id}
          required={element.required}
        />
      );
    case 'radio':
      return (
        <FormRadioGroup
          name={element.id}
          label={<Trans message={element.label} />}
          size="sm"
          required={element.required}
        >
          {element.options?.map(option => (
            <FormRadio key={option.id} value={option.label}>
              {option.label}
            </FormRadio>
          ))}
        </FormRadioGroup>
      );
    case 'checkboxes':
      return (
        <FormCheckboxGroup
          name={element.id}
          label={<Trans message={element.label} />}
        >
          {element.options?.map(option => (
            <Checkbox key={option.id} value={option.label} size="sm">
              {option.label}
            </Checkbox>
          ))}
        </FormCheckboxGroup>
      );
    case 'dropdown':
    case 'group':
      return (
        <FormSelect
          selectionMode="single"
          name={element.id}
          label={<Trans message={element.label} />}
          size="sm"
          required={element.required}
        >
          {element.options?.map(option => (
            <Item key={option.id} value={option.value || option.label}>
              {option.label}
            </Item>
          ))}
        </FormSelect>
      );
  }
}

function usePreChatForm() {
  const data = useWidgetBootstrapData();
  const visitor = data.mostRecentChat.visitor;
  const {chatWidget} = useSettings();
  const defaultValues: FormValue = {};
  chatWidget?.forms?.preChat?.elements.forEach(element => {
    if (element.name in visitor) {
      defaultValues[element.id] = visitor[element.name as keyof typeof visitor];
    }
  });
  return useForm<FormValue>({defaultValues});
}
