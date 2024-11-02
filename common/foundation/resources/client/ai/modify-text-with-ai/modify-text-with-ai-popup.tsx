import React, {useState} from 'react';
import {Dialog} from '@ui/overlays/dialog/dialog';
import {DialogBody} from '@ui/overlays/dialog/dialog-body';
import {IconButton} from '@ui/buttons/icon-button';
import {MediationIcon} from '@ui/icons/material/Mediation';
import {Tooltip} from '@ui/tooltip/tooltip';
import {Trans} from '@ui/i18n/trans';
import {SpellcheckIcon} from '@ui/icons/material/Spellcheck';
import {Menu, MenuTrigger} from '@ui/menu/menu-trigger';
import {Button} from '@ui/buttons/button';
import {KeyboardArrowDownIcon} from '@ui/icons/material/KeyboardArrowDown';
import {Item} from '@ui/forms/listbox/item';
import {useValueLists} from '@common/http/value-lists';
import {ProgressBar} from '@ui/progress/progress-bar';
import {useDialogContext} from '@ui/overlays/dialog/dialog-context';
import {OpenInFullIcon} from '@ui/icons/material/OpenInFull';
import {CloseFullscreenIcon} from '@ui/icons/material/CloseFullscreen';
import {
  ModifyTextWithAiInstruction,
  ModifyTextWithAiPayload,
  ModifyTextWithAiTone,
  useModifyTextWithAi,
} from '@common/ai/modify-text-with-ai/use-modify-text-with-ai';

interface Props {
  onModify: (handler: (text: string) => Promise<string>) => void;
}
export function ModifyTextWithAiPopup({onModify}: Props) {
  const {close} = useDialogContext();
  const modifyText = useModifyTextWithAi();

  const handleModifyText = (payload: ModifyTextWithAiPayload) => {
    return new Promise<string>((resolve, reject) => {
      modifyText.mutate(payload, {
        onSettled: (data, error) => {
          if (data) {
            resolve(data?.content);
            close();
          } else {
            reject(error);
          }
        },
      });
    });
  };

  const refine = (instruction: ModifyTextWithAiInstruction) => {
    onModify((text: string) => handleModifyText({instruction, text}));
  };

  return (
    <Dialog>
      <DialogBody padding="p-10">
        {modifyText.isPending && (
          <ProgressBar
            isIndeterminate
            className="absolute left-0 right-0 top-0 w-full"
            size="xs"
          />
        )}
        <div className="flex items-center gap-4">
          <Tooltip label={<Trans message="Simplify text" />}>
            <IconButton
              disabled={modifyText.isPending}
              size="sm"
              onClick={() => refine(ModifyTextWithAiInstruction.Simplify)}
            >
              <MediationIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label={<Trans message="Shorten text" />}>
            <IconButton
              disabled={modifyText.isPending}
              size="sm"
              onClick={() => refine(ModifyTextWithAiInstruction.Shorten)}
            >
              <CloseFullscreenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label={<Trans message="Lenghten text" />}>
            <IconButton
              disabled={modifyText.isPending}
              size="sm"
              iconSize="md"
              onClick={() => refine(ModifyTextWithAiInstruction.Lengthen)}
            >
              <OpenInFullIcon />
            </IconButton>
          </Tooltip>
          <Tooltip label={<Trans message="Fix spelling and grammar" />}>
            <IconButton
              disabled={modifyText.isPending}
              size="sm"
              onClick={() => refine(ModifyTextWithAiInstruction.FixSpelling)}
            >
              <SpellcheckIcon />
            </IconButton>
          </Tooltip>
          <ChangeToneDropdown
            disabled={modifyText.isPending}
            onSelected={tone => {
              onModify((text: string) =>
                handleModifyText({
                  instruction: ModifyTextWithAiInstruction.ChangeTone,
                  tone,
                  text,
                }),
              );
            }}
          />
          <TranslateDropdown
            disabled={modifyText.isPending}
            onSelected={language => {
              onModify((text: string) =>
                handleModifyText({
                  instruction: ModifyTextWithAiInstruction.Translate,
                  language,
                  text,
                }),
              );
            }}
          />
        </div>
      </DialogBody>
    </Dialog>
  );
}

interface ChangeToneDropdownProps {
  onSelected: (tone: ModifyTextWithAiTone) => void;
  disabled: boolean;
}
function ChangeToneDropdown({onSelected, disabled}: ChangeToneDropdownProps) {
  const [value, setValue] = useState<ModifyTextWithAiTone | ''>('');
  return (
    <MenuTrigger
      onItemSelected={value => onSelected(value as ModifyTextWithAiTone)}
      selectedValue={value}
      selectionMode="single"
      onSelectionChange={value => setValue(value as ModifyTextWithAiTone)}
    >
      <Button
        disabled={disabled}
        variant="outline"
        size="xs"
        endIcon={<KeyboardArrowDownIcon />}
        className="ml-18"
      >
        <Trans message="Change tone" />
      </Button>
      <Menu>
        {Object.values(ModifyTextWithAiTone).map(tone => (
          <Item value={tone} key={tone} capitalizeFirst>
            <Trans message={tone} />
          </Item>
        ))}
      </Menu>
    </MenuTrigger>
  );
}

interface TranslateDropdownProps {
  onSelected: (language: string) => void;
  disabled: boolean;
}
function TranslateDropdown({onSelected, disabled}: TranslateDropdownProps) {
  const {data} = useValueLists(['languages']);
  return (
    <MenuTrigger
      onItemSelected={value => onSelected(value as string)}
      showSearchField
    >
      <Button
        disabled={disabled}
        variant="outline"
        size="xs"
        endIcon={<KeyboardArrowDownIcon />}
        className="ml-6"
      >
        <Trans message="Translate" />
      </Button>
      <Menu>
        {data?.languages?.map(language => (
          <Item value={language.code} key={language.code}>
            {language.name}
          </Item>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
