import * as React from "react";
import { ApiClient } from "../../shared/api";
import "./list.css";

interface Props {
  api: ApiClient;
}

interface State {
  currentPath: string[];
  items: string[];
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
      items: list.datas.map(x => x.filename)
    });
  };

  public render() {
    const list = this.state.items.map(x => (
      <li key={x} onClick={this.handleClick}>
        {x}
      </li>
    ));
    return (
      <div>
        <button onClick={this.up}>Up</button>
        <ul>{list}</ul>
      </div>
    );
  }
}
