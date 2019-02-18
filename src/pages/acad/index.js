import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Grid} from 'antd-mobile'

class MyComponent extends Component {

  constructor(props) {
    super(props);
  }

  onClick = async (v) => {
    this.props.history.push('/' + v.text)
  }

  render() {
    let data = [
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'teacherList'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'bookList'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'book'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'teacherList'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'bookList'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'book'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: '---'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'math'
      }, {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
        text: 'pinyin'
      }
    ]
    return (<Grid data={data} columnNum={3} itemStyle={{
        height: '150px',
        background: 'rgba(0,0,0,.05)'
      }} onClick={this.onClick}/>)
  }
}

export default MyComponent
