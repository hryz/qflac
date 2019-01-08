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

  volume?: number;
  format?: Format;
  metadata?: Metadata;

  pause(): void;

  play(): void;

  preload(): void;

  seek(timestamp: number): void;

  startPlaying(): void;

  stop(): void;

  togglePlayback(): void;

  on(e: PlayerEvent, handler: (e: any) => void): void;

  off(e: PlayerEvent): void;
}

type PlayerEvent =
  'buffer'
  | 'format'
  | 'duration'
  | 'metadata'
  | 'ready'
  | 'progress'
  | 'error'
  | 'end'

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
