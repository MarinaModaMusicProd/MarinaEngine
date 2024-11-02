import {NavLink, useNavigate} from 'react-router-dom';
import {Fragment, ReactNode} from 'react';
import {appearanceState} from '@common/admin/appearance/appearance-store';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {Button} from '@ui/buttons/button';
import {AddIcon} from '@ui/icons/material/Add';
import {Trans} from '@ui/i18n/trans';
import {useFormContext} from 'react-hook-form';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {randomNumber} from '@ui/utils/string/random-number';
import {ThemeEditorFormValue} from '@common/admin/appearance/sections/themes/theme-editor-form';

interface Props {
  type: string;
  children?: ReactNode;
  disabled?: boolean;
}
export function ThemeList({type, children, disabled}: Props) {
  const {trans} = useTrans();
  const navigate = useNavigate();
  const {watch, getValues, setValue} = useFormContext<ThemeEditorFormValue>();

  return (
    <Fragment>
      {children}
      <div className="mb-20">
        <Button
          size="xs"
          variant="outline"
          color="primary"
          startIcon={<AddIcon />}
          disabled={disabled}
          onClick={() => {
            const lightThemeColors =
              appearanceState().defaults?.appearance.themes.light!;

            const currentThemes = getValues('appearance.themes');

            setValue(
              'appearance.themes',
              [
                ...currentThemes,
                {
                  id: randomNumber(),
                  name: trans(message('New theme')),
                  values: lightThemeColors,
                  type,
                },
              ],
              {shouldDirty: true},
            );

            navigate(`${currentThemes.length}`);
          }}
        >
          <Trans message="New theme" />
        </Button>
      </div>
      {watch('appearance.themes').map((field, index) => (
        <AppearanceButton
          key={field.id}
          to={`${index}`}
          elementType={NavLink}
          disabled={disabled}
        >
          {field.name}
        </AppearanceButton>
      ))}
    </Fragment>
  );
}
