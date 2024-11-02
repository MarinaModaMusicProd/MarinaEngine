import {create} from 'zustand';

export const widgetSizes = {
  open: {width: '416px', height: '800px'},
  closed: {width: '94px', height: '94px'},
  articleMaximized: {width: '700px', height: '100%'},
};

interface WidgetState {
  activeSize: keyof typeof widgetSizes;
  setActiveSize: (size: keyof typeof widgetSizes, isInitial?: boolean) => void;
}

export const useWidgetStore = create<WidgetState>()((set, get) => ({
  activeSize: 'closed',
  setActiveSize: (size, isInitial) => {
    const isClosing = size === 'closed';
    const prevSize = get().activeSize;
    if (prevSize === size && !isInitial) return;

    // when closing, first set size state to initiate close animation,
    // wait for animation to complete and then resize iframe
    if (isClosing) {
      set({activeSize: size});
      setTimeout(() => {
        notifyIframeOfSizeChange(size);
      }, 300);
      // when opening, resize iframe first, wait a tick and then set size state
    } else {
      const shouldTransition =
        prevSize === 'articleMaximized' || size === 'articleMaximized';
      notifyIframeOfSizeChange(size, shouldTransition);
      setTimeout(() => {
        set({activeSize: size});
      });
    }
  },
}));

export const widgetStore = (): WidgetState => {
  return useWidgetStore.getState();
};

function notifyIframeOfSizeChange(
  size: keyof typeof widgetSizes,
  shouldTransition?: boolean,
) {
  window.parent.postMessage(
    {
      source: 'livechat-widget',
      type: 'resize',
      width: widgetSizes[size].width,
      height: widgetSizes[size].height,
      shouldTransition,
    },
    '*',
  );
}
