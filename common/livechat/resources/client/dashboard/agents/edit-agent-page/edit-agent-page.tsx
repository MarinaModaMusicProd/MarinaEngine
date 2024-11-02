import {useAgent} from '@livechat/dashboard/agents/use-agent';
import {FullAgent} from '@helpdesk/agents/agent';
import {PageStatus} from '@common/http/page-status';
import {Trans} from '@ui/i18n/trans';
import React, {Fragment} from 'react';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {IconButton} from '@ui/buttons/icon-button';
import {Link, Navigate, useParams} from 'react-router-dom';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {CrupdateResourceHeader} from '@common/admin/crupdate-resource-layout';
import {UpdateUserPageHeader} from '@common/admin/users/update-user-page/update-user-page-header';
import {editAgentPageTabs} from '@livechat/dashboard/agents/edit-agent-page/tabs/edit-agent-page-tabs';
import {UpdateUserPageTabs} from '@common/admin/users/update-user-page/update-user-page-tabs';
import {UpdateUserPageActions} from '@common/admin/users/update-user-page/update-user-page-actions';
import {useIsAgentOnline} from '@livechat/dashboard/agents/use-is-agent-online';
import {OnlineStatusCircle} from '@ui/badge/online-status-circle';
import {useAgentPermissions} from '@livechat/dashboard/agents/use-agent-permissions';

interface Props {
  agentId?: number;
}
export function EditAgentPage({agentId}: Props) {
  const params = useParams();
  const query = useAgent(agentId ?? params.agentId!);
  return (
    <Fragment>
      <StaticPageTitle>
        <Trans message="Edit agent" />
      </StaticPageTitle>
      {query.data?.agent ? (
        <PageContent agent={query.data.agent} />
      ) : (
        <PageStatus query={query} />
      )}
    </Fragment>
  );
}

interface PageContentProps {
  agent: FullAgent;
}
function PageContent({agent}: PageContentProps) {
  const {canEditAgent} = useAgentPermissions(agent.id);
  if (!canEditAgent) {
    return <Navigate to=".." relative="path" replace />;
  }
  return (
    <Fragment>
      <CrupdateResourceHeader
        wrapInContainer
        startActions={
          <IconButton
            elementType={Link}
            to=".."
            relative="path"
            size="sm"
            iconSize="md"
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endActions={<UpdateUserPageActions user={agent} />}
      >
        <Trans message="Agent profile" />
      </CrupdateResourceHeader>
      <UpdateUserPageHeader
        badge={<OnlineIndicator agent={agent} />}
        user={agent}
      />
      <UpdateUserPageTabs user={agent} tabs={editAgentPageTabs} />
    </Fragment>
  );
}

interface OnlineIndicatorProps {
  agent: FullAgent;
}
function OnlineIndicator({agent}: OnlineIndicatorProps) {
  const isOnline = useIsAgentOnline(agent.id);
  return (
    <OnlineStatusCircle
      isOnline={isOnline}
      size="md"
      color={isOnline ? 'bg-positive' : 'bg-danger'}
    />
  );
}
