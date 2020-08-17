import React from "react";
import "./App.css";
import GameCenter from "./components/GameCenter";
import Login from "./components/Login";
import SignUp from './components/SignUp';
import { BrowserRouter, Switch, Route } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      player: null,
      games: [],
    };
  }


  handleLogin = player => {
    player.gameId = 0;
    player.isHuman = true;
    this.setState({
      player: player,
    });
  };

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/gamecenter" render={props => <GameCenter player={this.state.player} />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
