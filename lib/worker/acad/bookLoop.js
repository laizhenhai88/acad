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
    task.status = 'success'
  },
  async success(task, tm) {
    tm.addTask({
      type: 'noop',
      delay: 10 * 1000,
      groups: [
        {
          id: 'bookLoop',
          done: 'acad/bookLoop'
        }
      ]
    })

    await mongo.persist(async (client) => {
      // 找出近7天的订单
      let books = await client.collection('books').find({
        date: {
          $gte: moment().format('YYYY-MM-DD'),
          $lte: moment().add(14, 'd').format('YYYY-MM-DD')
        }
      }).toArray()

      let teachers = await client.collection('teachers').find({
        order: {
          $ne: null
        }
      }).sort({order: -1}).toArray()

      books.forEach(b => {
        tm.addTask({
          type: 'acad/book',
          timeout: 10 * 60 * 1000,
          params: {
            book: b,
            teachers: teachers.map(t => {
              return {TUID: t.TUID, FullName: t.FullName}
            })
          },
          groups: [
            {
              id: 'bookLoop',
              done: 'acad/bookLoop'
            }
          ]
        })
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
  },
  async done(task, tm) {
    tm.addTask({
      type: 'acad/bookLoop',
      delay: 5 * 60 * 1000
    })
  }
};
