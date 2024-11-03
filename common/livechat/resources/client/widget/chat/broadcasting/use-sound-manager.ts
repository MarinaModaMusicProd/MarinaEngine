import {useCallback} from 'react';

const audioElCache = new Map<string, HTMLAudioElement>();

type Sound = 'message' | 'newVisitor' | 'incomingChat';

// todo: create audio elements from js side, no need to include with initial html from blade template

export function useSoundManager() {
  const playSound = useCallback((sound: Sound) => {
    const snakeCase = sound.replace(/([A-Z])/g, '-$1').toLowerCase();
    const id = `sound-${snakeCase}`;
    let audioEl = audioElCache.get(id);
    if (!audioEl) {
      audioElCache.set(id, document.querySelector(`#${id}`)!);
      audioEl = audioElCache.get(id);
    }
    audioEl!.currentTime = 0;
    audioEl!.play();
  }, []);

  return {playSound};
}
