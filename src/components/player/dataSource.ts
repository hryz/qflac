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
      .then(x => {
        if (x.status !== 200 || x.body === null) {
          this.errorHandler('error getting data');
          return;
        }
        this.reader = x.body.getReader();

        this.size = parseInt(x.headers.get('content-length') || '0', 0); // TODO: this header is not available because of CORS, even when I changed the apache config
        this.loaded = 0;

        const processChunk: (x: { done: boolean, value: Uint8Array }) => void = ({done, value}) => {

          if (done) {
            this.emit('end', {});
            return;
          }

          this.loaded += value.length;

          this.emit('progress', (this.loaded / this.size) * 100);
          this.emit('data', new AV.Buffer(value));

          if (this.reader) {
            this.reader.read().then(processChunk);
          }
        };

        this.reader.read()
          .then(processChunk)
          .catch(this.errorHandler);
      })
      .catch(this.errorHandler);
  }

  pause(): void {
    this.reset();
  }

  reset(): void {
    if (this.reader) {
      this.reader.cancel()
        .then(() => {
          this.reader = null;
        });
    }
  }

  emit(e: SourceEvents, params: any): void {
    this.events.emit(e, params);
  }

  off(e: SourceEvents, handler: (e: any) => void): void {
    this.events.off(e, handler);
  }

  on(e: SourceEvents, handler: (e: any) => void): void {
    this.events.on(e, handler);
  }

  once(e: SourceEvents, handler: (e: any) => void): void {
    this.events.once(e, handler);
  }

  private errorHandler(err: any) {
    this.reset();
    return this.emit('error', err);
  }

}