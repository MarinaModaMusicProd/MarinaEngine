import {useForm} from 'react-hook-form';
import React, {useEffect} from 'react';
import {CrupdateResourceLayout} from '@common/admin/crupdate-resource-layout';
import {Trans} from '@ui/i18n/trans';
import {AlbumForm} from '@app/admin/albums-datatable-page/album-form/album-form';
import {
  CreateAlbumPayload,
  useCreateAlbum,
} from '@app/admin/albums-datatable-page/requests/use-create-album';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {useLocation, useSearchParams} from 'react-router-dom';
import {useCurrentDateTime} from '@ui/i18n/use-current-date-time';
import {getAlbumLink} from '@app/web-player/albums/album-link';
import {
  FileUploadProvider,
  useFileUploadStore,
} from '@common/uploads/uploader/file-upload-provider';
import {useNormalizedModel} from '@common/ui/normalized-model/use-normalized-model';
import {BackstageLayout} from '@app/web-player/backstage/backstage-layout';

interface Props {
  wrapInContainer?: boolean;
}
export function CreateAlbumPage({wrapInContainer}: Props) {
  return (
    <FileUploadProvider>
      <PageContent wrapInContainer={wrapInContainer} />
    </FileUploadProvider>
  );
}

function PageContent({wrapInContainer}: Props) {
  const uploadIsInProgress = !!useFileUploadStore(s => s.activeUploadsCount);
  const now = useCurrentDateTime();
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [searchParams] = useSearchParams();
  const {data} = useNormalizedModel(
    `normalized-models/artist/${searchParams.get('artistId')}`,
    undefined,
    {enabled: !!searchParams.get('artistId')},
  );
  const artist = data?.model;
  const form = useForm<CreateAlbumPayload>({
    defaultValues: {
      release_date: now.toAbsoluteString(),
    },
  });
  const createAlbum = useCreateAlbum(form);

  useEffect(() => {
    if (artist) {
      form.reset({
        artists: [artist],
      });
    }
  }, [artist, form]);

  return (
    <CrupdateResourceLayout
      form={form}
      onSubmit={values => {
        createAlbum.mutate(values, {
          onSuccess: response => {
            if (pathname.includes('admin')) {
              if (artist) {
                navigate(`/admin/artists/${artist.id}/edit`);
              } else {
                navigate('/admin/albums');
              }
            } else {
              navigate(getAlbumLink(response.album));
            }
          },
        });
      }}
      title={<Trans message="Add new album" />}
      isLoading={createAlbum.isPending || uploadIsInProgress}
      disableSaveWhenNotDirty
      wrapInContainer={wrapInContainer}
    >
      <AlbumForm showExternalIdFields />
    </CrupdateResourceLayout>
  );
}

export function BackstageCreateAlbumPage() {
  return (
    <BackstageLayout>
      <CreateAlbumPage wrapInContainer={false} />
    </BackstageLayout>
  );
}
