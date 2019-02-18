import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import './Acad.css'
import Home from './pages/acad/index.js'
import TeacherList from './pages/acad/teacherList.js'
import Book from './pages/acad/book.js'
import BookList from './pages/acad/bookList.js'

import MathPage from './pages/acad/math.js'
import Pinyin from './pages/acad/pinyin.js'

class Acad extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<Router ref={(router) => {
        this.router = router;
      }}>
      <Switch>
        <Route exact={true} path="/" component={Home}/>
        <Route exact={true} path="/teacherList" component={TeacherList}/>
        <Route exact={true} path="/book" component={Book}/>
        <Route exact={true} path="/bookList" component={BookList}/>
        <Route exact={true} path="/math" component={MathPage}/>
        <Route exact={true} path="/pinyin" component={Pinyin}/>
      </Switch>
    </Router>)
  }
}

export default Acad
