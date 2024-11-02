import {FormSelect, Option} from '@ui/forms/select/select';
import {FetchValueListsResponse, useValueLists} from '@common/http/value-lists';
import {Section} from '@ui/forms/listbox/section';
import {FormRadio} from '@ui/forms/radio-group/radio';
import {FormRadioGroup} from '@ui/forms/radio-group/radio-group';
import {DateFormatPresets, FormattedDate} from '@ui/i18n/formatted-date';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {Trans} from '@ui/i18n/trans';
import {useCurrentDateTime} from '@ui/i18n/use-current-date-time';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import React from 'react';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {useForm} from 'react-hook-form';

export function LocalizationSettings() {
  const optionQuery = useValueLists(['timezones', 'localizations']);
  return (
    <AdminSettingsLayout
      title={<Trans message="Localization" />}
      description={
        <Trans message="Configure global date, time and language settings." />
      }
      isLoading={optionQuery.isLoading}
    >
      {data => (
        <Form
          data={data}
          timezones={optionQuery.data!.timezones}
          localizations={optionQuery.data!.localizations}
        />
      )}
    </AdminSettingsLayout>
  );
}

interface FormProps {
  data: AdminSettings;
  timezones: FetchValueListsResponse['timezones'];
  localizations: FetchValueListsResponse['localizations'];
}
function Form({data, timezones, localizations}: FormProps) {
  const today = useCurrentDateTime();
  const {trans} = useTrans();

  const form = useForm<AdminSettings>({
    defaultValues: {
      client: {
        dates: {
          default_timezone: data.client.dates.default_timezone ?? 'auto',
          format: data.client.dates.format ?? 'auto',
        },
        locale: {
          default: data.client.locale?.default ?? 'auto',
        },
        i18n: {
          enable: data.client.i18n.enable ?? true,
        },
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <FormSelect
        className="mb-30"
        required
        name="client.dates.default_timezone"
        showSearchField
        selectionMode="single"
        label={<Trans message="Default timezone" />}
        searchPlaceholder={trans(message('Search timezones'))}
        description={
          <Trans message="Which timezone should be selected by default for new users and guests." />
        }
      >
        <Option key="auto" value="auto">
          <Trans message="Auto" />
        </Option>
        {Object.entries(timezones!).map(([groupName, timezones]) => (
          <Section key={groupName} label={groupName}>
            {timezones.map(timezone => (
              <Option key={timezone.value} value={timezone.value}>
                {timezone.text}
              </Option>
            ))}
          </Section>
        ))}
      </FormSelect>
      <FormSelect
        name="client.locale.default"
        className="mb-30"
        selectionMode="single"
        label={<Trans message="Default language" />}
        description={
          <Trans message="Which localization should be selected by default for new users and guests." />
        }
      >
        <Option key="auto" value="auto">
          <Trans message="Auto" />
        </Option>
        {localizations!.map(locale => (
          <Option key={locale.language} value={locale.language} capitalizeFirst>
            {locale.name}
          </Option>
        ))}
      </FormSelect>
      <FormRadioGroup
        required
        className="mb-30"
        size="sm"
        name="client.dates.format"
        orientation="vertical"
        label={<Trans message="Date verbosity" />}
        description={
          <Trans message="Default verbosity for all dates displayed across the site. Month/day order and separators will be adjusted automatically, based on user's locale." />
        }
      >
        <FormRadio key="auto" value="auto">
          <Trans message="Auto" />
        </FormRadio>
        {Object.entries(DateFormatPresets).map(([format, options]) => (
          <FormRadio key={format} value={format}>
            <FormattedDate date={today} options={options} />
          </FormRadio>
        ))}
      </FormRadioGroup>
      <FormSwitch
        name="client.i18n.enable"
        description={
          <Trans message="If disabled, site will always be shown in default language and user will not be able to change their locale." />
        }
      >
        <Trans message="Enable translations" />
      </FormSwitch>
    </AdminSettingsForm>
  );
}
