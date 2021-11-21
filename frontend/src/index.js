import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './Home';
import Book from './Book';
import Login from './Login';
import SignIn from './SignIn';
import User from './User';
import Search from './Search';
import Write from './Write';
import 'antd/dist/antd.css';
import './style.css';

ReactDOM.render((
  <Router>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/sign_in">
        <SignIn />
      </Route>
      <Route path="/book">
        <Book />
      </Route>
      <Route path="/user">
        <User />
      </Route>
      <Route path="/write">
        <Write />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
), document.getElementById('root'))
