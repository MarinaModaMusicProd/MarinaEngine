import {useForm} from 'react-hook-form';
import React from 'react';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@ui/i18n/trans';
import {FullPageLoader} from '@ui/progress/full-page-loader';
import {PageErrorMessage} from '@common/errors/page-error-message';
import useSpinDelay from '@ui/utils/hooks/use-spin-delay';
import {IconButton} from '@ui/buttons/icon-button';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {Link} from 'react-router-dom';
import {useTrigger} from '@helpdesk/triggers/requests/use-trigger';
import {
  FetchTriggerConfigResponse,
  useTriggerConfig,
} from '@helpdesk/triggers/requests/use-trigger-config';
import {Trigger} from '@helpdesk/triggers/trigger';
import {
  UpdateTriggerPayload,
  useUpdateTrigger,
} from '@helpdesk/triggers/requests/use-update-trigger';
import {CrupdateTriggerForm} from '@helpdesk/triggers/form/crupdate-trigger-form';

export function UpdateTriggerPage() {
  const triggerQuery = useTrigger();
  const configQuery = useTriggerConfig();
  const isLoading = triggerQuery.isPending || configQuery.isPending;
  const showSpinner = useSpinDelay(isLoading, {
    delay: 500,
    minDuration: 200,
  });

  if (triggerQuery.data && configQuery.data) {
    return (
      <PageContent
        trigger={triggerQuery.data.trigger}
        config={configQuery.data}
      />
    );
  }

  if (isLoading) {
    return showSpinner ? <FullPageLoader /> : null;
  }

  return <PageErrorMessage />;
}

interface PageContentProps {
  trigger: Trigger;
  config: FetchTriggerConfigResponse;
}
function PageContent({trigger, config}: PageContentProps) {
  const form = useForm<UpdateTriggerPayload>({
    defaultValues: {
      name: trigger.name,
      description: trigger.description,
      conditions: trigger.config.conditions,
      actions: trigger.config.actions,
    },
  });
  const updateTrigger = useUpdateTrigger(form);
  return (
    <CrupdateResourceLayout
      onSubmit={values => updateTrigger.mutate(values)}
      form={form}
      title={
        <Trans message="Edit “:name“ trigger" values={{name: trigger.name}} />
      }
      isLoading={updateTrigger.isPending}
      backButton={
        <IconButton
          elementType={Link}
          to="/admin/triggers"
          className="max-md:hidden"
        >
          <ArrowBackIcon />
        </IconButton>
      }
      wrapInContainer
    >
      <CrupdateTriggerForm config={config} />
    </CrupdateResourceLayout>
  );
}
