import {Link, useParams} from 'react-router-dom';
import React, {Fragment} from 'react';
import {useUser} from '@common/auth/ui/use-user';
import {User} from '@ui/types/user';
import {Trans} from '@ui/i18n/trans';
import {CrupdateResourceHeader} from '@common/admin/crupdate-resource-layout';
import {UpdateUserPageHeader} from '@common/admin/users/update-user-page/update-user-page-header';
import {StaticPageTitle} from '@common/seo/static-page-title';
import {PageStatus} from '@common/http/page-status';
import {
  updateUserPageTabs,
  UpdateUserPageTabs,
} from '@common/admin/users/update-user-page/update-user-page-tabs';
import {IconButton} from '@ui/buttons/icon-button';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {UpdateUserPageActions} from '@common/admin/users/update-user-page/update-user-page-actions';

export function UpdateUserPage() {
  const {userId} = useParams();
  const query = useUser(userId!, {
    with: ['subscriptions', 'roles', 'permissions', 'bans'],
  });

  return (
    <Fragment>
      <StaticPageTitle>
        <Trans message="Edit user" />
      </StaticPageTitle>
      {query.data?.user ? (
        <PageContent user={query.data.user} />
      ) : (
        <PageStatus query={query} />
      )}
    </Fragment>
  );
}

interface PageContentProps {
  user: User;
}
function PageContent({user}: PageContentProps) {
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
        endActions={<UpdateUserPageActions user={user} />}
      >
        <Trans message="Edit user" />
      </CrupdateResourceHeader>
      <UpdateUserPageHeader user={user} />
      <UpdateUserPageTabs tabs={updateUserPageTabs} user={user} />
    </Fragment>
  );
}
