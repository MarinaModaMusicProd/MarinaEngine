import {Fragment, useState} from 'react';
import {DeleteIcon} from '@ui/icons/material/Delete';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {IconButton} from '@ui/buttons/icon-button';
import {MoreVertIcon} from '@ui/icons/material/MoreVert';
import {RestartAltIcon} from '@ui/icons/material/RestartAlt';
import {AppearanceEditorValues, appearanceState} from '../../appearance-store';
import {toast} from '@ui/toast/toast';
import {Menu, MenuItem, MenuTrigger} from '@ui/menu/menu-trigger';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {message} from '@ui/i18n/message';
import {Trans} from '@ui/i18n/trans';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useFormContext} from 'react-hook-form';
import {useParams} from 'react-router-dom';

export function ThemeMoreOptionsButton() {
  const navigate = useNavigate();
  const {themeIndex} = useParams();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const {setValue, getValues} = useFormContext<AppearanceEditorValues>();

  const deleteTheme = () => {
    if (getValues('appearance.themes').length <= 1) {
      toast.danger(message('At least one theme is required'));
      return;
    }
    if (themeIndex) {
      navigate('..', {relative: 'path', replace: true});
      setValue(
        'appearance.themes',
        getValues('appearance.themes').filter((_, i) => i !== +themeIndex),
        {shouldDirty: true},
      );
    }
  };

  return (
    <Fragment>
      <MenuTrigger
        onItemSelected={key => {
          if (key === 'delete') {
            setConfirmDialogOpen(true);
          } else if (key === 'reset') {
            const path =
              `appearance.themes.${+themeIndex!}` as 'appearance.themes.0';
            const defaultColors = getValues(`${path}.is_dark`)
              ? appearanceState().defaults!.appearance.themes.dark
              : appearanceState().defaults!.appearance.themes.light;

            Object.entries(defaultColors).forEach(([colorName, themeValue]) => {
              appearanceState().preview.setThemeValue(colorName, themeValue);
            });
            appearanceState().preview.setThemeFont(null);

            setValue(`${path}.values`, defaultColors, {
              shouldDirty: true,
            });
            setValue(`${path}.font`, undefined, {
              shouldDirty: true,
            });
          }
        }}
      >
        <IconButton size="md" className="text-muted">
          <MoreVertIcon />
        </IconButton>
        <Menu>
          <MenuItem value="reset" startIcon={<RestartAltIcon />}>
            <Trans message="Reset colors" />
          </MenuItem>
          <MenuItem value="delete" startIcon={<DeleteIcon />}>
            <Trans message="Delete" />
          </MenuItem>
        </Menu>
      </MenuTrigger>
      <DialogTrigger
        type="modal"
        isOpen={confirmDialogOpen}
        onClose={isConfirmed => {
          if (isConfirmed) {
            deleteTheme();
          }
          setConfirmDialogOpen(false);
        }}
      >
        <ConfirmationDialog
          isDanger
          title={<Trans message="Delete theme" />}
          body={<Trans message="Are you sure you want to delete this theme?" />}
          confirm={<Trans message="Delete" />}
        />
      </DialogTrigger>
    </Fragment>
  );
}
