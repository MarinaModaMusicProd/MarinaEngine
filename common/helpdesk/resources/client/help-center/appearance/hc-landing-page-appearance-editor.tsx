import {appearanceState} from '@common/admin/appearance/appearance-store';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {FormImageSelector} from '@common/uploads/components/image-selector';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {useForm} from 'react-hook-form';
import {InfoDialogTrigger} from '@ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';
import {SimpleBackgroundPositionSelector} from '@common/background-selector/image-background-tab/simple-background-position-selector';
import {useAppearanceEditorValues} from '@common/admin/appearance/requests/use-appearance-editor-values';
import {HcLandingPageConfig} from '@helpdesk/help-center/appearance/hc-landing-page-config';
import {AppearanceEditorForm} from '@common/admin/appearance/appearance-editor-form';
import {AppearanceEditorBreadcrumb} from '@common/admin/appearance/appearance-editor-breadcrumb';

interface Payload {
  settings: {
    hcLanding: HcLandingPageConfig;
  };
}

export function HcLandingPageAppearanceEditor() {
  const values = useAppearanceEditorValues();
  const form = useForm<Payload>({
    defaultValues: {
      settings: {
        hcLanding: {
          articles_per_category:
            values.settings.hcLanding.articles_per_category,
          children_per_category:
            values.settings.hcLanding.children_per_category,
          hide_small_categories:
            values.settings.hcLanding.hide_small_categories,
          header: {
            variant: values.settings.hcLanding.header?.variant ?? 'simple',
            background: values.settings.hcLanding.header?.background ?? '',
            backgroundPosition:
              values.settings.hcLanding.header?.backgroundPosition ?? '',
            title: values.settings.hcLanding.header?.title ?? '',
            subtitle: values.settings.hcLanding.header?.subtitle ?? '',
            placeholder: values.settings.hcLanding.header?.placeholder ?? '',
          },
          content: {
            variant:
              values.settings.hcLanding.content?.variant ?? 'articleGrid',
          },
          show_footer: values.settings.hcLanding.show_footer,
        },
      },
    },
  });
  return (
    <AppearanceEditorForm
      breadcrumb={
        <AppearanceEditorBreadcrumb>
          <Trans message="Help center landing page" />
        </AppearanceEditorBreadcrumb>
      }
      form={form}
    >
      <FormSelect
        selectionMode="single"
        label={<Trans message="Header style" />}
        className="mb-24"
        name="settings.hcLanding.header.variant"
      >
        <Item value="simple">
          <Trans message="Simple" />
        </Item>
        <Item value="colorful">
          <Trans message="Colorful" />
        </Item>
      </FormSelect>
      <FormImageSelector
        name="settings.hcLanding.header.background"
        className="mb-12"
        label={<Trans message="Header image" />}
        defaultValue={''}
        diskPrefix="homepage"
      />
      <SimpleBackgroundPositionSelector
        compactLabels
        value={form.watch('settings.hcLanding.header')}
        disabled={!form.watch('settings.hcLanding.header.background')}
        onChange={value => {
          form.setValue('settings.hcLanding.header', {
            ...form.getValues('settings.hcLanding.header'),
            ...value,
          });
        }}
        className="mb-20 border-b pb-12"
      />
      <FormSelect
        selectionMode="single"
        label={<Trans message="Content style" />}
        className="mb-12"
        name="settings.hcLanding.content.variant"
      >
        <Item value="articleGrid">
          <Trans message="Article grid" />
        </Item>
        <Item value="multiProduct">
          <Trans message="Multiproduct" />
        </Item>
      </FormSelect>
      {form.watch('settings.hcLanding.content.variant') === 'articleGrid' && (
        <ArticleGridLayoutFields />
      )}
      <FormTextField
        label={<Trans message="Header title" />}
        className="mb-24"
        name="settings.hcLanding.header.title"
        inputElementType="textarea"
        rows={2}
        onFocus={() => {
          appearanceState().preview.setHighlight('[data-testid="headerTitle"]');
        }}
      />
      <FormTextField
        label={<Trans message="Header subtitle" />}
        className="mb-24"
        inputElementType="textarea"
        rows={2}
        name="settings.hcLanding.header.subtitle"
        onFocus={() => {
          appearanceState().preview.setHighlight(
            '[data-testid="headerSubtitle"]',
          );
        }}
      />
      <FormTextField
        label={<Trans message="Search field placeholder" />}
        className="mb-24"
        name="settings.hcLanding.header.placeholder"
        inputElementType="textarea"
        rows={2}
        onFocus={() => {
          appearanceState().preview.setHighlight(
            '[data-testid="headerSubtitle"]',
          );
        }}
      />
      <FormSwitch className="mb-24" name="settings.hcLanding.show_footer">
        <Trans message="Show footer" />
      </FormSwitch>
    </AppearanceEditorForm>
  );
}

function ArticleGridLayoutFields() {
  return (
    <div className="mb-18 border-b pb-18">
      <FormTextField
        name="settings.hcLanding.articles_per_category"
        label={<Trans message="Articles per category" />}
        labelSuffixPosition="inline"
        labelSuffix={
          <InfoDialogTrigger
            body={
              <Trans message="How many articles should each category display in help center homepage." />
            }
          />
        }
        type="number"
        className="mb-12"
        min="1"
        max="50"
      />
      <FormTextField
        name="settings.hcLanding.children_per_category"
        label={<Trans message="Child categories" />}
        labelSuffix={
          <InfoDialogTrigger
            body={
              <Trans message="How many child categories should each parent category display in help center homepage." />
            }
          />
        }
        labelSuffixPosition="inline"
        className="mb-18"
        type="number"
        min="1"
        max="50"
      />
      <FormSwitch name="settings.hcLanding.hide_small_categories">
        <Trans message="Hide empty categories" />
      </FormSwitch>
    </div>
  );
}
