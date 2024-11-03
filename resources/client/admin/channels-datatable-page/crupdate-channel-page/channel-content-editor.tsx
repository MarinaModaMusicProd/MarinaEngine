import {
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
} from 'react-hook-form';
import {UpdateChannelPayload} from '@app/admin/channels-datatable-page/requests/use-update-channel';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';
import {Trans} from '@common/i18n/trans';
import {Table} from '@common/ui/tables/table';
import {RowElementProps} from '@common/ui/tables/table-row';
import {useIsTouchDevice} from '@common/utils/hooks/is-touch-device';
import React, {useContext, useRef, useState} from 'react';
import {TableContext} from '@common/ui/tables/table-context';
import {DragPreviewRenderer} from '@common/ui/interactions/dnd/use-draggable';
import {
  DropPosition,
  useSortable,
} from '@common/ui/interactions/dnd/use-sortable';
import clsx from 'clsx';
import {mergeProps} from '@react-aria/utils';
import {ColumnConfig} from '@common/datatable/column-config';
import {DragHandleIcon} from '@common/icons/material/DragHandle';
import {NameWithAvatar} from '@common/datatable/column-templates/name-with-avatar';
import {IconButton} from '@common/ui/buttons/icon-button';
import {CloseIcon} from '@common/icons/material/Close';
import {DragPreview} from '@common/ui/interactions/dnd/drag-preview';
import {WarningIcon} from '@common/icons/material/Warning';
import {IllustratedMessage} from '@common/ui/images/illustrated-message';
import playlist from './../playlist.svg';
import {SvgImage} from '@common/ui/images/svg-image/svg-image';
import {ComboBox} from '@common/ui/forms/combobox/combobox';
import {useSearchResults} from '@app/web-player/search/requests/use-search-results';
import {message} from '@common/i18n/message';
import {Section} from '@common/ui/forms/listbox/section';
import {Item} from '@common/ui/forms/listbox/item';
import {useTrans} from '@common/i18n/use-trans';
import {SearchIcon} from '@common/icons/material/Search';
import defaultImage from '@app/web-player/albums/album-image/default-album-image.png';
import {channelContentModels} from '@app/admin/channels-datatable-page/crupdate-channel-page/channel-content-models';
import {useUpdateChannelContent} from '@app/admin/channels-datatable-page/requests/use-update-channel-content';
import {useParams} from 'react-router-dom';
import {Button} from '@common/ui/buttons/button';
import {RefreshIcon} from '@common/icons/material/Refresh';

const columnConfig: ColumnConfig<NormalizedModel>[] = [
  {
    key: 'dragHandle',
    width: 'w-42 flex-shrink-0',
    header: () => <Trans message="Drag handle" />,
    hideHeader: true,
    body: () => (
      <DragHandleIcon className="cursor-pointer text-muted hover:text" />
    ),
  },
  {
    key: 'name',
    header: () => <Trans message="Content item" />,
    visibleInMode: 'all',
    body: item => (
      <NameWithAvatar
        image={item.image}
        label={item.name}
        description={item.description}
      />
    ),
  },
  {
    key: 'type',
    header: () => <Trans message="Content type" />,
    body: item => <span className="capitalize">{item.model_type}</span>,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    width: 'w-42 flex-shrink-0',
    visibleInMode: 'all',
    body: (item, {index}) => <RemoveItemColumn index={index} />,
  },
];

export function ChannelContentEditor() {
  const {watch, getValues} = useFormContext<UpdateChannelPayload>();
  const contentType = watch('config.contentType');
  const fieldArray = useFieldArray<UpdateChannelPayload, 'content.data'>({
    name: 'content.data',
  });
  // need to watch this and use it in table, otherwise content will not update when using "update content now" button
  const content = watch('content');

  // only show delete and drag buttons when channel content is managed manually
  const filteredColumns = columnConfig.filter(col => {
    return !(
      contentType !== 'manual' &&
      (col.key === 'actions' || col.key === 'dragHandle')
    );
  });

  return (
    <div className="mt-40 pt-40 border-t">
      <div className="mb-40">
        <h2 className="text-2xl mb-10">
          <Trans message="Channel content" />
        </h2>
        <ContentNotEditableWarning />
        <UpdateContentButton />
        {contentType === 'manual' ? (
          <SearchField
            onResultSelected={result => {
              const alreadyAttached = getValues('content.data').find(
                x => x.id === result.id && x.model_type === result.model_type
              );
              if (!alreadyAttached) {
                fieldArray.prepend(result);
              }
            }}
          />
        ) : null}
      </div>
      <Table
        className="mt-24"
        columns={filteredColumns}
        data={content.data}
        meta={fieldArray}
        renderRowAs={contentType === 'manual' ? ContentTableRow : undefined}
        enableSelection={false}
        hideHeaderRow
      />
      {!fieldArray.fields.length && contentType === 'manual' ? (
        <IllustratedMessage
          title={<Trans message="Channel is empty" />}
          description={
            <Trans message="No content is attached to this channel yet." />
          }
          image={<SvgImage src={playlist} />}
        />
      ) : null}
    </div>
  );
}

interface SearchFieldProps {
  onResultSelected: (result: NormalizedModel) => void;
}
function SearchField({onResultSelected}: SearchFieldProps) {
  const {watch} = useFormContext<UpdateChannelPayload>();
  const contentModel = watch('config.contentModel');
  const {trans} = useTrans();
  const [query, setQuery] = useState('');
  const {isFetching, data} = useSearchResults({
    query,
    types:
      !contentModel || contentModel === '*'
        ? channelContentModels
        : [contentModel],
    limit: 5,
    normalize: true,
    localOnly: true,
  });
  return (
    <ComboBox
      isAsync
      placeholder={trans(message('Search for content to add...'))}
      isLoading={isFetching}
      inputValue={query}
      onInputValueChange={setQuery}
      clearInputOnItemSelection
      blurReferenceOnItemSelection
      selectionMode="none"
      openMenuOnFocus
      floatingMaxHeight={670}
      startAdornment={<SearchIcon />}
      hideEndAdornment
    >
      {Object.entries(data?.results || {}).map(([groupName, results]) => (
        <Section key={groupName} label={<Trans message={groupName} />}>
          {results.map((result: any) => {
            const normalizedResult = result as NormalizedModel;
            const key = `${groupName}-${result.id}`;
            return (
              <Item
                key={key}
                value={key}
                onSelected={() => onResultSelected(normalizedResult)}
                startIcon={
                  <img
                    className="w-34 h-34 rounded object-cover"
                    src={normalizedResult.image || defaultImage}
                    alt=""
                  />
                }
                description={normalizedResult.description}
                textLabel={normalizedResult.name}
              >
                {normalizedResult.name}
              </Item>
            );
          })}
        </Section>
      ))}
    </ComboBox>
  );
}

function ContentTableRow({
  item,
  children,
  className,
  ...domProps
}: RowElementProps<NormalizedModel>) {
  const isTouchDevice = useIsTouchDevice();
  const {data, meta} = useContext(TableContext);
  const domRef = useRef<HTMLTableRowElement>(null);
  const previewRef = useRef<DragPreviewRenderer>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);
  const fieldArray = meta as UseFieldArrayReturn;

  const {sortableProps} = useSortable({
    ref: domRef,
    disabled: isTouchDevice ?? false,
    item,
    items: data,
    type: 'channelContentItem',
    preview: previewRef,
    previewVariant: 'line',
    onDropPositionChange: position => {
      setDropPosition(position);
    },
    onSortEnd: (oldIndex, newIndex) => {
      fieldArray.move(oldIndex, newIndex);
    },
  });

  return (
    <tr
      className={clsx(
        className,
        dropPosition === 'before' && 'sort-preview-before',
        dropPosition === 'after' && 'sort-preview-after'
      )}
      ref={domRef}
      {...mergeProps(sortableProps, domProps)}
    >
      {children}
      {!item.isPlaceholder && <RowDragPreview item={item} ref={previewRef} />}
    </tr>
  );
}

interface RowDragPreviewProps {
  item: NormalizedModel;
}
const RowDragPreview = React.forwardRef<
  DragPreviewRenderer,
  RowDragPreviewProps
>(({item}, ref) => {
  return (
    <DragPreview ref={ref}>
      {() => (
        <div className="p-8 rounded shadow bg-chip text-base">{item.name}</div>
      )}
    </DragPreview>
  );
});

interface RemoveItemColumnProps {
  index: number;
}
function RemoveItemColumn({index}: RemoveItemColumnProps) {
  const {meta} = useContext(TableContext);
  const fieldArray = meta as UseFieldArrayReturn;
  return (
    <IconButton
      size="md"
      className="text-muted"
      onClick={() => {
        fieldArray.remove(index);
      }}
    >
      <CloseIcon />
    </IconButton>
  );
}

function ContentNotEditableWarning() {
  const {watch} = useFormContext<UpdateChannelPayload>();
  const contentType = watch('config.contentType');

  if (contentType === 'manual') {
    return null;
  }

  return (
    <div className="flex items-center gap-8 mt-4 mb-20">
      <WarningIcon size="xs" />
      <div className="text-xs text-muted">
        {contentType === 'listAll' ? (
          <Trans message="This channel is listing all available content of specified type, and can't be edited manually." />
        ) : null}
        {contentType === 'autoUpdate' ? (
          <Trans message="This channel content is set to update automatically and can't be edited manually." />
        ) : null}
      </div>
    </div>
  );
}

function UpdateContentButton() {
  const {slugOrId} = useParams();
  const updateContent = useUpdateChannelContent(slugOrId!);
  const {setValue, watch, getValues} = useFormContext<UpdateChannelPayload>();

  if (watch('config.contentType') !== 'autoUpdate') {
    return null;
  }

  return (
    <Button
      size="xs"
      variant="outline"
      color="primary"
      startIcon={<RefreshIcon />}
      onClick={() => {
        updateContent.mutate(
          {autoUpdateMethod: getValues('config.autoUpdateMethod')},
          {
            onSuccess: response => {
              if (response.channel.content) {
                setValue('content', response.channel.content);
              }
            },
          }
        );
      }}
      disabled={updateContent.isLoading || !watch('config.autoUpdateMethod')}
    >
      <Trans message="Update content now" />
    </Button>
  );
}
