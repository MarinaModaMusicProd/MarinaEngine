import {useAppearanceEditorValues} from '@common/admin/appearance/requests/use-appearance-editor-values';
import {useForm, UseFormReturn, useWatch} from 'react-hook-form';
import {AppearanceEditorForm} from '@common/admin/appearance/appearance-editor-form';
import {Outlet, useParams} from 'react-router-dom';
import {AppearanceEditorBreadcrumb} from '@common/admin/appearance/appearance-editor-breadcrumb';
import {Trans} from '@ui/i18n/trans';
import {MenuConfig} from '@common/menus/menu-config';

export interface MenuEditorFormValue {
  settings: {
    menus: MenuConfig[];
  };
}

export function MenuEditorForm() {
  const values = useAppearanceEditorValues();
  const form = useForm<MenuEditorFormValue>({
    defaultValues: {
      settings: {
        menus: values.settings.menus,
      },
    },
  });

  return (
    <AppearanceEditorForm
      form={form}
      breadcrumb={<MenuEditorBreadcrumb form={form} />}
      blockerAllowedPath="menus"
    >
      <Outlet />
    </AppearanceEditorForm>
  );
}

interface MenuEditorBreadcrumbProps {
  form: UseFormReturn<MenuEditorFormValue>;
}
function MenuEditorBreadcrumb({form}: MenuEditorBreadcrumbProps) {
  const {menuIndex, menuItemIndex} = useParams();
  const allMenus = useWatch({control: form.control, name: 'settings.menus'});

  const activeMenu = menuIndex ? allMenus[menuIndex as any] : null;
  const activeItem =
    menuItemIndex && activeMenu ? activeMenu.items[menuItemIndex as any] : null;

  return (
    <AppearanceEditorBreadcrumb>
      <Trans message="Menus" />
      {activeMenu && <span>{activeMenu.name}</span>}
      {activeItem && <span>{activeItem.label}</span>}
    </AppearanceEditorBreadcrumb>
  );
}
