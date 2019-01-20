import * as React from "react";
import {Preview, PreviewItem} from "../preview/preview.component";
import {List} from "../list/list.component";
import {PlayerComponent} from "../player/player.component";

interface State {
  previewFiles: PreviewItem[];
  activePreviewItem?: PreviewItem;
}

export class Main extends React.Component<{}, State> {
  constructor(props:{}) {
    super(props);

    this.state = {
      previewFiles: []
    };
  }

  activate = (item: PreviewItem) => {
    this.setState({
      ...this.state,
      activePreviewItem: item,
    });
  };

  sendToPreview = (files: PreviewItem[]) => {
    this.setState({previewFiles: files});
  };

  public render() {
    return (
      <div>
        <List sendToPreview={this.sendToPreview}/>
        <PlayerComponent
          items={this.state.previewFiles}
          activate={this.activate}
          activeItem={this.state.activePreviewItem}/>
        <Preview
          items={this.state.previewFiles}
          activate={this.activate}
          activeItem={this.state.activePreviewItem}/>
      </div>
    );
  }
}
