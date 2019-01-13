import * as React from "react";
import {ApiClient} from "../../shared/api";
import './login.css'

interface Props {
  api: ApiClient;
  login: (x: boolean) => void;
}

interface State {
  message: string;
  userName: string;
  password: string;
}

export class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {message: "", userName: "", password: ""};
  }

  setUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      userName: e.target.value
    });
  };

  setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      password: e.target.value
    });
  };

  logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await this.props.api.login(
      this.state.userName,
      this.state.password
    );
    const message = result ? "" : "Login failed";
    this.setState({...this.state, message});
    this.props.login(result);
  };

  public render() {
    return (
      <form className="LoginForm" onSubmit={this.logIn}>
        <div>
          <div>
            <label htmlFor="login">Login</label>
            <input type="text" id="login" onChange={this.setUserName}/>
          </div>
          <div>
            <label htmlFor="pwd">Password</label>
            <input type="password" id="pwd" onChange={this.setPassword}/>
          </div>
          <button type="submit">Log in</button>
        </div>
        {this.state.message}
      </form>
    );
  }
}
