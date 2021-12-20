import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Button, Input, Message, Notification} from '@arco-design/web-react';
import {IconLock, IconUser} from '@arco-design/web-react/icon';
import Http from '../../Services'
import './index.css'

class Login extends Component {
  state = {
    curState: 'Login',
    title: 'Login',
    leftButtonText: 'Register',
    rightButtonText: 'Sign In',
    username: '',
    password: '',
  }

  componentDidMount() {
    if(localStorage.getItem('username'))
      this.props.history.push('/home');
  }

  changeState = () => {
    let {curState} = this.state;
    let title, leftButtonText, rightButtonText;

    if (curState === 'Login') {
      curState = 'Register';
      title = 'Register';
      leftButtonText = 'Sign In';
      rightButtonText = 'Register';
    } else {
      curState = 'Login';
      title = 'Login';
      leftButtonText = 'Register';
      rightButtonText = 'Sign In';
    }

    this.setState({
      curState,
      title,
      leftButtonText,
      rightButtonText,
    })
  }

  usernameInput = username => {
    this.setState({
      username,
    })
  }

  passwordInput = password => {
    this.setState({
      password,
    })
  }

  clickButton = () => {
    const {curState} = this.state;

    if (!this.checkInfo())
      return;

    if (curState === 'Login') {
      this.toLogin();
    } else {
      this.toRegister();
    }
  }

  checkInfo = () => {
    const {username, password} = this.state;

    if (username === '' || password === '') {
      Message.warning('Your username or password is empty !')
      return false;
    }

    return true;
  }

  toLogin = async () => {
    const {username, password} = this.state;
    const params = {
      userName: username,
      userPassword: password,
    }
    const res = await Http.postRequest('/webManage/login', params);

    console.log(res);

    if (res.code === 200 && res.data) {
      localStorage.setItem('username', username);
      Notification.success({title: 'Success', content: 'Successfully logged in !'});
      this.props.history.push('/home');
    } else {
      Notification.error({title: 'Error', content: 'Login failed !'});
    }
  }

  toRegister = async () => {
    const {username, password} = this.state;
    const params = {
      userName: username,
      userPassword: password,
      userRePassword: password,
    }
    const res = await Http.postRequest('/webManage/register', params);

    console.log(res);

    if (res.code === 200 && res.data) {
      localStorage.setItem('username', username);
      Notification.success({title: 'Success', content: 'Successfully registered !'});
      this.props.history.push('/home');
    } else {
      Notification.error({title: 'Error', content: 'Register failed !'});
    }
  }

  render() {
    const {title, leftButtonText, rightButtonText} = this.state;

    return (
      <div className="login-container">
        <div className="left">
          <div className="enter-image"/>
        </div>
        <div className="right">
          <h1 className="login-title">System {title}</h1>
          <Input
            className="input"
            prefix={<IconUser/>}
            allowClear
            placeholder='Please Enter your count ...'
            onChange={this.usernameInput}
          />
          <Input.Password
            className="input"
            prefix={<IconLock/>}
            allowClear
            placeholder='Please Enter your password ...'
            onChange={this.passwordInput}
          />
          <div className="extra-actions">
            <Button onClick={this.changeState} type='text' size="large">
              {leftButtonText}
            </Button>
            <Button onClick={this.clickButton} type='primary' size="large">
              {rightButtonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);