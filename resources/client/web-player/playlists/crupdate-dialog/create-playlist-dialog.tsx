import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {Trans} from '@ui/i18n/trans';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {CrupdatePlaylistFields} from '@app/web-player/playlists/crupdate-dialog/crupdate-playlist-fields';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Button} from '@ui/buttons/button';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {
  CreatePlaylistPayload,
  useCreatePlaylist,
} from '@app/web-player/playlists/requests/use-create-playlist';
import {useForm} from 'react-hook-form';
import {Form} from '@ui/forms/form';

export function CreatePlaylistDialog() {
  const {close, formId} = useDialogContext();
  const form = useForm<CreatePlaylistPayload>();
  const createPlaylist = useCreatePlaylist(form);

  return (
    <Dialog size="xl">
      <DialogHeader>
        <Trans message="New playlist" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values => {
            createPlaylist.mutate(values, {
              onSuccess: response => {
                close(response.playlist);
              },
            });
          }}
        >
          <CrupdatePlaylistFields />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          form={formId}
          type="submit"
          variant="flat"
          color="primary"
          disabled={createPlaylist.isPending}
        >
          <Trans message="Create" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
