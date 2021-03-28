import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";

import {Notfound} from "./components/notfound/notfound";
import {Auth} from "./components/auth/auth";
import Admin from "./components/admin/admin";
import User from "./components/user/user";
// const Admin = require('./components/admin/admin')
// const User = require('./components/user/user')

const SET = require("./redux/actions");
const redux = require('redux');
const Provider = require('react-redux').Provider;
const reducer = require('./redux/reducers');
const store = redux.createStore(reducer);

store.dispatch({
  type: SET,
  state: {
    users: null,
    settings: null,
    shares: null
  }
})

class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={Auth}/>
              <Route path='/admin' component={Admin}/>
              <Route path='/user' component={User}/>
              <Route component={Notfound}/>
            </Switch>
          </BrowserRouter>
        </Provider>
    )
  }
}

export default App;
