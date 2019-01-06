import * as React from "react";
import { ApiClient } from "../../shared/api";
import "./list.css";
import { GetListData } from "../../shared/models";
import "../../shared/extensions";

interface Props {
  api: ApiClient;
}

interface State {
  currentPath: string[];
  items: GetListData[];
}

export class List extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentPath: [],
      items: []
    };
  }

  handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    const item = this.state.items.firstOrDefault(
      x => x.filename === e.currentTarget.innerText
    );

    if (!item || !item.isfolder) {
      return;
    }

    const newPath = [...this.state.currentPath, e.currentTarget.innerText];
    await this.loadList(newPath);
  };

  up = async () => {
    const newPath = [...this.state.currentPath];
    newPath.pop();
    await this.loadList(newPath);
  };

  async componentDidMount() {
    await this.loadList(["Multimedia", "music"]);
  }

  loadList = async (path: string[]) => {
    const pathStr = path.join("/");
    const list = await this.props.api.getList(pathStr);
    this.setState({
      currentPath: path,
      items: list.datas
    });
  };

  public render() {
    const list = this.state.items.map(x => (
      <div key={x.filename}>
        <span>[{x.isfolder ? "+" : "-"}]</span>
        <span onClick={this.handleClick}>{x.filename}</span>
      </div>
    ));
    return (
      <div>
        <span>{'/' + this.state.currentPath.join('/')}</span>
        <button onClick={this.up}>Up</button>
        <div>{list}</div>
      </div>
    );
  }
}
