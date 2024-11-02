import {useAppearanceEditorMode} from '@common/admin/appearance/commands/use-appearance-editor-mode';

export function useIsWidgetInline(): boolean {
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  return isAppearanceEditorActive;
}
