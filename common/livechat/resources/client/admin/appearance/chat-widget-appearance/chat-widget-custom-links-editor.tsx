import {MenuItemsManager} from '@common/admin/appearance/sections/menus/appearance-menu-editor';
import {MenuItemEditor} from '@common/admin/appearance/sections/menus/menu-item-editor';
import {useParams} from 'react-router-dom';

export function ChatWidgetCustomLinksEditor() {
  return <MenuItemsManager formPath="settings.chatWidget.homeLinks" />;
}

export function ChatWidgetCustomLinkForm() {
  const {menuItemIndex} = useParams();
  return (
    <MenuItemEditor
      itemsPath="settings.chatWidget.homeLinks"
      itemIndex={menuItemIndex!}
    />
  );
}
