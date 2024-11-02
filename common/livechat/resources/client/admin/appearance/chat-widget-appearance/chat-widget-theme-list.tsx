import {ThemeList} from '@common/admin/appearance/sections/themes/theme-list';
import React from 'react';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {Trans} from '@ui/i18n/trans';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@ui/buttons/external-link';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';

export function ChatWidgetThemeList() {
  return (
    <ThemeList type="chatWidget">
      <FormSelect
        selectionMode="single"
        name="settings.chatWidget.defaultTheme"
        label={<Trans message="Default mode" />}
        className="mb-20"
      >
        <Item value="light">
          <Trans message="Light" />
        </Item>
        <Item value="dark">
          <Trans message="Dark" />
        </Item>
        <Item value="system">
          <Trans message="System" />
        </Item>
      </FormSelect>
      <FormSwitch
        className="mb-20"
        name="settings.chatWidget.inheritThemes"
        description={
          <Trans
            message="Use themes configured <a>globally</a>, or set unique colors for chat widget."
            values={{
              a: text => (
                <Link
                  className={LinkStyle}
                  to="/admin/appearance/themes"
                  target="_blank"
                >
                  {text}
                </Link>
              ),
            }}
          />
        }
      >
        <Trans message="Use global themes" />
      </FormSwitch>
      <div className="my-20 h-1 w-full bg-divider" />
    </ThemeList>
  );
}
