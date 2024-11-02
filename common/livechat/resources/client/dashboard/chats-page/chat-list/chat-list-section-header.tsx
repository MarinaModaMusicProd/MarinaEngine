import {ReactNode} from 'react';
import {Button} from '@ui/buttons/button';
import {KeyboardArrowDownIcon} from '@ui/icons/material/KeyboardArrowDown';
import {Trans} from '@ui/i18n/trans';

interface Props {
  children: ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  onSortChange: () => void;
  activeSort: 'newest' | 'oldest';
}
export function ChatListSectionHeader({
  children,
  onToggle,
  onSortChange,
  activeSort,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-14 p-8">
      <Button startIcon={<KeyboardArrowDownIcon />} onClick={() => onToggle()}>
        {children}
      </Button>
      <Button endIcon={<KeyboardArrowDownIcon />}>
        <Trans message="Newest" />
      </Button>
    </div>
  );
}
