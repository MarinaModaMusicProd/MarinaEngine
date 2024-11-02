import {Avatar, AvatarProps} from '@ui/avatar/avatar';
import {OnlineStatusCircle} from '@ui/badge/online-status-circle';
import {useIsAgentOnline} from '@livechat/dashboard/agents/use-is-agent-online';

interface Props {
  user: {id: number | string; name: string; image?: string};
  size?: AvatarProps['size'];
  className?: string;
}
export function AgentAvatar({user, size, className}: Props) {
  return (
    <Avatar
      label={user.name}
      src={user.image}
      fallback="initials"
      circle
      size={size}
      className={className}
    />
  );
}

interface AgentAvatarWithIndicatorProps extends Props {
  showAwayIcon?: boolean;
}
export function AgentAvatarWithIndicator({
  showAwayIcon,
  ...props
}: AgentAvatarWithIndicatorProps) {
  const isOnline = useIsAgentOnline(props.user.id);
  return (
    <div className="relative">
      <AgentAvatar {...props} />
      <OnlineStatusCircle
        isOnline={isOnline}
        showAwayIcon={showAwayIcon}
        className="absolute -left-2 -top-2"
      />
    </div>
  );
}
