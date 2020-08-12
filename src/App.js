import React from "react";
import "./App.css";
import GameCenter from "./components/GameCenter";
import Login from "./components/Login";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      player: null,
      games: [],
    };
  }

  handleLogin = (player) => {
    this.setState({
      player: player,
    });
  };

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route
              path="/login"
              render={(props) => (
                <Login {...props} handleLogin={this.handleLogin} />
              )}
            />
            <Route
              path="/home"
              render={(props) => (
                <GameCenter {...props} playerIds={[1, 2, 3, 4, 5]} />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
