import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import React from 'react';
import {FetchTriggerConfigResponse} from '@helpdesk/triggers/requests/use-trigger-config';
import {TriggerConditionFields} from '@helpdesk/triggers/form/trigger-condition-fields';
import {TriggerActionFields} from '@helpdesk/triggers/form/trigger-action-fields';

interface Props {
  config: FetchTriggerConfigResponse;
}
export function CrupdateTriggerForm({config}: Props) {
  return (
    <div>
      <FormTextField
        name="name"
        label={<Trans message="Name" />}
        className="mb-24"
      />
      <FormTextField
        name="description"
        label={<Trans message="Description" />}
        inputElementType="textarea"
        rows={3}
        className="mb-44"
      />
      <TriggerConditionFields config={config} />
      <TriggerActionFields config={config} />
    </div>
  );
}
