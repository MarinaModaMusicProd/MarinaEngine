import {useAssignChatToAgent} from '@livechat/dashboard/chats-page/chat-feed/use-assign-chat-to-agent';
import {useAuth} from '@common/auth/use-auth';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {Button, ButtonProps} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import React, {ReactNode} from 'react';

interface PickFromQueueButtonProps {
  chatId: number | string;
  children?: ReactNode;
  size?: ButtonProps['size'];
}
export function PickFromQueueButton({
  chatId,
  children,
  size,
}: PickFromQueueButtonProps) {
  const assignToAgent = useAssignChatToAgent(chatId);
  const {user} = useAuth();
  const navigate = useNavigate();
  return (
    <Button
      variant="flat"
      color="primary"
      size={size}
      disabled={assignToAgent.isPending}
      onClick={() => {
        assignToAgent.mutate(
          {agentId: user!.id},
          {onSuccess: () => navigate(`/agent/chats/${chatId}`)},
        );
      }}
    >
      {children || <Trans message="Pick from quque" />}
    </Button>
  );
}
