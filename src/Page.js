
import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import App from './App';
import globals from './components/unit';

var a = false;
export default class Page extends Component {
  render() {
    return (
      <Router>
        <Switch>
            {globals.getCookies('isLogin') ? <Route exact path="/" render={() => <Redirect to="/erp/home" push />} /> : <Route exact path="/" render={() => <Redirect to="login" push />} />}
            <Route path="/erp" component={App} />
            <Route path="/erp" component={App} />
            <Route path="/404" component={NotFound} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}
