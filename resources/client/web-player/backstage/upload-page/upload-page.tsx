import {Trans} from '@ui/i18n/trans';
import {Button} from '@ui/buttons/button';
import {Switch} from '@ui/forms/toggle/switch';
import {ComponentPropsWithoutRef, ReactNode, useRef, useState} from 'react';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {Link} from 'react-router-dom';
import {LinkStyle} from '@ui/buttons/external-link';
import {Track} from '@app/web-player/tracks/track';
import {Album} from '@app/web-player/albums/album';
import {AlbumUploader} from '@app/web-player/backstage/upload-page/album-uploader';
import {TracksUploader} from '@app/web-player/backstage/upload-page/tracks-uploader';
import {UploadedMediaPreview} from '@app/web-player/backstage/upload-page/uploaded-media-preview';
import {
  NativeFileDraggable,
  useDroppable,
} from '@ui/interactions/dnd/use-droppable';
import {DropTargetMask} from '@app/web-player/backstage/upload-page/drop-tarket-mask';
import {useTrackUploader} from '@app/web-player/backstage/upload-page/use-track-uploader';
import {
  resetMinutesLimitQuery,
  useUserMinutesLimit,
} from '@app/web-player/backstage/upload-page/use-user-minutes-limit';
import {BackstageLayout} from '@app/web-player/backstage/backstage-layout';

type UploadMode = 'album' | 'tracks';

export interface UploaderProps {
  onUploadStart: () => void;
  onCancel: () => void;
  onCreate: (item: Track | Album) => void;
}

export type UploaderActions = ReturnType<typeof useTrackUploader>;

interface Props {
  backstageLayout?: boolean;
}
export function UploadPage({backstageLayout = false}: Props) {
  return (
    <FileUploadProvider>
      <Content backstageLayout={backstageLayout} />
    </FileUploadProvider>
  );
}

function Content({backstageLayout}: Props) {
  const [uploadMode, setUploadMode] = useState<UploadMode>('tracks');
  const [modeIsLocked, setModeIsLocked] = useState(false);

  const uploaderRef = useRef<UploaderActions>(null);
  const Uploader = uploadMode === 'tracks' ? TracksUploader : AlbumUploader;

  const [createdItems, setCreatedItems] = useState<(Album | Track)[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const {droppableProps} = useDroppable({
    id: 'uploadPageRoot',
    ref,
    types: ['nativeFile'],
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDrop: async draggable => {
      if (draggable.type === 'nativeFile') {
        const files = await (draggable as NativeFileDraggable).getData();
        const validFiles = uploaderRef.current?.validateUploads(files);
        if (validFiles?.length) {
          uploaderRef.current?.uploadTracks(validFiles);
        }
      }
    },
  });

  const Wrapper = backstageLayout ? BackstageLayout : DefaultWrapper;

  return (
    <Wrapper {...droppableProps}>
      {!modeIsLocked && (
        <UploadPanel
          onUpload={() => uploaderRef.current?.openFilePicker()}
          uploadMode={uploadMode}
          onUploadModeChange={setUploadMode}
        />
      )}
      {createdItems.map(item => (
        <UploadedMediaPreview key={item.id} media={item} />
      ))}
      <Uploader
        ref={uploaderRef}
        onUploadStart={() => setModeIsLocked(true)}
        onCreate={item => {
          setCreatedItems(prev => [...prev, item]);
          resetMinutesLimitQuery();
        }}
        onCancel={() => {
          setModeIsLocked(false);
        }}
      />
      <DropTargetMask isVisible={isDragOver} />
    </Wrapper>
  );
}

interface UploadPanelProps {
  onUpload: () => void;
  uploadMode: UploadMode;
  onUploadModeChange: (newMode: UploadMode) => void;
}
function UploadPanel({
  onUpload,
  uploadMode,
  onUploadModeChange,
}: UploadPanelProps) {
  const {data} = useUserMinutesLimit();
  return (
    <div className="pt-40">
      <div className="mx-auto flex max-w-580 flex-col items-center rounded border bg-paper p-20 md:p-48">
        <h1 className="text-base md:text-[22px] md:font-light">
          <Trans message="Drag and drop your tracks, videos & albums here." />
        </h1>
        <Button
          variant="flat"
          color="primary"
          className="mt-20 w-min"
          onClick={() => onUpload()}
        >
          <Trans message="Or choose files to upload" />
        </Button>
        <div className="mt-20 border-t pt-20">
          <Switch
            checked={uploadMode === 'album'}
            onChange={e =>
              onUploadModeChange(e.target.checked ? 'album' : 'tracks')
            }
          >
            <Trans message="Make an album when multiple files are selected" />
          </Switch>
        </div>
      </div>
      <div className="mt-20 min-h-20 text-center text-sm text-muted">
        {data?.minutesLeft != null && (
          <Trans
            message="You have :count minutes left. Try <a>Pro accounts</a> to get more time and access to advanced features."
            values={{
              count: data.minutesLeft,
              a: parts => (
                <Link className={LinkStyle} to="/pricing">
                  {parts}
                </Link>
              ),
            }}
          />
        )}
      </div>
    </div>
  );
}

interface DefaultWrapperProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}
function DefaultWrapper({children, ...domProps}: DefaultWrapperProps) {
  return (
    <div {...domProps} className="relative min-h-full">
      <div className="container mx-auto p-14 md:p-24">{children}</div>
    </div>
  );
}

export function BackstageUploadPage() {
  return <UploadPage backstageLayout />;
}
