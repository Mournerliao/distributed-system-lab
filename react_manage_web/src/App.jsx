import React, {Component, Fragment} from 'react';
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import {Redirect, Route, Switch} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/home" component={Home}/>
          <Redirect to="/login"/>
        </Switch>
      </Fragment>
    );
  }
}

export default App;