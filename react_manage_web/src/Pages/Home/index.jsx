import React, {Component, Fragment} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import PubSub from 'pubsub-js'
import {customAlphabet} from 'nanoid'
import Nav from "../../Components/Nav";
import Header from "../../Components/Header";
import Dashboard from "./Dashboard";
import List from "./List"
import Log from "./Log";
import './index.css'

class Home extends Component {
  componentDidMount(){
    this.wsWithManage();
  }

  wsWithManage = () => {
    const nanoid = customAlphabet('1234567890', 5)
    const ws = new WebSocket(`ws://192.168.1.108:9002/webManage/online/${nanoid()}`);

    ws.addEventListener('open', function open() {
      console.log('message: 已与manage成功建立WebSocket连接！')
    });

    ws.addEventListener('message', function message(event) {
      console.log(event.data);
      PubSub.publish('wsMessage', JSON.parse(event.data));
    });

    ws.addEventListener('close', function close() {
      console.log('error: 与manage之间的连接已断开！');
    })
  }

  render() {
    return (
      <Fragment>
        <div className="home-container">
          <Nav/>
          <div className="body-container">
            <Header/>
            <div className="content-container">
              <Switch>
                <Route path="/home/dashboard" component={Dashboard}/>
                <Route path="/home/server_list" component={List}/>
                <Route path="/home/log" component={Log}/>
                <Redirect to="/home/dashboard"/>
              </Switch>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Home;