const path = require('path');
const fs = require('fs');
const logger = require('laputa-log').createLogger()
const axios = require('axios')
const mongo = require('../../mongo');
const moment = require('moment')

module.exports = {
  // return true the task will be add to manager
  async beforeAddTask(task) {
    return true;
  },
  // set task.status 'success' or 'failed'
  // only task.result will persist to db, even though task failed
  async doTask(task) {
    // 每次random时间去搜索
    // 最近10天，6pm 6:30pm

    // sex 1 男 0 女
    task.result = []

    try {
      let addDay = Math.floor(Math.random() * 10) + 1
      let day = moment().add(addDay, 'd').format('YYYY-MM-DD')

      // 6:00
      let res = await axios({
        method: 'POST',
        url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
          'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/newbookclass.aspx',
          'Host': 'www.acadsoc.com.cn',
          'Origin': 'https://www.acadsoc.com.cn',
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: 'index=0&coid=948584&start=%22' + day + '+18%3A00%22&classtool=7&sex=-1&hascamera=-1&personality=%22%22&teachstyle=%22%22&__=NewGetTutorByTime'
      })

      if (res.status == 200) {
        // {"TUID":23593,"FullName":"June.A","Sex":1}
        res.data.value.AllTeacher.forEach(v => task.result.push(v))
      }

      // 6:30
      res = await axios({
        method: 'POST',
        url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
          'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/newbookclass.aspx',
          'Host': 'www.acadsoc.com.cn',
          'Origin': 'https://www.acadsoc.com.cn',
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: 'index=0&coid=948584&start=%22' + day + '+18%3A30%22&classtool=7&sex=-1&hascamera=-1&personality=%22%22&teachstyle=%22%22&__=NewGetTutorByTime'
      })

      if (res.status == 200) {
        // {"TUID":23593,"FullName":"June.A","Sex":1}
        res.data.value.AllTeacher.forEach(v => task.result.push(v))
      }
    } catch(e) {
      logger.error(e)
    }

    task.status = 'success'
  },
  async success(task, tm) {
    await mongo.persist(async (client) => {
      task.result.forEach((t) => {
        client.collection('teachers').findOneAndUpdate({
          TUID: t.TUID
        }, {
          $set: t
        }, {upsert: true})
      })

      client.collection('teachers').find()
      let teachers = await client.collection('teachers').find({
        mp3file: null
      }).toArray()

      teachers.forEach(teacher => {
        tm.addTask({
          type: 'acad/getTeacherMp3',
          params: {
            TUID: teacher.TUID
          },
          delay: 0
        })
      })
    });

    tm.addTask({
      ...task,
      delay: 60 * 1000
    })
  },
  async failed(task, tm) {
    // 设置重试的次数限制
    let retry = task.retry || 1;
    if (retry >= 3) {
      // failed, do nothing
      // TODO: maybe try later
    } else {
      tm.addTask({
        ...task,
        retry: retry + 1
      });
    }
  }
};
