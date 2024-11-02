import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Trans} from '@ui/i18n/trans';
import {useForm, useFormContext} from 'react-hook-form';
import {
  AppearanceEditorValues,
  appearanceState,
} from '@common/admin/appearance/appearance-store';
import {AceDialog} from '@common/ace-editor/ace-dialog';
import {AppearanceEditorForm} from '@common/admin/appearance/appearance-editor-form';
import {useAppearanceEditorValues} from '@common/admin/appearance/requests/use-appearance-editor-values';
import {AppearanceEditorBreadcrumb} from '@common/admin/appearance/appearance-editor-breadcrumb';

interface FormValue {
  appearance: {
    custom_code: {
      css: string;
      html: string;
    };
  };
}

export function CustomCodeSection() {
  const values = useAppearanceEditorValues();
  const form = useForm<FormValue>({
    defaultValues: {
      appearance: {
        custom_code: {
          css: values.appearance.custom_code.css,
          html: values.appearance.custom_code.html,
        },
      },
    },
  });
  return (
    <AppearanceEditorForm
      form={form}
      breadcrumb={
        <AppearanceEditorBreadcrumb>
          <Trans message="Custom code" />
        </AppearanceEditorBreadcrumb>
      }
    >
      <CustomCodeDialogTrigger mode="css" />
      <CustomCodeDialogTrigger mode="html" />
    </AppearanceEditorForm>
  );
}

interface CustomCodeDialogTriggerProps {
  mode: 'html' | 'css';
}
function CustomCodeDialogTrigger({mode}: CustomCodeDialogTriggerProps) {
  const {getValues} = useFormContext<AppearanceEditorValues>();
  const {setValue} = useFormContext<AppearanceEditorValues>();

  const title =
    mode === 'html' ? (
      <Trans message="Custom HTML & JavaScript" />
    ) : (
      <Trans message="Custom CSS" />
    );

  return (
    <DialogTrigger
      type="modal"
      onClose={newValue => {
        if (newValue != null) {
          setValue(`appearance.custom_code.${mode}`, newValue, {
            shouldDirty: true,
          });
          appearanceState().preview.setCustomCode(mode, newValue);
        }
      }}
    >
      <AppearanceButton>{title}</AppearanceButton>
      <AceDialog
        title={title}
        defaultValue={getValues(`appearance.custom_code.${mode}`) || ''}
        mode={mode}
      />
    </DialogTrigger>
  );
}
