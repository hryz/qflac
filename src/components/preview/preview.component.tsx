import * as React from "react";
import './preview.css'
import {ApiClient} from "../../shared/api";
import '../../shared/extensions';


export interface PreviewItem {
  fileName: string;
  folder: string
}

interface Props {
  api: ApiClient,
  items: PreviewItem []
}

export class Preview extends React.Component<Props> {

  folders = (map: Array<Grouping<string, string>>) => {
    return map.map(dir => (
      <div key={dir.key}>
        <div className="previewFolder">{dir.key}</div>
        <div>
          {dir.values.map(v => this.file(dir.key, v))}
        </div>
      </div>
    ));
  };

  file = (path: string, file: string) => {
    return <div key={`${path}/${file}`} className="previewFile">{file}</div>
  };

  public render() {
    const folders = this.props.items
      .groupBy(x => x.folder)
      .map(g => {
        return {
          key: g.key,
          values: g.values.map(v => v.fileName)
        } as Grouping<string, string>
      });
    const list = this.folders(folders);

    return <div className="preview">{list}</div>;
  }
}
