import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom'
import {Avatar, Button, Dropdown, Notification, PageHeader} from '@arco-design/web-react';
import {IconDown} from '@arco-design/web-react/icon';
import './index.css'

class Header extends Component {
  state = {
    username: '',
  }

  componentDidMount() {
    this.setState({
      username: localStorage.getItem('username'),
    })
  }

  logout = () => {
    localStorage.clear();
    Notification.success({title: 'Success', content: 'You have successfully logged out !'})
    this.props.history.push('/login');
  }

  render() {
    const {username} = this.state;
    const dropList = (
      <Button className="login-out" onClick={this.logout} type='outline' status='warning'>Logout</Button>
    );

    return (
      <Fragment>
        <PageHeader
          title='分布式数据中心后台管理客户端'
          // subTitle={`当前服务器：${serverName}`}
          extra={
            <div className="login-info">
              <Avatar>
                <img alt='avatar' src='https://joeschmoe.io/api/v1/random'/>
              </Avatar>
              <Dropdown droplist={dropList} position='bl'>
                <span className="login-name">{username}<IconDown style={{marginLeft: '10px'}}/></span>
              </Dropdown>
            </div>
          }
        />
      </Fragment>
    );
  }
}

export default withRouter(Header);