import {ReactElement} from 'react';

interface Props {
  leftSidebar: ReactElement;
  chatFeed: ReactElement;
  rightSidebar: ReactElement | null;
}
export function ChatPageLayout({leftSidebar, chatFeed, rightSidebar}: Props) {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="flex h-full w-full items-start">
        <aside className="flex h-full min-w-320 basis-1/4 flex-col border-r">
          {leftSidebar}
        </aside>
        <div className="flex h-full min-w-0 grow flex-col">{chatFeed}</div>
        {rightSidebar && (
          <aside className="compact-scrollbar h-full min-w-320 shrink-0 basis-1/4 overflow-y-auto border-l">
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
