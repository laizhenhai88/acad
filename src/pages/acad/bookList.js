import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {
  TabBar,
  Icon,
  Card,
  SearchBar,
  Switch,
  NavBar,
  Modal,
  Toast
} from 'antd-mobile'
import axios from 'axios'

class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookList: []
    }

    this.load()
  }

  load = async () => {
    let res = await axios.get('/acad/bookList')
    this.setState({bookList: res.data.data})
  }

  onSearchChange = async (value) => {
    this.setState({filter: value})
  }

  onAddTeacherChange = async (v, t) => {
    // 添加老师，或者删除老师
    if (v) {
      // 添加
      await axios.post('/acad/teacher/add', {TUID: t.TUID})
    } else {
      await axios.post('/acad/teacher/remove', {TUID: t.TUID})
    }

    this.load()
  }

  onDelete = async (b) => {
    if (b.teacher && !b.clid) {
      Toast.fail("can't delete without clid")
      return
    }
    Modal.alert('Delete', 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'default'
      }, {
        text: 'OK',
        onPress: async () => {
          await axios.post('/acad/book/delete', {_id: b._id})
          this.load()
        }
      }
    ])
  }

  render() {
    return (<div>
      <NavBar mode="light" icon={<Icon type = "left" />} onLeftClick={() => this.props.history.push('/')}>bookList</NavBar>
      <div style={{
          padding: 12
        }}>
        {
          this.state.bookList.map(t =>< Card key = {
            t._id
          }
          style = {{marginBottom:12}} > <Card.Header thumb={t.teacher
              ? <Icon style={{
                    color: 'green',
                    marginRight: 12
                  }} type="check-circle"/>
              : <Icon style={{
                  color: 'gray',
                  marginRight: 12
                }} type="loading"/>} title={t.date} extra={<span> {
              t.teacher
                ? t.teacher.FullName + ' at ' + t.bookedTime
                : null
            }</span>}/>
          <Card.Body>
            <div>{
                t.logs
                  ? t.logs.map((v, i) =>< div key = {
                    i
                  } > {
                    v
                  }</div>)
                  : null
              }</div>
          </Card.Body>
          <Card.Footer content='' extra={<div> < a href = '###' onClick = {
              () => this.onDelete(t)
            } > Delete</a></div>}/>
        </Card>)
        }
      </div>
    </div>)
  }
}

export default MyComponent
