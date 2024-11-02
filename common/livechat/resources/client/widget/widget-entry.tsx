import '../widget/widget.css';
import {createRoot} from 'react-dom/client';
import {rootEl} from '@ui/root-el';
import React, {StrictMode} from 'react';
import {ToastContainer} from '@ui/toast/toast-container';
import {DialogStoreOutlet} from '@ui/overlays/store/dialog-store-outlet';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from '@common/http/query-client';
import {domAnimation, LazyMotion} from 'framer-motion';
import {AppearanceListener} from '@common/admin/appearance/commands/appearance-listener';
import {BrowserRouter} from 'react-router-dom';
import {ChatWidget} from '@livechat/widget/chat-widget';
import {ThemeProvider} from '@common/core/theme-provider';

const app = (
  <StrictMode>
    <BrowserRouter basename="widget">
      <ToastContainer />
      <DialogStoreOutlet />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppearanceListener />
          <LazyMotion features={domAnimation}>
            <ChatWidget />
          </LazyMotion>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

createRoot(rootEl).render(app);
