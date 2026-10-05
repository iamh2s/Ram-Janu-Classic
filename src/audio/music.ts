const MUSIC_SRC = "/music/music.mp3";

let audio: HTMLAudioElement | null = null;

export const weddingMusic = {
  start: async (): Promise<void> => {
    if (!audio) {
      audio = new Audio(MUSIC_SRC);

      audio.loop = true;
      audio.volume = 0.5;
      audio.preload = "auto";
    }

    if (audio.paused) {
      await audio.play();
    }
  },

  stop: (): void => {
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  },

  isPlaying: (): boolean => {
    return audio !== null && !audio.paused;
  },

  setVolume: (volume: number): void => {
    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, volume));
  },
};