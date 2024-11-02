import {FormTextField} from '@ui/forms/input-field/text-field/text-field';
import {Trans} from '@ui/i18n/trans';
import {FormSelect} from '@ui/forms/select/select';
import {Item} from '@ui/forms/listbox/item';
import {FormSwitch} from '@ui/forms/toggle/switch';
import {FormImageSelector} from '@common/uploads/components/image-selector';

export function ChatLauncherAppearance() {
  return (
    <div className="space-y-20">
      <FormImageSelector
        name={`settings.chatWidget.launcherIcon`}
        label={<Trans message="Custom launcher icon" />}
        diskPrefix="widget_media"
        showRemoveButton
      />
      <FormSelect
        selectionMode="single"
        name="settings.chatWidget.position"
        label={<Trans message="Position" />}
      >
        <Item value="left">
          <Trans message="Left" />
        </Item>
        <Item value="right">
          <Trans message="Right" />
        </Item>
      </FormSelect>
      <FormTextField
        type="number"
        name="settings.chatWidget.spacing.side"
        label={<Trans message="Side spacing" />}
        endAdornment={<div className="text-sm">px</div>}
      />
      <FormTextField
        type="number"
        name="settings.chatWidget.spacing.bottom"
        label={<Trans message="Bottom spacing" />}
        endAdornment={<div className="text-sm">px</div>}
      />
      <FormSwitch
        name="settings.chatWidget.hide"
        description={
          <Trans message="When enabled, chat launcher will be hidden by default and will need to be shown manually via API." />
        }
      >
        <Trans message="Hide launcher" />
      </FormSwitch>
    </div>
  );
}
