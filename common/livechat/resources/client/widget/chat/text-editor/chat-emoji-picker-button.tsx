import {Fragment} from 'react';
import {Tooltip} from '@ui/tooltip/tooltip';
import {Trans} from '@ui/i18n/trans';
import {IconButton, IconButtonProps} from '@ui/buttons/icon-button';
import {DialogTrigger} from '@ui/overlays/dialog/dialog-trigger';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {EmojiEmotionsIcon} from '@ui/icons/material/EmojiEmotions';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';

interface Props {
  onSelected: (emoji: string) => void;
  className?: string;
  size?: IconButtonProps['size'];
  iconSize?: IconButtonProps['iconSize'];
}
export function ChatEmojiPickerButton({
  onSelected,
  className,
  size,
  iconSize,
}: Props) {
  return (
    <Fragment>
      <DialogTrigger
        type="popover"
        mobileType="popover"
        placement="top"
        offset={14}
      >
        <Tooltip label={<Trans message="Emoji" />}>
          <IconButton size={size} className={className} iconSize={iconSize}>
            <EmojiEmotionsIcon />
          </IconButton>
        </Tooltip>
        <EmojiDialog onSelected={emoji => onSelected(emoji)} />
      </DialogTrigger>
    </Fragment>
  );
}

const emojiList = [
  '🙂',
  '😁',
  '😐',
  '😂',
  '😍',
  '🤔',
  '😒',
  '😭',
  '😢',
  '😎',
  '🎉',
  '👍',
  '❤️',
  '👌',
  '🙏',
];

interface EmojiDialogProps {
  onSelected: (emoji: string) => void;
}
function EmojiDialog({onSelected}: EmojiDialogProps) {
  const {close} = useDialogContext();
  return (
    <Dialog size="w-auto">
      <DialogBody padding="p-10">
        <div className="grid grid-cols-5">
          {emojiList.map(emoji => (
            <IconButton
              key={emoji}
              onClick={() => {
                onSelected(emoji);
                close();
              }}
            >
              <span className="text-xl">{emoji}</span>
            </IconButton>
          ))}
        </div>
      </DialogBody>
    </Dialog>
  );
}
