import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogHeader} from '@ui/overlays/dialog/dialog-header';
import {Trans} from '@ui/i18n/trans';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {useForm} from 'react-hook-form';
import {Form} from '@ui/forms/form';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {DialogFooter} from '@ui/overlays/dialog/dialog-footer';
import {Button} from '@ui/buttons/button';
import {
  ImportAlbumPayload,
  useImportAlbum,
} from '@app/admin/albums-datatable-page/requests/use-import-album';

export function ImportAlbumDialog() {
  const form = useForm<ImportAlbumPayload>();
  const {formId, close} = useDialogContext();
  const importAlbum = useImportAlbum();
  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Import album" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values => {
            importAlbum.mutate(values, {
              onSuccess: response => {
                close(response.album);
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
              <Trans message="This will also import all artists that collaborated on this album and any tracks that it contains." />
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
          disabled={importAlbum.isPending}
        >
          <Trans message="Import" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
