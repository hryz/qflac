import * as React from "react";
import {ApiClient} from "../../shared/api";
import "../../shared/extensions";
import {PreviewItem} from "../preview/preview.component";
import Tree, {ExpandData, SelectData, TreeNode} from "rc-tree";
import {findTree, ITree} from "./ITree";
import 'rc-tree/assets/index.css';
import "./list.css";

interface Props {
  api: ApiClient;
  sendToPreview: (path: PreviewItem[]) => void;
}

interface Node {
  path: string,
  title: string,
  isFolder: boolean
}

interface State {
  tree: ITree<Node>;
}

export class List extends React.Component<Props, State> {
  rootPath = '/Multimedia/music';

  constructor(props: Props) {
    super(props);

    this.state = {
      tree: {
        node: {
          title: this.rootPath,
          path: this.rootPath,
          isFolder: true
        },
        childNodes: []
      }
    }
  }


  isValid = (path: string) => {
    const item = findTree(this.state.tree, x => x.node.path === path);
    if (!item || !item.node.isFolder || path === this.rootPath) {
      return false;
    }
    return true;
  };

  handleClick = async (path: string) => {
    if (!this.isValid(path)) {
      return;
    }

    const children = await this.loadList(path);
    const item = findTree(this.state.tree, x => x.node.path === path);

    if (item) {
      item.childNodes = children.map(c => ({
        node: c,
        childNodes: []
      }));

      this.setState(this.state);
    }
  };

  loadPreview = async (e: string) => {
    if (!this.isValid(e)) {
      return;
    }
    const files = await this.deepLoad(e);
    this.props.sendToPreview(files);
  };


  async componentDidMount() {
    const list = await this.loadList(this.rootPath);
    const tree: ITree<Node> = {
      ...this.state.tree,
      childNodes: list.map(c => ({
        node: c,
        childNodes: []
      }))
    };
    this.setState({tree});
  }

  loadList = async (path: string): Promise<Node[]> => {
    const list = await this.props.api.getList(path);
    return list.datas.map<Node>(x => ({
      title: x.filename,
      path: `${path}/${x.filename}`,
      isFolder: x.isfolder > 0
    }));
  };

  deepLoad = async (path: string): Promise<PreviewItem []> => {
    const result: PreviewItem[] = [];
    const list = await this.props.api.getList(path);

    list.datas
      .filter(x => !x.isfolder && x.filename.includes('.flac'))
      .forEach(x => result.push({folder: path, fileName: x.filename}));

    const childPromises = list.datas
      .filter(x => x.isfolder && x.filename !== 'Covers')
      .map(x => this.deepLoad(`${path}/${x.filename}`));

    const children = await Promise.all(childPromises);
    children.forEach(c => c.forEach(x => result.push(x)));

    return result;
  };

  renderNode = (n: ITree<Node>) => {
    return (
      <TreeNode title={n.node.title} key={n.node.path} isLeaf={!n.node.isFolder} disabled={!n.node.isFolder}>
        {n.childNodes.map(c => this.renderNode(c))}
      </TreeNode>)
  };

  public render() {

    const onSelect = async (selectedKeys: string[], e: SelectData) => {
      if (!e.selected) {
        return;
      }
      await this.loadPreview(selectedKeys[selectedKeys.length - 1]);
    };
    const onExpand = async (expandedKeys: string[], e: ExpandData) => {
      if(!e.expanded){
        return;
      }
      await this.handleClick(expandedKeys[expandedKeys.length-1]);
    };

    return (
      <Tree
        className="listPanel"
        showLine
        checkable={false}
        selectable={true}
        onExpand={onExpand}
        onSelect={onSelect}
        defaultExpandAll={true}
      >
        {this.renderNode(this.state.tree)}
      </Tree>
    )
  }

}
