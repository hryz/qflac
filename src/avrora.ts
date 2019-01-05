declare global {
  const AV: {
    Player: {
      fromBuffer(buffer: ArrayBuffer): Player;
    };
  };
}

export interface Player {
  buffered: number;
  currentTime: number;
  duration: number;
  pan: number;
  playing: boolean;

  volume: number | undefined;
  format: Format | undefined;
  metadata: Metadata | undefined;

  destroy: () => void;
  pause: () => void;
  play: () => void;
  preload: () => void;
  seek: (timestamp: number) => void;
  startPlaying: () => void;
  stop: () => void;
  togglePlayback: () => void;
}

export interface Format {
  bitsPerChannel: number;
  channelsPerFrame: number;
  formatID: string;
  sampleRate: number;
}

export interface Metadata {
  album: string;
  artist: string;
  date: string;
  genre: string;
  title: string;
  tracknumber: string;
  vendor: string;
}
