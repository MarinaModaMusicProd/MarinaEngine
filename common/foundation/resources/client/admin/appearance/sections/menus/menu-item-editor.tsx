import {useFieldArray, useFormContext} from 'react-hook-form';
import {Fragment, useEffect} from 'react';
import {appearanceState} from '@common/admin/appearance/appearance-store';
import {Button} from '@ui/buttons/button';
import {DeleteIcon} from '@ui/icons/material/Delete';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Trans} from '@ui/i18n/trans';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {MenuItemForm} from '@common/admin/menus/menu-item-form';
import {useParams} from 'react-router-dom';
import {MenuItemConfig} from '@common/menus/menu-config';

export function AppearanceMenuItemEditor() {
  const {menuIndex, menuItemIndex} = useParams();
  return (
    <MenuItemEditor
      itemsPath={`settings.menus.${menuIndex}.items`}
      itemIndex={menuItemIndex!}
    />
  );
}

interface Props {
  itemsPath: string;
  itemIndex: number | string;
}
export function MenuItemEditor({itemsPath, itemIndex}: Props) {
  const navigate = useNavigate();
  const {getValues} = useFormContext();
  const item = getValues(`${itemsPath}.${itemIndex}`);

  // go to menu editor, if menu item can't be found
  useEffect(() => {
    if (!item) {
      navigate(`..`, {relative: 'path', replace: true});
    } else {
      appearanceState().preview.setHighlight(
        `[data-menu-item-id="${item.id}"]`,
      );
    }
  }, [navigate, item]);

  // only render form when menu and item are available to avoid issues with hook form default values
  if (!item) {
    return null;
  }

  return <MenuItemEditorSection itemsPath={itemsPath} itemIndex={itemIndex} />;
}

function MenuItemEditorSection({itemsPath, itemIndex}: Props) {
  return (
    <Fragment>
      <MenuItemForm formPathPrefix={`${itemsPath}.${itemIndex}`} />
      <div className="mt-40 text-right">
        <DeleteItemTrigger itemsPath={itemsPath} itemIndex={itemIndex} />
      </div>
    </Fragment>
  );
}

function DeleteItemTrigger({itemsPath, itemIndex}: Props) {
  const navigate = useNavigate();
  const {fields} = useFieldArray({
    name: itemsPath,
  });
  const {setValue, getValues} = useFormContext();

  const item = fields[+itemIndex] as MenuItemConfig;

  return (
    <DialogTrigger
      type="modal"
      onClose={isConfirmed => {
        if (isConfirmed) {
          if (itemIndex) {
            const currentItems = getValues(itemsPath) as MenuItemConfig[];
            setValue(
              itemsPath,
              currentItems.filter((_, i) => i !== +itemIndex),
              {shouldDirty: true},
            );
            navigate(`..`, {relative: 'path', replace: true});
          }
        }
      }}
    >
      <Button
        variant="outline"
        color="danger"
        size="xs"
        startIcon={<DeleteIcon />}
      >
        <Trans message="Delete this item" />
      </Button>
      <ConfirmationDialog
        isDanger
        title={<Trans message="Delete item" />}
        body={
          <Trans
            message="Are you sure you want to delete “:name“?"
            values={{name: item.label}}
          />
        }
        confirm={<Trans message="Delete" />}
      />
    </DialogTrigger>
  );
}
