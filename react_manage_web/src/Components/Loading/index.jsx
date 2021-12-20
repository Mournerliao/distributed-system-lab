import React, {Component} from 'react';
import {Spin} from '@arco-design/web-react';
import './index.css'

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <Spin/>
      </div>
    );
  }
}

export default Loading;