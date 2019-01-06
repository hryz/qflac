import { LoginResponse, LogoutResponse, GetTreeResponseItem, GetListResponse } from "./models";
import '../shared/extensions'

export class ApiClient {
  private sid: string;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl + "/cgi-bin/filemanager";
    this.sid = "";
  }

  async login(userName: string, password: string) {
    const response = await fetch(`${this.baseUrl}/wfm2Login.cgi`, {
      body: this.toBody({ user: userName, pwd: btoa(password) }),
      method: "POST"
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    const body = await response.json().cast<LoginResponse>();
    if(body.status === 0){
     return false;
    }

    this.sid = body.sid || '';
    return true;
  }

  async logout() {
    const response = await fetch(`${this.baseUrl}/wfm2Logout.cgi`, {
      body: null,
      method: "POST"
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    const body = await response.json().cast<LogoutResponse>();
    return body.success === 'true';
  }

  async getList(path: string, start = 0, limit = 100) {
    const resp = await fetch(
      `${this.baseUrl}/utilRequest.cgi?func=get_list&sid=${this.sid}`,
      {
        body: this.toBody({
          start,
          limit,
          sort: "filename",
          dir: "ASC",
          list_mode: "all",
          noSupportACL: true,
          path,
          is_iso: 1,
          access: 7,
          v: 1,
          media: 2,
          recycle: 0,
          hidden_file: 0
        }),
        method: "POST"
      }
    );
    const body = await resp.json().cast<GetListResponse>();
    return body;
  }

  async getTree(path: string) {
    const resp = await fetch(
      `${this.baseUrl}/utilRequest.cgi?func=get_tree&sid=${this.sid}`,
      {
        body: this.toBody({
          is_iso: 0,
          hidden_file: 0,
          recycle: 0,
          check_acl: 0,
          node: path
        }),
        method: "POST"
      }
    );
    const body = await resp.json().cast<GetTreeResponseItem[]>();
    return body;
  }

  async download(path: string) {
    const lastSlash = path.lastIndexOf("/");
    const fileName = path.slice(lastSlash + 1);
    const folder = path.slice(0, lastSlash);

    const resp = await fetch(
      `${this.baseUrl}/utilRequest.cgi?func=download&sid=${this.sid}`,
      {
        body: this.toBody({
          isfolder: 0,
          compress: 0,
          source_total: 1,
          offset: 0,
          source_path: folder,
          source_file: fileName
        }),
        method: "POST"
      }
    );

    const body = await resp.arrayBuffer();
    return body;
  }

  private toBody(params: Indexable) {
    const map = [];
    for (const k in params) {
      if (params.hasOwnProperty(k)) {
        map.push(`${k}=${params[k]}`);
      }
    }
    return encodeURI(map.join("&"));
  }
}

interface Indexable {
  [x: string]: any;
}