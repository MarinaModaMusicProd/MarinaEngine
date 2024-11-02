import {useForm} from 'react-hook-form';
import React from 'react';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@ui/i18n/trans';
import {FullPageLoader} from '@ui/progress/full-page-loader';
import {PageErrorMessage} from '@common/errors/page-error-message';
import useSpinDelay from '@ui/utils/hooks/use-spin-delay';
import {IconButton} from '@ui/buttons/icon-button';
import {Link} from 'react-router-dom';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {
  CreateTriggerPayload,
  useCreateTrigger,
} from '@helpdesk/triggers/requests/use-create-trigger';
import {
  FetchTriggerConfigResponse,
  useTriggerConfig,
} from '@helpdesk/triggers/requests/use-trigger-config';
import {CrupdateTriggerForm} from '@helpdesk/triggers/form/crupdate-trigger-form';

export function CreateTriggerPage() {
  const configQuery = useTriggerConfig();
  const showSpinner = useSpinDelay(configQuery.isLoading, {
    delay: 500,
    minDuration: 200,
  });

  if (configQuery.data) {
    return <PageContent config={configQuery.data} />;
  }

  if (configQuery.isLoading) {
    return showSpinner ? <FullPageLoader /> : null;
  }

  return <PageErrorMessage />;
}

interface PageContentProps {
  config: FetchTriggerConfigResponse;
}
function PageContent({config}: PageContentProps) {
  const form = useForm<CreateTriggerPayload>();
  const createTrigger = useCreateTrigger(form);
  return (
    <CrupdateResourceLayout
      onSubmit={values => createTrigger.mutate(values)}
      form={form}
      title={<Trans message="Create new trigger" />}
      isLoading={createTrigger.isPending}
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
