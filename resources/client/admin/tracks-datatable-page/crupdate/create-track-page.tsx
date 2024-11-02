import React from 'react';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@ui/i18n/trans';
import {TrackForm} from '@app/admin/tracks-datatable-page/track-form/track-form';
import {useCreateTrackForm} from '@app/admin/tracks-datatable-page/crupdate/use-create-track-form';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {useLocation} from 'react-router-dom';
import {getTrackLink} from '@app/web-player/tracks/track-link';
import {BackstageLayout} from '@app/web-player/backstage/backstage-layout';

interface Props {
  wrapInContainer?: boolean;
}
export function CreateTrackPage({wrapInContainer}: Props) {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const {form, createTrack} = useCreateTrackForm({
    onTrackCreated: response => {
      if (pathname.includes('admin')) {
        navigate(`/admin/tracks/${response.track.id}/edit`);
      } else {
        navigate(getTrackLink(response.track));
      }
    },
  });
  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        createTrack.mutate(values);
      }}
      title={<Trans message="Add new track" />}
      isLoading={createTrack.isPending}
      disableSaveWhenNotDirty
      wrapInContainer={wrapInContainer}
    >
      <FileUploadProvider>
        <TrackForm showExternalIdFields />
      </FileUploadProvider>
    </CrupdateResourceLayout>
  );
}

export function BackstageCreateTrackPage() {
  return (
    <BackstageLayout>
      <CreateTrackPage />
    </BackstageLayout>
  );
}
