import React, {Component, Fragment, lazy, Suspense} from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./Pages/Login";
import Loading from "./Components/Loading";
import './index.css'

const Home = lazy(() => import('./Pages/Home'));

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/home" component={Home}/>
            <Redirect to="/login"/>
          </Switch>
        </Suspense>
      </Fragment>
    )
  }
}
