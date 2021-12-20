import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Input,
  Message,
  Notification,
  Select,
} from "@arco-design/web-react";
import { IconLocation, IconLock, IconUser } from "@arco-design/web-react/icon";
import Http from "../../Services";
import "./index.css";

class Login extends Component {
  state = {
    serverList: [],
    curState: "Login",
    title: "Login",
    leftButtonText: "Register",
    rightButtonText: "Sign In",
    serverInfo: null,
    username: "",
    password: "",
  };

  async componentDidMount() {
    const res = await Http.getRequest("/get_server_list");
    const serverList = res.data;

    this.setState({
      serverList,
    });
  }

  changeState = () => {
    let { curState } = this.state;
    let title, leftButtonText, rightButtonText;

    if (curState === "Login") {
      curState = "Register";
      title = "Register";
      leftButtonText = "Sign In";
      rightButtonText = "Register";
    } else {
      curState = "Login";
      title = "Login";
      leftButtonText = "Register";
      rightButtonText = "Sign In";
    }

    this.setState({
      curState,
      title,
      leftButtonText,
      rightButtonText,
    });
  };

  usernameInput = (username) => {
    this.setState({
      username,
    });
  };

  passwordInput = (password) => {
    this.setState({
      password,
    });
  };

  selectServer = (name) => {
    const { serverList } = this.state;
    const server = serverList.filter((item) => item.name === name)[0];

    this.setState({
      serverInfo: server,
    });
  };

  clickButton = () => {
    const { curState } = this.state;

    if (!this.checkInfo()) return;

    if (curState === "Login") {
      this.toLogin();
    } else {
      this.toRegister();
    }
  };

  checkInfo = () => {
    const { username, password, serverInfo } = this.state;

    if (username === "" || password === "") {
      Message.warning("Your count or password is empty !");
      return false;
    }

    if (!serverInfo) {
      Message.warning("No server selected !");
      return false;
    }

    return true;
  };

  toLogin = async () => {
    const { username, password, serverInfo } = this.state;
    const params = {
      username,
      password,
    };
    const res = await Http.postRequest("/get_account", params);

    console.log(res);

    if (res.code === 200 && res.data) {
      localStorage.setItem("username", username);
      localStorage.setItem("serverInfo", JSON.stringify(serverInfo));
      Notification.success({
        title: "Success",
        content: "Successfully logged in !",
      });
      this.props.history.push("/home");
    } else {
      Notification.error({ title: "Error", content: "Login failed !" });
    }
  };

  toRegister = async () => {
    const { username, password, serverInfo } = this.state;
    const params = {
      username,
      password,
    };
    const res = await Http.postRequest("/register", params);

    console.log(res);

    if (res.code === 200 && res.data) {
      localStorage.setItem("username", username);
      localStorage.setItem("serverInfo", JSON.stringify(serverInfo));
      Notification.success({
        title: "Success",
        content: "Successfully registered !",
      });
      this.props.history.push("/home");
    } else {
      Notification.error({ title: "Error", content: "Register failed !" });
    }
  };

  render() {
    const { serverList, title, leftButtonText, rightButtonText } = this.state;
    const Option = Select.Option;

    return (
      <div className="login-container">
        <div className="left">
          <div className="enter-image" />
        </div>
        <div className="right">
          <h1 className="login-title">System {title}</h1>
          <Input
            className="input"
            prefix={<IconUser />}
            allowClear
            placeholder="Please Enter your count ..."
            onChange={this.usernameInput}
          />
          <Input.Password
            className="input"
            prefix={<IconLock />}
            allowClear
            placeholder="Please Enter your password ..."
            onChange={this.passwordInput}
          />

          <Select
            className="server-select"
            placeholder="Please select server ..."
            size="large"
            prefix={<IconLocation />}
            // defaultValue={1}
            onChange={this.selectServer}
          >
            {serverList.map((option, index) => (
              <Option key={option.id} value={option.name}>
                {option.name}
              </Option>
            ))}
          </Select>

          <div className="extra-actions">
            <Button onClick={this.changeState} type="text" size="large">
              {leftButtonText}
            </Button>
            <Button onClick={this.clickButton} type="primary" size="large">
              {rightButtonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
