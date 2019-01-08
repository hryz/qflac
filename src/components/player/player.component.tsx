import * as React from "react";
import './player.css'
import {PreviewItem} from "../preview/preview.component";
import {Player} from "./avrora";

interface Props {
  items: PreviewItem []
  activate: (item: PreviewItem) => Promise<void>
  activeItem?: PreviewItem
  buffer?: ArrayBuffer
}

interface State {
  player?: Player | null,
  activeItem?: PreviewItem,
  progress?: number,
  isPlaying: boolean
}

export class PlayerComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {isPlaying: false};
    this.next.bind(this);
  }

  showProgress = (x: number) => {
    if (!this.state.player) {
      return;
    }
    this.setState({...this.state, progress: x});
  };

  initPlayer = (file: ArrayBuffer) => {
    if (this.state.player) {
      this.state.player.off('progress');
      this.state.player.off('end');
      this.state.player.stop();
    }

    const player = AV.Player.fromBuffer(file);
    player.on('progress', this.showProgress);
    player.on('end', this.next);
    player.play();
    this.setState({
      player,
      activeItem: this.props.activeItem,
      progress: player.currentTime,
      isPlaying: true
    });
  };

  next = (): Promise<void> => {
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
      return this.props.activate(is[0]);
    }
    const index = is.indexOf(item);
    if (index === -1) {
      return this.props.activate(is[0]);
    }
    if (index === is.length - 1) {
      return this.props.activate(is[0]);
    }
    return this.props.activate(is[index + 1]);
  };

  playOrPause = () => {
    if (!this.state.player) {
      return;
    }
    this.state.player.togglePlayback();
    this.setState({...this.state, isPlaying: !this.state.isPlaying});
  };

  public render() {
    const prev = this.state.activeItem;
    const cur = this.props.activeItem;
    if (!cur || !prev || cur.fileName !== prev.fileName || cur.folder !== prev.folder) {
      if (this.props.buffer) {
        this.initPlayer(this.props.buffer);
      }
    }

    const playOrPause = (_: any) => this.playOrPause();
    const total = this.state.player && this.state.player.duration ? this.state.player.duration : 0;
    const now = this.state.player && this.state.player.currentTime ? this.state.player.currentTime : 0;
    const md = this.state.player && this.state.player.metadata ? this.state.player.metadata :
      {album: '-', artist: '-', date: '-', genre: '-', title: '-', tracknumber: '-', vendor: '-'};

    return <div className="player">

      <div className="metaData">
        <strong>artist:</strong> <span>{md.artist}</span>
        <strong>title:</strong> <span>{md.title}</span>
        <strong>track:</strong> <span>{md.tracknumber}</span>
        <strong>album:</strong> <span>{md.album}</span>
      </div>

      <div>
        <button onClick={playOrPause}>{this.state.isPlaying ? 'Pause' : 'Play'}</button>
        <strong>progress:</strong> <span>{now}/{total}</span>
      </div>
    </div>;
  }
}
