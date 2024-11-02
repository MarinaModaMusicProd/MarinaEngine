import {ChatVisitor, CompactChatVisitor} from '@livechat/widget/chat/chat';
import {Trans} from '@ui/i18n/trans';

interface Props {
  visitor?: CompactChatVisitor | ChatVisitor;
  user?: {name: string; image?: string};
  className?: string;
  showIp?: boolean;
}
export function ChatVisitorName({visitor, user, className, showIp}: Props) {
  const ip = (visitor as ChatVisitor)?.user_ip;
  const name =
    user?.name ?? (visitor as ChatVisitor)?.user?.name ?? visitor?.name;
  return (
    <div className={className}>
      {name ?? (showIp ? ip : null) ?? <Trans message="Visitor" />}
    </div>
  );
}
