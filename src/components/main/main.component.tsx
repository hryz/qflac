import * as React from "react";
import {Preview, PreviewItem} from "../preview/preview.component";
import {List} from "../list/list.component";
import {PlayerComponent} from "../player/player.component";
import {ApiClient, FetchRequest} from "../../shared/api";

interface Props {
  api: ApiClient;
}

interface State {
  previewFiles: PreviewItem[];
  activePreviewItem?: PreviewItem;
  downloadRequest?: FetchRequest
}

export class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      previewFiles: []
    };
  }

  activate = (item: PreviewItem) => {
    const file = this.props.api.downloadRequest([item.folder, item.fileName].join('/'));

    this.setState({
      ...this.state,
      activePreviewItem: item,
      downloadRequest: file
    });
  };

  sendToPreview = (files: PreviewItem[]) => {
    this.setState({previewFiles: files});
  };

  public render() {
    return (
      <div>
        <List api={this.props.api} sendToPreview={this.sendToPreview}/>
        <PlayerComponent
          api={this.props.api}
          items={this.state.previewFiles}
          activate={this.activate}
          downloadRequest={this.state.downloadRequest}
          activeItem={this.state.activePreviewItem}/>
        <Preview
          api={this.props.api}
          items={this.state.previewFiles}
          activate={this.activate}
          activeItem={this.state.activePreviewItem}/>
      </div>
    );
  }
}
