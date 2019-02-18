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
  'b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s','y','w'
].map(v => {
  return {value: v, label: v}
})

// āáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜüɑńň
// iā iá iǎ ià uō uó uǒ uò uā uá uǎ uà

let ym =
[ 'ā',
  'á',
  'ǎ',
  'à',
  'ō',
  'ó',
  'ǒ',
  'ò',
  'ē',
  'é',
  'ě',
  'è',
  'ī',
  'í',
  'ǐ',
  'ì',
  'ū',
  'ú',
  'ǔ',
  'ù',
  'ǖ',
  'ǘ',
  'ǚ',
  'ǜ',
  'iā',
  'iá',
  'iǎ',
  'ià',
  'uō',
  'uó',
  'uǒ',
  'uò',
  'uā',
  'uá',
  'uǎ',
  'uà' ]

const PY_DATA = N_DATA.map(v=>{return {[v.value]:ym.map(v2=>v.value+v2)}}).reduce((x,y)=>Object.assign(x,y))

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
      n: ['k']
    })
  }

  commit = async () => {
    this.props.form.validateFields(async (error, form) => {
      if (error) {
        Toast.fail('required')
        return
      }

      let n = form.n[0]
      let sm = N_DATA.map(v=>v.value)
      let index = sm.indexOf(n)

      let r1 = PY_DATA[sm[index]]
      this.randomArray(r1)

      let r2 = []
      for (let i=0;i<index;i++){
        PY_DATA[sm[i]].forEach(v=>r2.push(v))
      }
      this.randomArray(r2)

      let r = r1.slice(0,5)
      r2.slice(0,30).forEach(v=>r.push(v))
      r2.forEach(v=>r.push(v))
      this.randomArray(r)
      this.setState({r})
    })
  }

  randomArray(a) {
    for (let i=0;i<a.length;i++) {
      let index = this.random(0, a.length-1)
      let temp = a[i]
      a[i] = a[index]
      a[index] = temp
    }
  }

  random(a, b) {
    return Math.floor(Math.random() * (b -a +1)) + a
  }

  render() {
    const {getFieldProps} = this.props.form
    return (<div>
      <NavBar mode="light" icon={<Icon type = "left" />} onLeftClick={() => this.props.history.push('/')}>pinyin</NavBar>
      <div style={{
          padding: 12
        }}>
        <List className="date-picker-list" style={{
            backgroundColor: 'white'
          }}>
          <Picker data={N_DATA} cols={1} {...getFieldProps('n',{rules:[{required:true}]})}>
            <List.Item arrow="horizontal">声母上限</List.Item>
          </Picker>
        </List>
        <br/>
        <Button type="primary" disabled={this.state.disabled} onClick={this.commit}>生成拼音作业</Button>
        <List renderHeader='result'>
          {
            this.state.r.map(v=><Item extra=''>{v}</Item>)
          }
        </List>
      </div>
    </div>)
  }
}

export default createForm()(MyComponent)
