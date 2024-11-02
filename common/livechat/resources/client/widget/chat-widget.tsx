import {lazy, Suspense, useEffect, useState} from 'react';
import {LivechatToggle} from '@livechat/widget/livechat-toggle';
import {AnimatePresence} from 'framer-motion';
import {
  getWidgetBootstrapData,
  useWidgetBootstrapData,
} from '@livechat/widget/use-widget-bootstrap-data';
import clsx from 'clsx';
import {trackUserPageVisits} from '@livechat/widget/chat/page-visits-tracker';
import {useIsWidgetInline} from '@livechat/widget/hooks/use-is-widget-inline';
import {
  useWidgetStore,
  widgetSizes,
  widgetStore,
} from '@livechat/widget/widget-store';
import {WidgetConfig} from '@livechat/widget/widget-config';
import {useThemeSelector} from '@ui/themes/theme-selector-context';
import {setUnseenChatsStoreIsForWidget} from '@livechat/dashboard/unseen-chats/unseen-chats-store';
import {useWidgetWebsocketListener} from '@livechat/widget/use-widget-websocket-listener';

const LivechatPopup = lazy(() => import('./livechat-popup'));

export function ChatWidget() {
  const data = useWidgetBootstrapData();
  if (data.mostRecentChat.visitor.banned_at) {
    return null;
  }
  return <Content />;
}

function Content() {
  const isInline = useIsWidgetInline();
  const data = useWidgetBootstrapData();
  const activeSize = useWidgetStore(s => s.activeSize);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const {selectThemeTemporarily} = useThemeSelector();

  useEffect(() => {
    if (data && !isBootstrapped) {
      if (data.mostRecentChat.visitor.banned_at) {
        setIsBootstrapped(true);
        return;
      }

      setIsBootstrapped(true);
      widgetStore().setActiveSize(isInline ? 'open' : 'closed', true);
      notifyLoaderOfBootstrap(getWidgetBootstrapData().settings.chatWidget);
      trackUserPageVisits();
      setUnseenChatsStoreIsForWidget();

      window.addEventListener('message', async e => {
        if (e.data.source === 'livechat-loader' && e.data.type === 'setTheme') {
          selectThemeTemporarily(e.data.themeId);
        }
      });
    }
  }, [data, isBootstrapped, isInline, selectThemeTemporarily]);

  useWidgetWebsocketListener();

  return (
    <div
      className={clsx(
        'h-full w-full',
        isInline && 'flex items-center justify-center p-24',
        isInline && activeSize === 'closed' && 'hidden',
      )}
    >
      <div
        className={clsx(
          'isolate',
          !isBootstrapped ? 'hidden' : 'flex h-full w-full flex-col',
          isInline && 'mx-auto',
        )}
        style={
          isInline
            ? {
                width: widgetSizes[activeSize].width,
                height: widgetSizes[activeSize].height,
              }
            : undefined
        }
      >
        <AnimatePresence initial={false}>
          {(activeSize !== 'closed' || isInline) && (
            <Suspense>
              <LivechatPopup />
            </Suspense>
          )}
        </AnimatePresence>
        <LivechatToggle />
      </div>
    </div>
  );
}

function notifyLoaderOfBootstrap(widgetConfig: WidgetConfig | undefined) {
  window.parent.postMessage(
    {
      source: 'livechat-widget',
      type: 'bootstrap',
      widgetConfig,
    },
    '*',
  );
}
