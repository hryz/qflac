import React, { Component } from "react";
class App extends Component {
  render() {
    const player = AV.Player.fromBuffer(new ArrayBuffer(8));

    return <div className="App">this is app</div>;
  }
}

export default App;
