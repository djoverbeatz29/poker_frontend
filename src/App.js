import React from 'react';
import './App.css';
import GameCenter from './components/GameCenter';
import Login from './components/Login';
import {BrowserRouter, Switch, Route} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/home'>
            <GameCenter playerIds={[1,2,3,4,5]} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
