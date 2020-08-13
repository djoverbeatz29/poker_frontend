import React from "react";
import "./App.css";
import GameCenter from "./components/GameCenter";
import Login from "./components/Login";
import SignUp from './components/SignUp'
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
              path="/signup"
              render={(props) => (
                <SignUp {...props} handleLogin={this.handleSignUp} />
              )}
            />
            <Route
              path="/gamecenter"
              render={(props) => (
                <GameCenter {...props} player={this.state.player}/>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
