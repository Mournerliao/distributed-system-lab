import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Menu, Message} from '@arco-design/web-react';
import {IconFile, IconHome, IconStorage} from '@arco-design/web-react/icon';
import './index.css'

class Nav extends Component {
  state = {
    selectedMenuItem: '0',
  }

  componentDidMount() {
    if (!localStorage.getItem('username')) {
      Message.error('Please log in first !');
      this.props.history.replace('/login');
    }

    this.selectMenuItem();
  }

  selectMenuItem = () => {
    const path = this.props.location.pathname.split('/').filter(item => item !== '')[1];
    console.log(path)

    if (path === 'dashboard') {
      this.setState({selectedMenuItem: '0'});
    }
    if (path === 'server_list') {
      this.setState({selectedMenuItem: '1'});
    }
    if (path === 'log') {
      this.setState({selectedMenuItem: '2'});
    }
  }

  switchRoute = key => {
    if (key === '0') {
      this.setState({selectedMenuItem: '0'});
      this.props.history.push('/home/dashboard');
    }
    if (key === '1') {
      this.setState({selectedMenuItem: '1'});
      this.props.history.push('/home/server_list');
    }
    if (key === '2') {
      this.setState({selectedMenuItem: '2'});
      this.props.history.push('/home/log');
    }
  }

  render() {
    const MenuItem = Menu.Item;
    const {selectedMenuItem} = this.state;

    return (
      <div className="nav-container">
        <Menu
          className="nav-menu"
          style={{width: 250}}
          hasCollapseButton
          selectedKeys={[selectedMenuItem]}
          accordion
          autoOpen
          onClickMenuItem={this.switchRoute}
        >
          <MenuItem key='0'><IconHome/>系统主页</MenuItem>
          <MenuItem key='1'><IconStorage/>数据中心状态</MenuItem>
          <MenuItem key='2'><IconFile/>活动日志</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withRouter(Nav);