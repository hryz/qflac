import * as React from "react";
import "../../shared/extensions";
import {PreviewItem} from "../preview/preview.component";
import Tree, {SelectData, TreeNode} from "rc-tree";
import {findTree, flatten, ITree} from "./ITree";
import 'rc-tree/assets/index.css';
import "./list.css";

interface Props {
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


  constructor(props: Props) {
    super(props);

    this.state = {
      tree: {
        childNodes: [],
        node: {
          title: '',
          isFolder: true,
          path: ''
        }
      }
    }
  }


  loadPreview = async (e: string) => {
    const files = await this.deepLoad(e);
    this.props.sendToPreview(files);
  };


  public mapTree = (t: any, path: string): ITree<Node> => {
    if (typeof t === 'string') {

      return {
        childNodes: [],
        node: {
          isFolder: false,
          title: t,
          path
        }
      }

    } else if (typeof t === 'object') {
      const name = Object.getOwnPropertyNames(t)[0];
      return {
        node: {
          isFolder: true,
          title: name,
          path
        },
        childNodes: t[name].map((x: any) => this.mapTree(x, path + '/' + name))
          .filter((f: ITree<Node>) => this.isUseful(f.node))
      }
    }

    throw Error('tree node type is incorrect' + typeof t);
  };

  public isUseful = (n: Node): boolean => (n.isFolder || n.title.indexOf('.flac') >= 0);

  public async componentDidMount() {
    if (process.env.REACT_APP_API_URL) {
      const response = await fetch(process.env.REACT_APP_API_URL);
      const body = await response.json();

      const tree = this.mapTree({music: body}, '.');
      this.setState({tree});
    }
  }


  deepLoad = (path: string): PreviewItem [] => {

    const subTree = findTree(this.state.tree, x => `${x.node.path}/${x.node.title}` === path);
    if (subTree) {
      return flatten(subTree)
        .filter(x => !x.isFolder)
        .map<PreviewItem>(x => ({
          fileName: x.title,
          folder: x.path
        }));
    }
    return [];
  };

  public renderNode = (n: ITree<Node>) => {
    return (
      <TreeNode
        title={n.node.title}
        key={`${n.node.path}/${n.node.title}`}
        isLeaf={!n.node.isFolder}
        disabled={!n.node.isFolder}>
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

    return (
      <Tree
        className="listPanel"
        showLine
        checkable={false}
        selectable={true}
        onSelect={onSelect}
        defaultExpandAll={true}
      >
        {this.renderNode(this.state.tree)}
      </Tree>
    )
  }

}
