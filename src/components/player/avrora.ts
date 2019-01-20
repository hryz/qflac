declare global {
  const AV: {
    Player: {
      new(asset: Asset): Player;
      fromBuffer(buffer: ArrayBuffer): Player;
      fromURL(url: string, opts?: { length: number }): Player;
      fromFile(file: FileReader): Player;
    },
    Asset: {
      new(source: Source): Asset;
      fromBuffer(buffer: ArrayBuffer): Asset;
      fromURL(url: string, opts?: { length: number }): Asset;
      fromFile(file: FileReader): Asset;
    },
    EventEmitter: new<T>() => EventEmitter<T>,
    Buffer: new(data:Uint8Array) => any;
  };
}

export interface Player extends EventEmitter<PlayerEvents> {
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
}

export type PlayerEvents = AssetEvents | SourceEvents | 'buffered' | 'ready'

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

export type AssetEvents = 'error' | 'duration' | 'metadata' | 'format' | 'data' | 'end' | 'decodeStart' | 'buffer'

export interface Asset extends EventEmitter<AssetEvents> {
  start(decode: any): void;

  stop(): void;

  get(event: AssetEvents, callback: (e: any) => void): void;

  decodePacket(): void;

  decodeToBuffer(callback: (e: any) => void): void;

  probe(chunk: any): void;

  findDecoder(format: any): void;

  destroy(): void;
}


export type SourceEvents = 'progress' | 'data' | 'end' | 'error'

export interface Source extends EventEmitter<SourceEvents> {
  start(): void;

  loop?(): void;

  pause(): void;

  reset(): void;
}

export interface EventEmitter<TEvent> {
  on(e: TEvent, handler: (e: any) => void): void;

  off(e: TEvent, handler: (e: any) => void): void;

  once(e: TEvent, handler: (e: any) => void): void;

  emit(e: TEvent, params: any): void;
}