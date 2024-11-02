import {FormSwitch} from '@ui/forms/toggle/switch';
import {Trans} from '@ui/i18n/trans';
import {SectionHelper} from '@common/ui/other/section-helper';
import {Button} from '@ui/buttons/button';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {openUploadWindow} from '@ui/utils/files/open-upload-window';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {useSettings} from '@ui/settings/use-settings';
import {downloadFileFromUrl} from '@ui/utils/files/download-file-from-url';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {ConfirmationDialog} from '@ui/overlays/dialog/confirmation-dialog';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@ui/buttons/external-link';
import {StyleIcon} from '@ui/icons/material/Style';
import {
  AdminSettingsForm,
  AdminSettingsLayout,
} from '@common/admin/settings/form/admin-settings-form';
import React, {Fragment} from 'react';
import {AdminSettings} from '@common/admin/settings/admin-settings';
import {useForm} from 'react-hook-form';
import {useImportHcDataFromZip} from '@helpdesk/help-center/admin/hc-settings/use-import-hc-data-from-zip';

export function HcSettings() {
  return (
    <AdminSettingsLayout
      title={<Trans message="Help center" />}
      description={
        <div>
          <Trans message="Configure help center settings and import/export help center data." />
          <div className="mt-14 flex items-center gap-8">
            <StyleIcon size="sm" className="text-primary" />
            <Link
              to="/admin/appearance/hc-landing-page"
              className={LinkStyle}
              target="_blank"
            >
              <Trans message="Edit help center appearance" />
            </Link>
          </div>
        </div>
      }
    >
      {data => <Form data={data} />}
    </AdminSettingsLayout>
  );
}

interface FormProps {
  data: AdminSettings;
}
function Form({data}: FormProps) {
  const {tickets_integrated} = useSettings();
  const form = useForm<AdminSettings>({
    defaultValues: {
      client: {
        articles: {
          default_order: data.client.articles?.default_order ?? 'position|desc',
        },
        article: {
          hide_new_ticket_link:
            data.client.article?.hide_new_ticket_link ?? false,
        },
        replies: {
          after_reply_action:
            data.client.replies?.after_reply_action ?? 'stay_on_page',
        },
        mail: {
          simplified_threading: data.client.mail?.simplified_threading ?? false,
        },
      },
    },
  });

  return (
    <AdminSettingsForm form={form}>
      <FormSelect
        label={<Trans message="Default article order" />}
        name="client.articles.default_order"
        className="mb-24"
        selectionMode="single"
        description={
          <Trans message="In what way should help center articles be ordered by default." />
        }
      >
        <Item value="position|desc">
          <Trans message="Position" />
        </Item>
        <Item value="views|desc">
          <Trans message="Most viewed first" />
        </Item>
        <Item value="was_helpful|desc">
          <Trans message="Most helpful first" />
        </Item>
        <Item value="created_at|desc">
          <Trans message="Newest first" />
        </Item>
        <Item value="title|asc">
          <Trans message="A to Z" />
        </Item>
      </FormSelect>
      {tickets_integrated && (
        <Fragment>
          <FormSwitch
            name="client.article.hide_new_ticket_link"
            className="mb-24"
            description={
              <Trans
                message={`Whether "Submit a Request" link on article pages should be hidden.`}
              />
            }
          >
            <Trans message="Hide new ticket link" />
          </FormSwitch>
          <FormSelect
            label={<Trans message="Default after reply action" />}
            name="client.replies.after_reply_action"
            selectionMode="single"
          >
            <Item value="stay_on_page">
              <Trans message="Stay on page" />
            </Item>
            <Item value="next_active_ticket">
              <Trans message="Open next active ticket" />
            </Item>
            <Item value="back_to_folder">
              <Trans message="Go back to ticket list" />
            </Item>
          </FormSelect>
          <FormSwitch
            name="client.mail.simplified_threading"
            className="mt-24"
            description={
              <Trans message="Removes full ticket thread from email respones, unless it's the initial agent response." />
            }
          >
            <Trans message="Simplified threading" />
          </FormSwitch>
        </Fragment>
      )}
      <HcDataPanel />
    </AdminSettingsForm>
  );
}

function HcDataPanel() {
  return (
    <SectionHelper
      className="mt-34"
      color="neutral"
      title={<Trans message="Help center data" />}
      description={
        <Trans message="Import and export help center data (articles, categories, images, tags) in a .zip file for backup or migration." />
      }
      actions={
        <div className="mt-10 border-t pt-14">
          <ImportButton />
          <ExportButton />
        </div>
      }
    />
  );
}

function ImportButton() {
  const importData = useImportHcDataFromZip();
  return (
    <DialogTrigger type="modal">
      <Button variant="flat" color="primary" size="xs" className="mr-10">
        <Trans message="Import" />
      </Button>
      {({close}) => (
        <ConfirmationDialog
          isDanger
          title={<Trans message="Import help center data" />}
          body={
            <div>
              <Trans message="Are you sure you want to import help center data?" />
              <div className="mt-8 font-bold">
                <Trans message="This will erase all existing articles and categories." />
              </div>
            </div>
          }
          confirm={<Trans message="Import" />}
          isLoading={importData.isPending}
          onConfirm={async () => {
            const files = await openUploadWindow({
              extensions: ['zip'],
            });
            importData.mutate({file: files[0]}, {onSuccess: () => close()});
          }}
        />
      )}
    </DialogTrigger>
  );
}

function ExportButton() {
  const {base_url} = useSettings();
  const exportData = (format: 'html' | 'json') => {
    const url = `${base_url}/api/v1/hc/actions/export?format=${format}`;
    downloadFileFromUrl(url, 'hc-export.json');
  };

  return (
    <MenuTrigger
      onItemSelected={value => {
        exportData(value as 'html' | 'json');
      }}
    >
      <Button variant="flat" color="primary" size="xs">
        <Trans message="Export" />
      </Button>
      <Menu>
        <Item value="html">
          <Trans message="HTML (Offline docs)" />
        </Item>
        <Item value="json">
          <Trans message="JSON" />
        </Item>
      </Menu>
    </MenuTrigger>
  );
}
