import {Trans} from '@ui/i18n/trans';
import {ReactNode} from 'react';
import {PreChatFormData} from '@livechat/widget/chat/chat';

interface Props {
  data: PreChatFormData['body'];
}
export function PreChatFormDataPanel({data}: Props) {
  return (
    <div className="space-y-8 text-sm">
      {data.map(item => (
        <PanelItem label={<Trans message={item.label} />} key={item.id}>
          {item.value}
        </PanelItem>
      ))}
    </div>
  );
}

interface PanelItemProps {
  label: ReactNode;
  children: ReactNode;
}
function PanelItem({label, children}: PanelItemProps) {
  return (
    <div>
      <span className="text-muted">{label}</span>: {children}
    </div>
  );
}
