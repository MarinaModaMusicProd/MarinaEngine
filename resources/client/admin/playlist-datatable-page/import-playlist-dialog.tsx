import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {Trans} from '@ui/i18n/trans';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {useForm} from 'react-hook-form';
import {
  ImportPlaylistPayload,
  useImportPlaylist,
} from '@app/admin/playlist-datatable-page/requests/use-import-playlist';
import {Form} from '@ui/forms/form';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Button} from '@ui/buttons/button';

export function ImportPlaylistDialog() {
  const form = useForm<ImportPlaylistPayload>();
  const {formId, close} = useDialogContext();
  const importPlaylist = useImportPlaylist();
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Import playlist" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values => {
            importPlaylist.mutate(values, {
              onSuccess: response => {
                close(response.playlist);
              },
            });
          }}
        >
          <FormTextField
            autoFocus
            required
            name="spotifyId"
            minLength={22}
            maxLength={22}
            label={<Trans message="Spotify ID" />}
            description={
              <Trans message="Only public playlists can be imported." />
            }
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => close()}>
          <Trans message="Cancel" />
        </Button>
        <Button
          form={formId}
          variant="flat"
          color="primary"
          type="submit"
          disabled={importPlaylist.isPending}
        >
          <Trans message="Import" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
