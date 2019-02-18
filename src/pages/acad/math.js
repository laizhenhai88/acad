import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {
  TabBar,
  Icon,
  Card,
  SearchBar,
  DatePicker,
  List,
  Button,
  Toast,
  NavBar,
  Picker
} from 'antd-mobile'
import axios from 'axios'
import moment from 'moment'
import {createForm} from 'rc-form'

const Item = List.Item

const N_DATA = [
  7,8,9,10,11,12,13,14,15,16,17,18,19,20
].map(v => {
  return {value: v, label: v}
})

class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      r: []
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      n: [8]
    })
  }

  commit = async () => {
    this.props.form.validateFields(async (error, form) => {
      if (error) {
        Toast.fail('required')
        return
      }

      let n = form.n[0]
      let r = []
      for (let i=0;i<10;i++){
        if (this.random(1, 2) == 1) {
          // plus
          while(true) {
            let a = this.random(1, n-1)
            let b = this.random(Math.max(1, n-a-4), n-a)
            let c = {
              calc: a + ' + ' + b + ' =',
              result: a+b
            }
            if (!r.find(v=>v.calc==c.calc)) {
              r.push(c)
              break;
            }
          }
        } else {
          // minus
          while(true) {
            let a = this.random(n-4, n)
            let b = this.random(2, a-1)
            let c = {
              calc: a + ' - ' + b + ' =',
              result: a-b
            }
            if (!r.find(v=>v.calc==c.calc)) {
              r.push(c)
              break;
            }
          }
        }
      }

      this.setState({r})
    })
  }

  random(a, b) {
    return Math.floor(Math.random() * (b -a +1)) + a
  }

  render() {
    const {getFieldProps} = this.props.form
    return (<div>
      <NavBar mode="light" icon={<Icon type = "left" />} onLeftClick={() => this.props.history.push('/')}>math</NavBar>
      <div style={{
          padding: 12
        }}>
        <List className="date-picker-list" style={{
            backgroundColor: 'white'
          }}>
          <Picker data={N_DATA} cols={1} {...getFieldProps('n',{rules:[{required:true}]})}>
            <List.Item arrow="horizontal">N 以内</List.Item>
          </Picker>
        </List>
        <br/>
        <Button type="primary" disabled={this.state.disabled} onClick={this.commit}>生成算数作业</Button>
        <List renderHeader='result'>
          {
            this.state.r.map(v=><Item extra={v.result}>{v.calc}</Item>)
          }
        </List>
      </div>
    </div>)
  }
}

export default createForm()(MyComponent)
