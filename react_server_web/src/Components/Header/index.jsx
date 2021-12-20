import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import {
  Avatar,
  Button,
  Dropdown,
  Message,
  PageHeader,
  Notification,
  Menu,
  Trigger,
} from "@arco-design/web-react";
import { IconDown, IconDesktop, IconBug, IconClose, IconCompass } from "@arco-design/web-react/icon";
import "./index.css";

class Header extends Component {
  state = {
    username: null,
    serverInfo: {},
    popupVisible: false,
  };

  componentDidMount() {
    if (!localStorage.getItem("username")) {
      Message.error("Please log in first !");
      this.props.history.replace("./login");
    }

    const username = localStorage.getItem("username");
    const serverInfo = JSON.parse(localStorage.getItem("serverInfo"));

    this.setState({
      username,
      serverInfo,
    });
  }

  logout = () => {
    localStorage.clear();
    Notification.success({
      title: "Success",
      content: "You have successfully logged out !",
    });
    this.props.history.push("/login");
  };

  setPopupVisible = visible => {
    this.setState({
      popupVisible: visible,
    })
  }

  renderMenu = () => {
    const MenuItem = Menu.Item;

    return (
      <Menu
        style={{ marginBottom: -4 }}
        mode="popButton"
        tooltipProps={{ position: "left" }}
        hasCollapseButton
        onClickMenuItem={this.switchRoute}
      >
        <MenuItem key="0"><IconBug className="menu-icon" />Logs</MenuItem>
        <MenuItem key="1"><IconDesktop className="menu-icon" />Devices</MenuItem>
      </Menu>
    );
  };

  switchRoute = key => {
    if (key === '0') {
      this.props.history.push('/home/log');
    }
    if (key === '1') {
      this.props.history.push('/home/device');
    }
  }

  render() {
    const { serverInfo, username, popupVisible } = this.state;
    const dropList = (
      <Button
        className="login-out"
        onClick={this.logout}
        type="outline"
        status="warning"
      >
        Logout
      </Button>
    );

    return (
      <Fragment>
        <PageHeader
          className="header"
          title="分布式数据中心客户端"
          subTitle={
            <Fragment>
              <span>当前服务器：{serverInfo.name}</span>
              <span className="ip-address">
                IP地址：{serverInfo.ip_address}
              </span>
            </Fragment>
          }
          extra={
            <div className="login-info">
              <Avatar>
                <img alt="avatar" src="https://joeschmoe.io/api/v1/random" />
              </Avatar>
              <Dropdown droplist={dropList} position="bl">
                <span className="login-name">
                  {username}
                  <IconDown style={{ marginLeft: "10px" }} />
                </span>
              </Dropdown>
            </div>
          }
        />

        <Trigger
          popup={this.renderMenu}
          trigger={["click", "hover"]}
          clickToClose
          position="top"
          onVisibleChange={this.setPopupVisible}
        >
          <div
            className={`button-trigger ${
              popupVisible ? "button-trigger-active" : ""
            }`}
          >
            {popupVisible ? <IconClose /> : <IconCompass />}
          </div>
        </Trigger>
      </Fragment>
    );
  }
}

export default withRouter(Header);
