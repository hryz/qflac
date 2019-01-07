import * as React from "react";
import {ApiClient} from "../../shared/api";
import "./list.css";
import {GetListData} from "../../shared/models";
import "../../shared/extensions";
import {PreviewItem} from "../preview/preview.component";

interface Props {
  api: ApiClient;
  sendToPreview: (path: PreviewItem[]) => void;
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

  isValid = (e: string) => {
    const item = this.state.items.firstOrDefault(x => x.filename === e);
    if (!item || !item.isfolder) {
      return false;
    }
    return true;
  };

  handleClick = async (e: string) => {

    if (!this.isValid(e)) {
      return;
    }
    const newPath = [...this.state.currentPath, e];
    await this.loadList(newPath);
  };

  loadPreview = async (e: string) => {
    if (!this.isValid(e)) {
      return;
    }
    const path = [...this.state.currentPath, e];
    const files = await this.deepLoad(path.join('/'));
    this.props.sendToPreview(files);
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

  deepLoad = async (path: string): Promise<PreviewItem []> => {
    const result: PreviewItem[] = [];
    const list = await this.props.api.getList(path);
    for (const x of list.datas || []) {
      if (!x.isfolder) {
        if (x.filename.includes('.flac')) {
          result.push({folder: path, fileName: x.filename});
        }
      } else {
        const children = await this.deepLoad(`${path}/${x.filename}`);
        children.forEach(c => result.push(c));
      }
    }
    return result;
  };

  public render() {
    const list = this.state.items.map(x => this.item(x));
    return (
      <div className="listPanel">
        <div className="path">
          <button onClick={this.up}>Up</button>
          <div>{this.state.currentPath.join("/")}</div>
        </div>

        <div>{list}</div>
      </div>
    );
  }


  item(x: GetListData) {
    return (
      <div key={x.filename} className="listItem">
        <span className="icon">{x.isfolder ? "📁" : "📄"}</span>
        <span className="play" onClick={(_) => this.loadPreview(x.filename)}/>
        <span onClick={(_) => this.handleClick(x.filename)}>{x.filename}</span>
      </div>
    )
  }

}
