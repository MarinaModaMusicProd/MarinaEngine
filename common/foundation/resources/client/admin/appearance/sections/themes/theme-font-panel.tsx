import {FontSelector} from '@common/ui/font-selector/font-selector';
import {useFormContext} from 'react-hook-form';
import {
  appearanceState,
  AppearanceEditorValues,
} from '@common/admin/appearance/appearance-store';
import {useParams} from 'react-router-dom';

type Font = 'appearance.themes.1.font';

export function ThemeFontPanel() {
  const {setValue, watch} = useFormContext<AppearanceEditorValues>();
  const {themeIndex} = useParams();
  const key = `appearance.themes.${themeIndex}.font` as Font;
  return (
    <FontSelector
      value={watch(key)}
      onChange={font => {
        setValue(key, font, {shouldDirty: true});
        appearanceState().preview.setThemeFont(font);
      }}
    />
  );
}
