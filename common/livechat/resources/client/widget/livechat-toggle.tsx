import {IconButton} from '@ui/buttons/icon-button';
import {ChatBubbleOutlineIcon} from '@ui/icons/material/ChatBubbleOutline';
import {useIsWidgetInline} from '@livechat/widget/hooks/use-is-widget-inline';
import {useWidgetStore, widgetStore} from '@livechat/widget/widget-store';
import {CloseIcon} from '@ui/icons/material/Close';
import {AnimatePresence, m} from 'framer-motion';
import {PopoverAnimation} from '@ui/overlays/popover-animation';
import {useWidgetPosition} from '@livechat/widget/hooks/use-widget-position';
import {useSettings} from '@ui/settings/use-settings';

export function LivechatToggle() {
  const isInline = useIsWidgetInline();
  const isOpen = useWidgetStore(s => s.activeSize !== 'closed');

  const positionStyle = useWidgetPosition();

  return (
    <div style={positionStyle} className="mt-auto flex-shrink-0 pt-4">
      <IconButton
        display="block"
        onClick={() => {
          if (isInline) return;
          widgetStore().setActiveSize(
            widgetStore().activeSize === 'closed' ? 'open' : 'closed',
          );
        }}
        variant="raised"
        color="primary"
        radius="rounded-full"
        size="xl"
        iconSize="lg"
        shadow="chat-toggle-shadow"
      >
        <AnimatePresence initial={false} mode="wait">
          {isOpen && !isInline ? (
            <m.div {...PopoverAnimation} key="close-icon">
              <CloseIcon size="lg" />
            </m.div>
          ) : (
            <m.div {...PopoverAnimation} key="chat-icon">
              <LauncherIcon />
            </m.div>
          )}
        </AnimatePresence>
      </IconButton>
    </div>
  );
}

function LauncherIcon() {
  const {chatWidget} = useSettings();
  if (chatWidget?.launcherIcon) {
    return (
      <img
        src={chatWidget.launcherIcon}
        alt=""
        className="m-auto h-34 w-34 object-cover"
      />
    );
  }
  return <ChatBubbleOutlineIcon size="lg" />;
}
