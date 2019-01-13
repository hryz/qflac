import "../shared/extensions";
import React, {Component} from "react";
import {ApiClient} from "../shared/api";
import {Main} from "../components/main/main.component";
import {Login} from "../components/login/login.component";

interface State {
  isLoggedIn: boolean;
}

class App extends Component<{}, State> {
  baseUriDev = "http://192.168.88.253:8080";
  baseUriProd = "http://hryz.myqnapcloud.com:8080";
  api: ApiClient;

  constructor(props: {}) {
    super(props);

    this.api = new ApiClient(this.baseUri());
    this.state = {isLoggedIn: false};
  }

  baseUri = () => window.location.hostname === 'localhost' || window.location.hostname === '192.168.88.253'
    ? this.baseUriDev
    : this.baseUriProd;

  login = (x: boolean) => {
    this.setState({isLoggedIn: x});
  };

  render() {
    return (
      <div>
        {this.state.isLoggedIn
          ? (<Main api={this.api}/>)
          : (<Login api={this.api} login={this.login}/>)}
      </div>
    );
  }
}

export default App;
