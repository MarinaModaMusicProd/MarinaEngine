import {Tag} from '@common/tags/tag';
import {ChipList} from '@ui/forms/input-field/chip-field/chip-list';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import {SellIcon} from '@ui/icons/material/Sell';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {useTaggableTags} from '@common/tags/use-taggable-tags';
import {useDetachTagFromTaggables} from '@common/tags/use-detach-tag-from-taggables';
import {ManageTagsDialog} from '@common/tags/manage-tags-dialog';

interface Props {
  tags: Tag[] | undefined;
  chatId: number;
}
export function ChatTagList({tags, chatId}: Props) {
  const detachTag = useDetachTagFromTaggables();
  const {data, isFetching} = useTaggableTags({
    taggableType: 'chat',
    taggableId: chatId,
    initialData: tags,
  });
  return (
    <div className="flex items-center gap-8 px-16 pb-16 pt-8">
      <DialogTrigger type="modal">
        <Button variant="text" startIcon={<SellIcon />} size="xs">
          <Trans message="Add tag" />
        </Button>
        <ManageTagsDialog
          attachedTags={data?.tags}
          isLoading={isFetching}
          tagType="custom"
          taggableType="chat"
          taggableIds={[chatId]}
        />
      </DialogTrigger>
      <ChipList size="sm" radius="rounded-button">
        {data?.tags.map(tag => (
          <Chip
            key={tag.id}
            disabled={detachTag.isPending}
            onRemove={() => {
              detachTag.mutate({
                tagId: tag.id,
                taggableIds: [chatId],
                taggableType: 'chat',
              });
            }}
          >
            {tag.display_name || tag.name}
          </Chip>
        ))}
      </ChipList>
    </div>
  );
}
