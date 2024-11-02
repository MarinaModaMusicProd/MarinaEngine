import {useDebouncedCallback} from 'use-debounce';

type Sound = 'message' | 'newVisitor' | 'incomingChat' | 'queuedVisitor';

const audioCache: Record<string, HTMLAudioElement> = {};

export function useSoundManager() {
  // debounce to make sure we don't play the sounds too often
  const playSound = useDebouncedCallback((sound: Sound) => {
    const snakeCase = sound.replace(/([A-Z])/g, '-$1').toLowerCase();
    const audio =
      audioCache[snakeCase] ?? new Audio(`/sounds/${snakeCase}.mp3`);
    audioCache[snakeCase] = audio;
    audio.currentTime = 0;
    audio.volume = 0.4;
    audio.play();
  }, 2000);

  return {playSound};
}
