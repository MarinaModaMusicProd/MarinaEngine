import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {Trans} from '@ui/i18n/trans';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {useFormContext} from 'react-hook-form';
import {ChatWidgetAppearanceFormValue} from '@livechat/admin/appearance/chat-widget-appearance/chat-widget-appearance-form';
import {useSortable} from '@ui/interactions/dnd/sortable/use-sortable';
import {useRef, useState} from 'react';
import {IconButton} from '@ui/buttons/icon-button';
import {DragIndicatorIcon} from '@ui/icons/material/DragIndicator';
import {moveItemInNewArray} from '@ui/utils/array/move-item-in-new-array';
import {AppearanceSectionTitle} from '@common/admin/appearance/appearance-section-title';
import {Checkbox} from '@ui/forms/toggle/checkbox';
import {widgetNavigationTabs} from '@livechat/widget/widget-navigation/widget-navigation';

export function ChatWidgetScreensConfig() {
  return (
    <div className="space-y-20">
      <FormSelect
        name="settings.chatWidget.defaultScreen"
        selectionMode="single"
        label={<Trans message="Default screen" />}
      >
        {widgetNavigationTabs.map(tab => (
          <Item key={tab.route} value={tab.route}>
            <Trans {...tab.label} />
          </Item>
        ))}
        <Item value="chats/new">
          <Trans message="New chat" />
        </Item>
      </FormSelect>
      <FormSwitch name="settings.chatWidget.hideNavigation">
        <Trans message="Hide bottom navigation" />
      </FormSwitch>
      <ScreenEditor />
    </div>
  );
}

function ScreenEditor() {
  const availableScreens = widgetNavigationTabs.map(tab => tab.route);
  const form = useFormContext<ChatWidgetAppearanceFormValue>();

  const getSavedValue = (): string[] => {
    return form.getValues('settings.chatWidget.screens') || [];
  };

  const [allScreens, setAllScreens] = useState(() => {
    const savedValue = getSavedValue();
    const sortFn = (x: string) =>
      savedValue.includes(x) ? savedValue.indexOf(x) : savedValue.length;
    return [...availableScreens].sort((a, b) => sortFn(a) - sortFn(b));
  });

  return (
    <div>
      <AppearanceSectionTitle>
        <Trans message="Screens" />
      </AppearanceSectionTitle>
      {allScreens.map((item, index) => (
        <ScreenEditorItem
          key={item}
          item={item}
          items={allScreens}
          onToggle={(item, checked) => {
            const savedValue = getSavedValue();
            const newValue = checked
              ? [...savedValue, item]
              : savedValue.filter(x => x !== item);
            form.setValue('settings.chatWidget.screens', newValue, {
              shouldDirty: true,
            });
          }}
          onSortEnd={(oldIndex, newIndex) => {
            const sortedItems = moveItemInNewArray(
              allScreens,
              oldIndex,
              newIndex,
            );
            setAllScreens(sortedItems);
            const savedValue = getSavedValue();
            const newValue = sortedItems
              .filter(x => savedValue.includes(x))
              .map(x => x);
            form.setValue('settings.chatWidget.screens', newValue, {
              shouldDirty: true,
            });
          }}
        />
      ))}
    </div>
  );
}

interface MenuListItemProps {
  item: string;
  items: string[];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
  onToggle: (section: string, checked: boolean) => void;
}
function ScreenEditorItem({
  item,
  items,
  onToggle,
  onSortEnd,
}: MenuListItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const {watch} = useFormContext<ChatWidgetAppearanceFormValue>();
  const {sortableProps, dragHandleRef} = useSortable({
    item,
    items,
    type: 'widgetScreensSortable',
    ref,
    onSortEnd,
    strategy: 'liveSort',
  });

  const savedValue = watch('settings.chatWidget.screens') || [];
  const isChecked = savedValue.includes(item);
  const label = widgetNavigationTabs.find(tab => tab.route === item)!.label;

  return (
    <AppearanceButton
      ref={ref}
      elementType="div"
      startIcon={
        <IconButton ref={dragHandleRef} size="sm">
          <DragIndicatorIcon className="text-muted hover:cursor-move" />
        </IconButton>
      }
      endIcon={
        <Checkbox
          checked={isChecked}
          onChange={() => onToggle(item, !isChecked)}
        />
      }
      {...sortableProps}
    >
      <Trans {...label} />
    </AppearanceButton>
  );
}
