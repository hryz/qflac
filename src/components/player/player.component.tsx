import * as React from "react";
import './player.css'
import {PreviewItem} from "../preview/preview.component";
import {Player} from "./avrora";
import {FetchRequest} from "../../shared/api";
import {FetchDataSource} from "./dataSource";

interface Props {
  items: PreviewItem []
  activate: (item: PreviewItem) => void
  activeItem?: PreviewItem
  downloadRequest?: FetchRequest
}

interface State {
  player?: Player | null,
  activeItem?: PreviewItem,
  progress?: number,
  buffering?:number,
  isPlaying: boolean,
  volume: number
}

export class PlayerComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {isPlaying: false, volume: 50};
    this.next.bind(this);
  }

  showProgress = (x: number) => {
    if (!this.state.player) {
      return;
    }
    this.setState({...this.state, progress: x});
  };

  showBuffering = (x: number) => {
    if (!this.state.player) {
      return;
    }
    this.setState({...this.state, buffering: x});
  };

  initPlayer = (file: FetchRequest) => {
    if (this.state.player) {
      this.state.player.off('progress', this.showProgress);
      this.state.player.off('end',this.next);
      this.state.player.off('buffer', this.showBuffering);
      this.state.player.stop();
    }

    const source = new FetchDataSource(file.url, file.request);
    const asset = new AV.Asset(source);
    const player = new AV.Player(asset);

    player.on('progress', this.showProgress);
    player.on('end', this.next);
    asset.on('buffer', this.showBuffering);
    player.volume = this.state.volume;
    player.play();
    this.setState({
      player,
      activeItem: this.props.activeItem,
      progress: player.currentTime,
      isPlaying: true
    });
  };

  next = (): void => {
    if (this.props.items.length === 0) {
      throw Error('Can not play next because playlist is empty');
    }

    if (!this.state.activeItem) {
      throw Error('Can not play next because current is unknown');
    }

    const is = this.props.items;
    const i = this.state.activeItem;
    const item = is.firstOrDefault(x => x.fileName === i.fileName && x.folder === i.folder);
    if (!item) {
      this.props.activate(is[0]);
      return;
    }
    const index = is.indexOf(item);
    if (index === -1) {
      this.props.activate(is[0]);
      return;
    }
    if (index === is.length - 1) {
      this.props.activate(is[0]);
      return;
    }
    this.props.activate(is[index + 1]);
    return;
  };

  playOrPause = () => {
    if (!this.state.player) {
      return;
    }
    this.state.player.togglePlayback();
    this.setState({...this.state, isPlaying: !this.state.isPlaying});
  };

  volUp = () => {
    const volume = this.state.volume < 90 ? this.state.volume + 10 : 100;
    if (this.state.player && this.state.player.volume !== undefined) {
      this.state.player.volume = volume;
    }
    this.setState({...this.state, volume});
  };

  volDown = () => {
    const volume = this.state.volume > 10 ? this.state.volume - 10 : 0;
    if (this.state.player && this.state.player.volume !== undefined) {
      this.state.player.volume = volume;
    }
    this.setState({...this.state, volume});
  };

  toTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec - min * 60;

    return min.toString().padStart(2, '0')
      + ':' +
      sec.toString().padStart(2, '0');
  };

  public render() {
    const prev = this.state.activeItem;
    const cur = this.props.activeItem;
    if (!cur || !prev || cur.fileName !== prev.fileName || cur.folder !== prev.folder) {
      if (this.props.downloadRequest) {
        this.initPlayer(this.props.downloadRequest);
      }
    }

    const playOrPause = (_: any) => this.playOrPause();
    const total = this.state.player && this.state.player.duration ? this.state.player.duration : 0;
    const now = this.state.player && this.state.player.currentTime ? this.state.player.currentTime : 0;
    const md = this.state.player && this.state.player.metadata ? this.state.player.metadata :
      {album: '-', artist: '-', date: '-', genre: '-', title: '-', tracknumber: '-', vendor: '-'};

    const volUp = (_: any) => this.volUp();
    const volDown = (_: any) => this.volDown();

    return <div className="player">

      <div className="metaData">
        <strong>Artist:</strong> <span>{md.artist}</span>
        <strong>Title:</strong> <span>{md.title}</span>
        <strong>Track No:</strong> <span>{md.tracknumber}</span>
        <strong>Album:</strong> <span>{md.album}</span>
      </div>

      <div>
        <button onClick={playOrPause}>{this.state.isPlaying ? '⏸️' : '▶️'}</button>
        <span>{this.toTime(now)}/{this.toTime(total)}</span>
        <button onClick={volDown}>🔉</button>
        <span>Vol:{this.state.volume}</span>
        <button onClick={volUp}>🔊</button>
        <span>Buffering: {this.state.buffering || 0} %</span>
      </div>
    </div>;
  }
}
