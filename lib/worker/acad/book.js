const path = require('path');
const fs = require('fs');
const logger = require('laputa-log').createLogger()
const axios = require('axios')
const mongo = require('../../mongo');
const moment = require('moment')

const getFirstValidTimeTeacher = async (task) => {
  logger.info('start check teacher valid time')
  for (let i in task.params.teachers) {
    let t = task.params.teachers[i]
    if (task.params.book.teacher && t.TUID == task.params.book.teacher.TUID) {
      logger.info('reach the exist teacher ' + t.FullName)
      return null
    }

    let res = await axios({
      method: 'POST',
      url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/bookclass.aspx',
        'Host': 'www.acadsoc.com.cn',
        'Origin': 'https://www.acadsoc.com.cn',
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: 'TUID=' + t.TUID + '&TargetTime=%22' + task.params.book.date + '%22&COID=948584&__=GetTargetTimeAvaDuration'
    })

    if (res.status == 200) {
      for (let j in task.params.book.time) {
        let time = task.params.book.time[j]
        if (res.data.value[moment(task.params.book.date + ' ' + time + ':00').format('YYYY/M/DTHH:mm')]) {
          logger.info('got teacher ' + t.FullName + ' at ' + time + ' rank ' + i)
          return {teacher: t, time}
        }
      }
    }
  }

  logger.info('no teacher got valid time')
  return null
}

const bookTeacher = async (task, teacher, time) => {
  logger.info('start book teacher ' + teacher.FullName + ' at ' + task.params.book.date + ' ' + time)
  let res = await axios({
    method: 'POST',
    url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/bookclass.aspx',
      'Host': 'www.acadsoc.com.cn',
      'Origin': 'https://www.acadsoc.com.cn',
      'X-Requested-With': 'XMLHttpRequest'
    },
    data: 'TUID=' + teacher.TUID + '&bookingWay=3&COID=948584&UID=1617789&targetTime=%22' + task.params.book.date + '+' + time.replace(':', '%3A') + '%22&classtool=7&isNew=0&teacherPers=%22%22&teacherStyle=%22%22&__=AppointClass'
  })

  if (res.status == 200) {
    logger.info('book result ' + res.data.value.result)
    if (res.data.value.result) {
      task.result.teacher = teacher
      task.result.bookedTime = time
      task.result.clid = null
      task.result.log.push('book ' + teacher.FullName)
    }
  }
}

const loadBookedId = async (task) => {
  logger.info('start load class id at ' + task.params.book.date + ' ' + task.params.book.bookedTime)
  let res = await axios({
    method: 'POST',
    url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.User.aspx',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/mylessons.aspx',
      'Host': 'www.acadsoc.com.cn',
      'Origin': 'https://www.acadsoc.com.cn',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': '.web_cookie=37D361D0E48CA8407AD5EB1F141DE9CA7A12FC2AADD39584B6760640102584BBA975B58CBE7983E3D8CF8CB57CEC211DADC07CC7218D7A9099B274B01CE51EE84FDB9119142D0B795628A3E475BE87E61F157E99D4D2CEE9BAF5B551800F3673A4BA4F6B2678211AF5324C0EC6D2F8984844BBC836A0E31945DDAD2457F3A7864B79B18CE9D62364C1D22115D7EFDE75'
    },
    data: 'COID=948584&start=%22' + task.params.book.date + '+00%3A00%22&__=GetStudentLessonsByTime'
  })

  if (res.status == 200) {
    if (res.data.value) {
      res.data.value.forEach(v => {
        if (v.start == task.params.book.date + ' ' + task.params.book.bookedTime) {
          task.result.clid = v.id
          task.result.log.push('load clid ' + v.id)
          logger.info('load class id success at ' + task.params.book.date + ' ' + task.params.book.bookedTime)
        }
      })
    } else {
      logger.info('no class at ' + task.params.book.date + ' ' + task.params.book.bookedTime)
    }
  }
}

const cancelBook = async (task) => {
  logger.info('start cancel at ' + task.params.book.date + ' ' + task.params.book.bookedTime)
  let res = await axios({
    method: 'POST',
    url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/mylessons.aspx',
      'Host': 'www.acadsoc.com.cn',
      'Origin': 'https://www.acadsoc.com.cn',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': '.web_cookie=37D361D0E48CA8407AD5EB1F141DE9CA7A12FC2AADD39584B6760640102584BBA975B58CBE7983E3D8CF8CB57CEC211DADC07CC7218D7A9099B274B01CE51EE84FDB9119142D0B795628A3E475BE87E61F157E99D4D2CEE9BAF5B551800F3673A4BA4F6B2678211AF5324C0EC6D2F8984844BBC836A0E31945DDAD2457F3A7864B79B18CE9D62364C1D22115D7EFDE75'
    },
    data: 'clid=' + task.params.book.clid + '&MethordType=%22WEBCANCEL%22&__=CancelMyClass'
  })

  if (res.status == 200) {
    if (res.data.value.code == 'success') {
      task.result.teacher = null
      task.result.bookedTime = null
      task.result.clid = null
      task.result.log.push('cancel clid ' + task.params.book.clid)
      logger.info('cancel success at ' + task.params.book.date + ' ' + task.params.book.bookedTime)
    } else {
      logger.info('cancel failed at ' + task.params.book.date + ' ' + task.params.book.bookedTime)
    }
  }
}

module.exports = {
  // return true the task will be add to manager
  async beforeAddTask(task) {
    return true;
  },
  // set task.status 'success' or 'failed'
  // only task.result will persist to db, even though task failed
  async doTask(task) {
    try {
      task.result = {
        log: []
      }
      // 订单是否过期，上课开始前5h
      logger.info(`got book ${task.params.book.date} ${task.params.book.time}`)
      let valid = moment(task.params.book.date + ' ' + task.params.book.time.sort()[0] + ':00').subtract(5, 'hours').isAfter(moment(new Date()))
      logger.info('book valid is ' + valid)

      // 已经预定的老师
      let bookedTeacher = task.params.book.teacher
      if (!bookedTeacher) {
        // state 没有预定老师 - 按顺序刷老师时间
        let vt = await getFirstValidTimeTeacher(task)
        if (vt) {
          await bookTeacher(task, vt.teacher, vt.time)
        }
      } else if (bookedTeacher && !task.params.book.clid) {
        // state 已经预定老师，但是没有订单号 - 刷订单号
        // await loadBookedId(task)
      } else if (bookedTeacher && task.params.book.clid) {
        // state 已经预定老师，有订单号 - 按顺序刷老师时间
        let vt = await getFirstValidTimeTeacher(task)
        if (vt) {
          await cancelBook(task)
          await bookTeacher(task, vt.teacher, vt.time)
        }
      }

      task.status = 'success'
    } catch (e) {
      task.status = 'failed'
      task.result = null
    }
  },
  async success(task, tm) {
    await mongo.persist(async (client) => {
      await client.collection('books').findOneAndUpdate({
        _id: mongo.ObjectID(task.params.book._id)
      }, {
        $set: task.result,
        $push: {
          logs: {
            $each: task.result.log
          }
        }
      })
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
