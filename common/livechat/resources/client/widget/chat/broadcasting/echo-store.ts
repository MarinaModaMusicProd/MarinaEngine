import {create} from 'zustand';
import type EchoType from 'laravel-echo';
import {bootEcho} from '@livechat/widget/chat/broadcasting/boot-echo';

interface DefaultEventPayload {
  event: string;
  [key: string]: any;
}
type Callback<T = DefaultEventPayload> = (e: T) => void;

interface EchoStoreState {
  presence: Partial<
    Record<
      string,
      {
        id: number | string;
        [key: string]: any;
      }[]
    >
  >;
  join: (channel: string, key: string) => void;
  listen: <T>(params: {
    channel: string;
    events: string[];
    callback: Callback<T>;
    type?: 'private' | 'presence' | 'public';
  }) => () => void;
}

interface PresenceEventData {
  id: number;
  name: string;
}

let echoInstance: EchoType | undefined;

const channelCache = new Map<
  string,
  {
    channel: ReturnType<EchoType['channel']> | ReturnType<EchoType['join']>;
    globalListeners: Map<string, Callback>;
  }
>();

const callbacks = new Map<string, Map<string, Callback[]>>();

// when using "join" instead of listen no callback will be provided so there's
// no way to know if the channel is still being used, so we need to keep track
const presenceKeys = new Map<string, Set<string>>();

const getCallbacksForEvent = (channel: string, event: string) => {
  return callbacks.get(channel)?.get(event);
};

const addCallback = (channel: string, event: string, callback: Callback) => {
  if (!callbacks.has(channel)) {
    callbacks.set(channel, new Map());
  }
  if (!getCallbacksForEvent(channel, event)) {
    callbacks.get(channel)!.set(event, []);
  }
  callbacks.get(channel)!.get(event)!.push(callback);
};

const getGlobalListener = (channel: string, event: string) => {
  return channelCache.get(channel)?.globalListeners.get(event);
};

const maybeLeaveChannel = (channel: string) => {
  const channelCallbacks = callbacks.get(channel);
  const keys = presenceKeys.get(channel);
  const hasCallbacks = !!channelCallbacks && channelCallbacks.size > 0;
  if (!keys?.size && !hasCallbacks) {
    echoInstance?.leave(channel);
    channelCache.delete(channel);
  }
};

const getOrCreateChannel = (
  channelName: string,
  type: 'private' | 'presence' | 'public' | undefined,
) => {
  if (!channelCache.has(channelName) && echoInstance) {
    let newChannel;
    if (type === 'public') {
      newChannel = echoInstance.channel(channelName);
    } else if (type === 'presence') {
      newChannel = echoInstance.join(channelName);
    } else {
      newChannel = echoInstance.private(channelName);
    }

    if (type === 'presence') {
      const presenceChannel = newChannel as ReturnType<EchoType['join']>;
      presenceChannel.here((data: PresenceEventData[]) => {
        useEchoStore.setState(s => ({
          presence: {...s.presence, [channelName]: data},
        }));
      });
      presenceChannel.joining((data: PresenceEventData) => {
        useEchoStore.setState(s => {
          const currentIds = s.presence[channelName] || [];
          return {
            presence: {...s.presence, [channelName]: [...currentIds, data]},
          };
        });
      });
      presenceChannel.leaving((data: PresenceEventData) => {
        useEchoStore.setState(s => {
          const currentItems = s.presence[channelName] || [];
          return {
            presence: {
              ...s.presence,
              [channelName]: currentItems.filter(item => item.id !== data.id),
            },
          };
        });
      });
    }

    channelCache.set(channelName, {
      channel: newChannel,
      globalListeners: new Map(),
    });
  }
};

export const useEchoStore = create<EchoStoreState>(() => ({
  presence: {},
  join: (channelName, key) => {
    let aborted = false;
    bootEcho().then(echo => {
      echoInstance = echo;

      if (aborted) return;

      getOrCreateChannel(channelName, 'presence');

      if (!presenceKeys.get(channelName)) {
        presenceKeys.set(channelName, new Set());
      }
      presenceKeys.get(channelName)!.add(key);
    });

    return () => {
      aborted = true;
      // remove key from cache
      const keys = presenceKeys.get(channelName);
      if (keys) {
        presenceKeys.delete(key);
      }
      maybeLeaveChannel(channelName);
    };
  },
  listen: ({channel: channelName, events, callback, type}) => {
    let aborted = false;
    bootEcho().then(echo => {
      echoInstance = echo;

      // if cleanup function is called before echo is lazy loaded, bail
      if (aborted) return;

      // find global echo channel instance in cache, or create one
      getOrCreateChannel(channelName, type);

      events.forEach(event => {
        // add callback to cache
        addCallback(channelName, event, callback as Callback);

        //find global listener for this event in cache, or create one
        if (!getGlobalListener(channelName, event)) {
          // set a global listener that will call all registered callbacks
          channelCache.get(channelName)!.globalListeners.set(event, data => {
            getCallbacksForEvent(channelName, event)!.forEach(cb => cb(data));
          });

          // bind global listener to echo instance
          channelCache
            .get(channelName)!
            .channel.listen(event, getGlobalListener(channelName, event)!);
        }
      });
    });

    return () => {
      aborted = true;

      // remove callbacks from cache
      events.forEach(event => {
        const eventCallbacks = getCallbacksForEvent(channelName, event);
        if (eventCallbacks) {
          const filteredCallbacks = eventCallbacks.filter(
            cb => cb !== callback,
          );
          if (filteredCallbacks.length) {
            callbacks.get(channelName)!.set(event, filteredCallbacks);
          } else {
            callbacks.get(channelName)!.delete(event);
          }
        }
        // if no more callbacks for this event, remove global listener and stop listening on echo
        if (!getCallbacksForEvent(channelName, event)?.length) {
          channelCache.get(channelName)?.globalListeners.delete(event);
          channelCache.get(channelName)?.channel.stopListening(event);
        }
        if (!callbacks.get(channelName)?.size) {
          callbacks.delete(channelName);
        }
      });

      // if channel has no more callbacks or presence keys, remove it from cache and leave
      maybeLeaveChannel(channelName);
    };
  },
}));

export function echoStore(): EchoStoreState {
  return useEchoStore.getState();
}
