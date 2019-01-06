import * as React from "react";
import { Preview } from "../preview/player.component";
import { List } from "../list/list.component";
import { Player } from "../player/player.component";
import { ApiClient } from "../../shared/api";

interface Props {
  api: ApiClient;
}

export class Main extends React.Component<Props> {
  public render() {
    return (
      <div>
        <List api={this.props.api} />
        <Preview />
        <Player />
      </div>
    );
  }
}
