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

const TIME_DATA = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30'
].map(v => {
  return {value: v, label: v}
})

class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeCount: 2,
      disabled: false
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      date: new Date(),
      time: [['18:00'], ['18:30']]
    })
  }

  commit = async () => {
    this.props.form.validateFields(async (error, book) => {
      if (error) {
        Toast.fail('required')
        return
      }

      this.setState({disabled: true})
      await axios.post('/acad/teacher/book', {
        date: moment(book.date).format('YYYY-MM-DD'),
        time: book.time.map(v => v[0])
      })
      Toast.success('下单成功')
      this.props.history.push('/bookList')
    })
  }

  onAddTime = async () => {
    this.setState({
      timeCount: this.state.timeCount + 1
    })
  }

  onDelTime = async () => {
    if (this.state.timeCount > 1) {
      this.setState({
        timeCount: this.state.timeCount - 1
      })
    }
  }

  render() {
    const {getFieldProps} = this.props.form
    return (<div>
      <NavBar mode="light" icon={<Icon type = "left" />} onLeftClick={() => this.props.history.push('/')}>book</NavBar>
      <div style={{
          padding: 12
        }}>
        <List className="date-picker-list" style={{
            backgroundColor: 'white'
          }}>
          <DatePicker mode="date" title="选择日期" extra="Optional" {...getFieldProps('date',{rules:[{required:true}]})}>
            <List.Item arrow="horizontal">Date</List.Item>
          </DatePicker>

          {
            [...new Array(this.state.timeCount)].map((v, i) => (<Picker key={i} data={TIME_DATA} cols={1} {...getFieldProps('time['+i+']',{rules:[{required:true}]})}>
              <List.Item arrow="horizontal">Time</List.Item>
            </Picker>))
          }
        </List>
        <br/>
        <Button type="default" disabled={this.state.disabled} onClick={this.onAddTime}>+ Add Time</Button>
        <br/>
        <Button type="warning" disabled={this.state.disabled} onClick={this.onDelTime}>- Del Time</Button>
        <br/>
        <Button type="primary" disabled={this.state.disabled} onClick={this.commit}>提交</Button>
      </div>
    </div>)
  }
}

export default createForm()(MyComponent)
