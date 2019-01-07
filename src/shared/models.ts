export interface LoginResponse {
  status: 1 ;
  sid: string;
  servername: string;
  username: string;
  authSid: string;
  cuid: string;
}

export interface LoginError {
  status: 0;
}

export interface LogoutResponse {
  version: string;
  build: string;
  status: number;
  success: string;
}

export interface GetListResponse {
  status: undefined;
  total: number;
  real_total: number;
  datas: GetListData[];
}

export interface GetListData {
  filename: string;
  isfolder: number;
  filetype: number;
  mt: string;
  epochmt: number;
}

export interface GetTreeResponseItem {
  id: string;
  text: string;
  max_item_limit: number;
  real_total: number;
  status: undefined;
}

export interface ErrorResponse {
  status: number;
}