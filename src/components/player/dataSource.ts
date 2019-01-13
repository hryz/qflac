import {EventEmitter, Source, SourceEvents} from "./avrora";

export class FetchDataSource implements Source {
  private events: EventEmitter<SourceEvents>;
  private request: RequestInit;
  private url: string;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null | undefined;
  private size: number;
  private loaded: number;

  constructor(url: string, request: RequestInit) {
    this.events = new AV.EventEmitter<SourceEvents>();
    this.url = url;
    this.request = request;
    this.loaded = 0;
    this.size = 0;
  }

  start(): void {
    fetch(this.url, this.request)
      .then(this.processResponse)
      .catch(this.errorHandler);
  }

  processResponse = (x: Response) => {
    if (x.status !== 200 || x.body === null) {
      this.errorHandler('error getting data');
      return;
    }

    this.size = parseInt(x.headers.get('content-length') || '0', 0);
    this.loaded = 0;
    this.reader = x.body.getReader();

    this.reader.read()
      .then(this.processChunk)
      .catch(this.errorHandler);
  };

  processChunk = (x: { done: boolean, value: Uint8Array }) => {
    if (x.done) {
      this.emit('end', {});
      return;
    }

    this.loaded += x.value.length;

    const self = this;
    self.emit('progress', (self.loaded / self.size) * 100);
    self.emit('data', new AV.Buffer(x.value));

    if (this.reader) {
      this.reader.read()
        .then(this.processChunk)
        .catch(this.errorHandler);
    } else {
      this.errorHandler('reader is null');
    }
  };

  pause = () => this.reset();

  reset(): void {
    if (this.reader) {
      this.reader.cancel()
        .then(() => this.reader = null)
        .catch(this.errorHandler);
    } else {
      this.errorHandler('reader is null');
    }
  }

  emit = (e: SourceEvents, params: any) => this.events.emit(e, params);
  off = (e: SourceEvents, handler: (e: any) => void) => this.events.off(e, handler);
  on = (e: SourceEvents, handler: (e: any) => void) => this.events.on(e, handler);
  once = (e: SourceEvents, handler: (e: any) => void) => this.events.once(e, handler);

  private errorHandler(err: any) {
    this.reset();
    this.emit('error', err);
    console.log(err);
  }

}