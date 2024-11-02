import {useWidgetAgentsAcceptingChats} from '@livechat/widget/use-all-widget-agents';
import {useSettings} from '@ui/settings/use-settings';
import {useAppearanceEditorMode} from '@common/admin/appearance/commands/use-appearance-editor-mode';
import React, {Fragment, ReactNode} from 'react';
import {HourglassEmptyIcon} from '@ui/icons/material/HourglassEmpty';
import {Trans} from '@ui/i18n/trans';
import {UseWidgetChatResponse} from '@livechat/widget/chat/active-chat-screen/use-widget-chat';

interface Props {
  data?: UseWidgetChatResponse;
}
export function ActiveChatStatusMessage({data}: Props) {
  const agents = useWidgetAgentsAcceptingChats();
  const {chatWidget} = useSettings();
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  let message: ReactNode;

  // all agents are away or not accepting chats
  if (
    (!agents?.length || isAppearanceEditorActive) &&
    chatWidget?.agentsAwayMessage
  ) {
    message = (
      <Fragment>
        <HourglassEmptyIcon size="sm" className="mr-4" />
        <Trans message={chatWidget.agentsAwayMessage} />
      </Fragment>
    );
  }

  // all agents are currently busy, this chat is in queue
  if (data?.chat.status === 'queued' && chatWidget?.inQueueMessage) {
    message = (
      <Fragment>
        <HourglassEmptyIcon size="sm" className="mr-4" />
        <Trans
          message={chatWidget.inQueueMessage}
          values={{
            number: data.queuedChatInfo?.positionInQueue,
            minutes: data.queuedChatInfo?.estimatedWaitTime,
          }}
        />
      </Fragment>
    );
  }

  if (!message) {
    return null;
  }

  return (
    <div className="mb-20 rounded-panel border bg-chip px-10 py-8 text-sm">
      {message}
    </div>
  );
}
