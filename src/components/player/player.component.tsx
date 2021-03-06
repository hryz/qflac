import * as React from "react";
import './player.css'
import {PreviewItem} from "../preview/preview.component";
import {Metadata, Player} from "./avrora";
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Props {
  items: PreviewItem []
  activate: (item: PreviewItem) => void
  activeItem?: PreviewItem
}

interface State {
  duration?: number,
  progress?: number,
  buffering?: number,
  metaData?: Metadata,
  isPlaying: boolean,
  volume: number
}

export class PlayerComponent extends React.Component<Props, State> {
  player?: Player;

  constructor(props: Props) {
    super(props);
    this.state = {isPlaying: false, volume: 50};
    this.next.bind(this);
  }

  async componentWillUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): Promise<void> {
    if (!this.props.activeItem || this.props.activeItem !== nextProps.activeItem) {
      await this.initPlayer(nextProps.activeItem);
    }
  }

  showProgress = (x: number) => {
    if (!this.player) {
      return;
    }
    this.setState({...this.state, progress: x, duration: this.player.duration});
  };

  showBuffering = (x: number) => {
    if (!this.player) {
      return;
    }
    this.setState({...this.state, buffering: x});
  };

  setMetadata = (md: Metadata) => {
    this.setState({...this.state, metaData: md});
  };

  initPlayer = async (activeItem?: PreviewItem) => {
    if (this.player) {
      this.player.off('progress', this.showProgress);
      this.player.off('end', this.next);
      this.player.off('buffer', this.showBuffering);
      this.player.off('metadata', this.setMetadata);
      this.player.stop();
      delete this.player;
    }

    if (!activeItem) {
      return;
    }

    if (!process.env.REACT_APP_API_URL) {
      return;
    }

    let url = process.env.REACT_APP_API_URL.replace('api.php', '');
    url = url + activeItem.folder.substring(2) + '/' + activeItem.fileName;
    const player = AV.Player.fromURL(url.replace('#', '%23'));
    this.player = player;


    player.on('progress', this.showProgress);
    player.on('end', this.next);
    player.on('buffer', this.showBuffering);
    player.on('metadata', this.setMetadata);
    player.volume = this.state.volume;
    player.play();
    this.setState({
      isPlaying: true
    });
  };

  next = (): void => {
    if (this.props.items.length === 0) {
      throw Error('Can not play next because playlist is empty');
    }

    if (!this.props.activeItem) {
      throw Error('Can not play next because current is unknown');
    }

    const items = this.props.items;
    const i = this.props.activeItem;
    const item = items.find(x => x.fileName === i.fileName && x.folder === i.folder);
    if (!item) {
      this.props.activate(items[0]);
      return;
    }
    const index = items.indexOf(item);
    if (index === -1) {
      this.props.activate(items[0]);
      return;
    }
    if (index === items.length - 1) {
      this.props.activate(items[0]);
      return;
    }
    this.props.activate(items[index + 1]);
    return;
  };

  playOrPause = () => {
    if (!this.player) {
      return;
    }

    this.player.togglePlayback();
    this.setState({...this.state, isPlaying: !this.state.isPlaying});
  };

  setVolume = (vol: number) => {
    if (this.player && this.player.volume !== undefined) {
      this.player.volume = vol;
    }
    this.setState({...this.state, volume: vol});
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

    const playOrPause = () => this.playOrPause();
    const total = this.state.duration || 0;
    const now = this.state.progress || 0;
    const md = this.state.metaData || {artist: '-', title: '-'};

    const buffering = this.state.buffering
      ? this.state.buffering / 100 * total
      : now;

    return <div className="player">
      <div className="metaData">
        <span className="playButton" onClick={playOrPause}>
          {this.state.isPlaying ? '⏸️' : '▶️'}
        </span>
        <span>{md.artist} - {md.title}</span>
      </div>
      <div className="volume center">
        <Slider
          value={this.state.volume}
          onChange={this.setVolume}
          max={100}
          min={0}
          handleStyle={{borderColor: '#316ac5'}}
          railStyle={{backgroundColor: 'grey'}}
          trackStyle={{backgroundColor: '#316ac5'}}
        />
      </div>


      <div className="seeker">
        <div className="now center">{this.toTime(now)}</div>
        <div className="rail center">
          <Range
            count={2}
            value={[now, buffering]}
            max={total}
            handleStyle={[{borderColor: '#316ac5'}, {display: 'none'}]}
            railStyle={{backgroundColor: '#316ac5'}}
            trackStyle={[{backgroundColor: 'grey'}, {}]}
          />

        </div>
        <div className="total center">{this.toTime(total)}</div>
      </div>
    </div>;
  }
}
