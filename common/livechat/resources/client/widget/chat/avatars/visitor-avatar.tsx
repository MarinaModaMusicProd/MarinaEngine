import {ChatVisitor, CompactChatVisitor} from '@livechat/widget/chat/chat';
import {useTrans} from '@ui/i18n/use-trans';
import {Avatar, AvatarProps} from '@ui/avatar/avatar';

interface Props {
  visitor?: CompactChatVisitor | ChatVisitor;
  user?: {name: string; image?: string};
  size?: AvatarProps['size'];
  className?: string;
}
export function VisitorAvatar({visitor, user, className, size}: Props) {
  const {trans} = useTrans();
  const label = user?.name || visitor?.email || trans({message: 'visitor'});
  const initialsLabel =
    user?.name || visitor?.email || (visitor as ChatVisitor)?.user_ip;
  return (
    <Avatar
      circle
      fallback="initials"
      label={label}
      labelForBackground={initialsLabel}
      src={user?.image || (visitor as ChatVisitor)?.user?.image}
      className={className}
      size={size}
    />
  );
}
