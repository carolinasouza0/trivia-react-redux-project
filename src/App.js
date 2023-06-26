import React from 'react';
import './Global.css';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Settings from './components/Settings';
import Game from './pages/Game';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route exact path="/game" component={ Game } />
      <Route exact path="/settings" component={ Settings } />
    </Switch>
  );
}
