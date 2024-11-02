import React, {Fragment, useEffect, useLayoutEffect, useRef} from 'react';
import {AnimatePresence, m} from 'framer-motion';
import {HelpScreen} from '@livechat/widget/hc/help-screen';
import {setDialogEl} from '@ui/root-el';
import {WidgetNavigation} from '@livechat/widget/widget-navigation/widget-navigation';
import {HomeScreen} from '@livechat/widget/home/home-screen';
import {Outlet, Route, Routes} from 'react-router-dom';
import {WidgetArticleScreen} from '@livechat/widget/hc/widget-article-screen';
import {CategoryListScreen} from '@livechat/widget/hc/category-list-screen';
import {CategoryScreen} from '@livechat/widget/hc/category-screen';
import {SectionScreen} from '@livechat/widget/hc/section-screen';
import {PopoverAnimation} from '@ui/overlays/popover-animation';
import {useWidgetPosition} from '@livechat/widget/hooks/use-widget-position';
import {useIsWidgetInline} from '@livechat/widget/hooks/use-is-widget-inline';
import {useSettings} from '@ui/settings/use-settings';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {ActiveChatScreen} from '@livechat/widget/chat/active-chat-screen/active-chat-screen';
import {ConversationsScreen} from '@livechat/widget/conversations/conversations-screen';

export default function LivechatPopup() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInline = useIsWidgetInline();
  const {chatWidget} = useSettings();
  const navigate = useNavigate();
  const defaultScreen = chatWidget?.defaultScreen ?? '/';
  const alreadySetDefaultScreen = useRef(false);
  const defaultScreenIsHomepage = defaultScreen === '/' || defaultScreen === '';
  const {paddingSide} = useWidgetPosition();

  useEffect(() => {
    setDialogEl(ref.current);
  }, []);

  useLayoutEffect(() => {
    if (!defaultScreenIsHomepage && !alreadySetDefaultScreen.current) {
      navigate(defaultScreen, {replace: true});
      alreadySetDefaultScreen.current = true;
    }
  }, [defaultScreen, defaultScreenIsHomepage, navigate]);

  // prevent home screen from rendering if default screen is not home screen
  if (!defaultScreenIsHomepage && !alreadySetDefaultScreen.current) {
    return null;
  }

  return (
    <m.div
      ref={ref}
      key="livechat-popup"
      {...(isInline ? {} : PopoverAnimation)}
      style={{
        paddingLeft: paddingSide,
        paddingRight: paddingSide,
      }}
      className="ml-auto min-h-0 w-full flex-auto pb-16"
    >
      <div className="chat-popup-shadow flex h-full min-h-0 w-full flex-col rounded-panel bg text">
        <Routes>
          <Route
            path=""
            element={
              <Fragment>
                <AnimatePresence initial={false}>
                  <Outlet />
                </AnimatePresence>
                {!chatWidget?.hideNavigation && <WidgetNavigation />}
              </Fragment>
            }
          >
            <Route index element={<HomeScreen />} />
            <Route path="chats" element={<ConversationsScreen />} />
            <Route path="hc" element={<HelpScreen />}>
              <Route index element={<CategoryListScreen />} />
              <Route
                path="categories/:categoryId"
                element={<CategoryScreen />}
              />
              <Route
                path="categories/:categoryId/:sectionId"
                element={<SectionScreen />}
              />
            </Route>
          </Route>
          <Route path="chats/new" element={<ActiveChatScreen />} />
          <Route path="chats/:chatId" element={<ActiveChatScreen />} />
          <Route
            path="hc/articles/:categoryId/:sectionId/:articleId/:articleSlug"
            element={<WidgetArticleScreen />}
          />
        </Routes>
      </div>
    </m.div>
  );
}
