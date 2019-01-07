import * as React from "react";
import {Preview, PreviewItem} from "../preview/preview.component";
import {List} from "../list/list.component";
import {Player} from "../player/player.component";
import {ApiClient} from "../../shared/api";

interface Props {
  api: ApiClient;
}

interface State {
  previewFiles: PreviewItem[];
}

export class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {previewFiles:[]};
  }

  sendToPreview = (files: PreviewItem[]) => {
    this.setState({previewFiles: files});
  };

  public render() {
    return (
      <div>
        <List api={this.props.api} sendToPreview={this.sendToPreview}/>
        <Player/>
        <Preview api={this.props.api} items={this.state.previewFiles} />
      </div>
    );
  }
}
