import "../shared/extensions";
import React, {Component} from "react";
import {ApiClient} from "../shared/api";
import {Main} from "../components/main/main.component";
import {Login} from "../components/login/login.component";

interface State {
  isLoggedIn: boolean;
}

class App extends Component<{}, State> {
  baseUri = "http://192.168.88.253:8080";
  // baseUri = "http://hryz.myqnapcloud.com:8080";
  api: ApiClient;

  constructor() {
    super({});

    this.api = new ApiClient(this.baseUri);
    this.state = {isLoggedIn: false};
  }

  login = async (x: boolean) => {
    this.setState({isLoggedIn: x});
  };

  render() {
    if (this.state.isLoggedIn) {
      return <Main api={this.api}/>;
    } else {
      return <Login api={this.api} login={this.login}/>;
    }
  }
}

export default App;
