import {Trans} from '@ui/i18n/trans';
import {AppearanceSectionTitle} from '@common/admin/appearance/appearance-section-title';
import {Fragment} from 'react';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';

export function ChatScreenAppearance() {
  // todo: add links to ask for email and chat routing settings, or put them here, same as livechat
  return (
    <Fragment>
      <AppearanceSectionTitle marginTop="mt-0">
        <Trans message="Default messages" />
      </AppearanceSectionTitle>
      <FormTextField
        name="settings.chatWidget.defaultMessage"
        label={<Trans message="Welcome message" />}
        className="mb-16"
        required
      />
      <FormTextField
        name="settings.chatWidget.inputPlaceholder"
        label={<Trans message="Input placeholder" />}
        className="mb-16"
        required
      />
      <AppearanceSectionTitle>
        <Trans message="No agents available" />
      </AppearanceSectionTitle>
      <FormTextField
        name="settings.chatWidget.agentsAwayMessage"
        label={<Trans message="Message" />}
        className="mb-16"
        inputElementType="textarea"
        rows={4}
        required
      />
      <AppearanceSectionTitle>
        <Trans message="Customer is in queue" />
      </AppearanceSectionTitle>
      <FormTextField
        name="settings.chatWidget.inQueueMessage"
        label={<Trans message="Message" />}
        className="mb-16"
        inputElementType="textarea"
        rows={6}
        required
      />
    </Fragment>
  );
}
