import { jsx } from "react/jsx-runtime";
import { useContext, useRef, useState, useCallback, useEffect } from "react";
import { P as PlayerStoreContext, u as usePlayerStore, a as useHtmlMediaInternalState, b as useHtmlMediaEvents, c as useHtmlMediaApi } from "./web-player-routes-d513a6a5.mjs";
import { supportsMediaSource, MediaPlayer } from "dashjs";
import "react-router-dom";
import "./use-channel-f6833f7b.mjs";
import "../server-entry.mjs";
import "react-dom/server";
import "process";
import "http";
import "@tanstack/react-query";
import "axios";
import "react-router-dom/server.mjs";
import "framer-motion";
import "clsx";
import "slugify";
import "deepmerge";
import "@internationalized/date";
import "nano-memoize";
import "zustand";
import "zustand/middleware/immer";
import "nanoid";
import "@internationalized/number";
import "@react-stately/utils";
import "@react-aria/utils";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "@react-aria/focus";
import "react-dom";
import "@react-aria/ssr";
import "react-hook-form";
import "immer";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
import "./play-arrow-filled-43482d1f.mjs";
import "@react-aria/interactions";
import "dot-object";
import "@react-stately/color";
import "./MoreHoriz-2a3c8f85.mjs";
import "fscreen";
import "zustand/middleware";
import "zustand/traditional";
import "./History-64deca81.mjs";
import "@tanstack/react-virtual";
import "just-debounce-it";
import "linkify-string";
import "./Edit-7b19e063.mjs";
function DashProvider() {
  const store = useContext(PlayerStoreContext);
  const cuedMedia = usePlayerStore((s) => s.cuedMedia);
  const videoRef = useRef(null);
  const htmlMediaState = useHtmlMediaInternalState(videoRef);
  const htmlMediaEvents = useHtmlMediaEvents(htmlMediaState);
  const htmlMediaApi = useHtmlMediaApi(htmlMediaState);
  const dash = useRef();
  const [dashReady, setDashReady] = useState(false);
  const destroyDash = useCallback(() => {
    if (dash.current) {
      dash.current.destroy();
      dash.current = void 0;
      setDashReady(false);
    }
  }, []);
  const setupDash = useCallback(() => {
    if (!supportsMediaSource()) {
      store.getState().emit("error", { fatal: true });
      return;
    }
    const dashInstance = MediaPlayer().create();
    dashInstance.on(MediaPlayer.events.ERROR, (e) => {
      store.getState().emit("error", { sourceEvent: e });
    });
    dashInstance.on(MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
      const levels = dashInstance.getBitrateInfoListFor("video");
      if (!(levels == null ? void 0 : levels.length))
        return;
      store.getState().emit("playbackQualities", {
        qualities: ["auto", ...levels.map(levelToPlaybackQuality)]
      });
      store.getState().emit("playbackQualityChange", { quality: "auto" });
    });
    dashInstance.initialize(videoRef.current, void 0, false);
    dash.current = dashInstance;
    setDashReady(true);
  }, [store]);
  useEffect(() => {
    setupDash();
    return () => {
      destroyDash();
    };
  }, [setupDash, destroyDash]);
  useEffect(() => {
    if (dash.current && (cuedMedia == null ? void 0 : cuedMedia.src)) {
      dash.current.attachSource(cuedMedia.src);
    }
  }, [cuedMedia == null ? void 0 : cuedMedia.src, dashReady]);
  useEffect(() => {
    if (!dashReady)
      return;
    store.setState({
      providerApi: {
        ...htmlMediaApi,
        setPlaybackQuality: (quality) => {
          if (!dash.current)
            return;
          const levels = dash.current.getBitrateInfoListFor("video");
          const index = levels.findIndex(
            (level) => levelToPlaybackQuality(level) === quality
          );
          dash.current.updateSettings({
            streaming: {
              abr: {
                autoSwitchBitrate: {
                  video: index === -1
                }
              }
            }
          });
          if (index >= 0) {
            dash.current.setQualityFor("video", index);
          }
          store.getState().emit("playbackQualityChange", { quality });
        }
      }
    });
  }, [store, htmlMediaApi, dashReady]);
  return /* @__PURE__ */ jsx(
    "video",
    {
      className: "h-full w-full",
      ref: videoRef,
      playsInline: true,
      poster: cuedMedia == null ? void 0 : cuedMedia.poster,
      ...htmlMediaEvents
    }
  );
}
const levelToPlaybackQuality = (level) => {
  return level === -1 ? "auto" : `${level.height}p`;
};
export {
  DashProvider as default
};
//# sourceMappingURL=dash-provider-9c1d7b10.mjs.map
