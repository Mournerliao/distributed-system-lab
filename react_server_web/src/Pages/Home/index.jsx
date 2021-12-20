import React, { Component, Fragment, lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "../../Components/Header";
import Device from "./Device";
import Loading from "../../Components/Loading";
import "./index.css";

const Log = lazy(() => import("./Log"));

export default class Home extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <div className="home-container">
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/home/device" component={Device} />
              <Route path="/home/log" component={Log} />
              <Redirect to="/home/device" />
            </Switch>
          </Suspense>
        </div>
      </Fragment>
    );
  }
}
