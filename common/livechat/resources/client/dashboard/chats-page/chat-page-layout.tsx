import {Fragment, ReactElement} from 'react';
import {PreviewChatDrawer} from '@livechat/dashboard/chats-page/preview-chat-drawer';

interface Props {
  leftSidebar: ReactElement;
  chatFeed: ReactElement;
  rightSidebar: ReactElement | null;
}
export function ChatPageLayout({leftSidebar, chatFeed, rightSidebar}: Props) {
  return (
    <Fragment>
      <div className="h-full w-full overflow-hidden">
        <div className="flex h-full w-full items-start">
          <aside className="flex h-full min-w-320 flex-shrink-0 basis-1/4 flex-col border-r">
            {leftSidebar}
          </aside>
          <div className="flex h-full min-w-0 grow flex-col">{chatFeed}</div>
          {rightSidebar && (
            <aside className="compact-scrollbar h-full min-w-320 flex-shrink-0 shrink-0 basis-1/4 overflow-y-auto border-l">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
      <PreviewChatDrawer />
    </Fragment>
  );
}
