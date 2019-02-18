import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {
  TabBar,
  Icon,
  Card,
  SearchBar,
  Switch,
  NavBar,
  Modal
} from 'antd-mobile'
import axios from 'axios'
import AudioPlayer from "react-h5-audio-player"

class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teacherList: [],
      filter: ''
    }

    this.load()
  }

  load = async () => {
    let res = await axios.get('/acad/teacherList')
    this.setState({teacherList: res.data.data})
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

  onUpTeacherChange = async (t) => {
    if (!!t.order) {
      await axios.post('/acad/teacher/up', {TUID: t.TUID})
      this.load()
    }
  }

  onDownTeacherChange = async (t) => {
    if (!!t.order) {
      await axios.post('/acad/teacher/down', {TUID: t.TUID})
      this.load()
    }
  }

  onDeleteTeacher = async (t) => {
    Modal.alert('Delete', 'Are you sure???', [
          { text: 'Cancel'},
          {
            text: 'Ok',
            onPress: async () => {
              await axios.post('/acad/teacher/delete', {TUID: t.TUID})
              this.load()
            }
          },
        ])
  }

  render() {
    return (<div>
      <NavBar mode="light" icon={<Icon type = "left" />} onLeftClick={() => this.props.history.push('/')}>teacherList</NavBar>
      <div style={{
          padding: 12
        }}>
        <SearchBar placeholder="Search" maxLength={8} onChange={this.onSearchChange}/> {
          this.state.teacherList.filter(t => t.FullName.toLowerCase().indexOf(this.state.filter.toLowerCase()) != -1).map(t =>< Card key = {
            t._id
          }
          style = {{marginBottom:12}} > <Card.Header title={['女', '男', '未知'][t.Sex] + ' ' + t.FullName} extra={<span> {
              t.TUID
            }
            </span>}/>
          <Card.Body>
            <AudioPlayer src={t.mp3file} preload='none'/>
            <br/>
            <div>{t.Profile}</div>
          </Card.Body>
          <Card.Footer content={<Switch checked = {
              !!t.order
            }
            onChange = {
              (v) => this.onAddTeacherChange(v, t)
            } />} extra={<div>< a href = '###' style = {{marginRight:20}}onClick = {
              () => this.onDeleteTeacher(t)
            } > Delete</a> < a href = '###' style = {{marginRight:20}}onClick = {
              () => this.onDownTeacherChange(t)
            } > Down</a> < a href = '###' onClick = {
              () => this.onUpTeacherChange(t)
            } > Up</a></div>}/>
        </Card>)
        }
      </div>
    </div>)
  }
}

export default MyComponent
