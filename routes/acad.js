const router = require('koa-router')();
const tm = require('../lib/taskManager');
const mongo = require('../lib/mongo');
const conf = require('../conf.json')
const axios = require('axios')

router.get('teacherList', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let res = await client.collection('teachers').find().sort({order: -1}).limit(30).toArray()
    ctx.body = {
      ok: 1,
      message: 'success',
      data: res
    }
  })
})

router.post('teacher/add', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let order = 1000
    let res = await client.collection('teachers').find({
      order: {
        $ne: null
      }
    }).sort({order: 1}).limit(1).toArray()

    if (res.length > 0 && res[0].order) {
      order = res[0].order - 1
    }

    await client.collection('teachers').updateOne({
      TUID: ctx.request.body.TUID
    }, {$set: {
        order
      }})
  })

  ctx.body = {
    ok: 1
  }
});

router.post('teacher/remove', async (ctx, next) => {
  await mongo.persist(async (client) => {
    await client.collection('teachers').updateOne({
      TUID: ctx.request.body.TUID
    }, {
      $set: {
        order: null
      }
    })
  })

  ctx.body = {
    ok: 1
  }
});

router.post('teacher/delete', async (ctx, next) => {
  await mongo.persist(async (client) => {
    await client.collection('teachers').deleteOne({
      TUID: ctx.request.body.TUID
    })
  })

  ctx.body = {
    ok: 1
  }
});

router.post('teacher/up', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let ts = await client.collection('teachers').find({
      order: {
        $ne: null
      }
    }).sort({order: -1}).toArray()
    let index = -1
    ts.find((v, i) => {
      if (v.TUID == ctx.request.body.TUID) {
        index = i
        return true
      }
      return false
    })

    if (index != -1 && index > 0) {
      let temp = ts[index]
      ts[index] = ts[index - 1]
      ts[index - 1] = temp

      for (let i = 0; i < ts.length; i++) {
        await client.collection('teachers').updateOne({
          TUID: ts[i].TUID
        }, {
          $set: {
            order: 1000 - i
          }
        })
      }
    }
  })

  ctx.body = {
    ok: 1
  }
});

router.post('teacher/down', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let ts = await client.collection('teachers').find({
      order: {
        $ne: null
      }
    }).sort({order: -1}).toArray()
    let index = -1
    ts.find((v, i) => {
      if (v.TUID == ctx.request.body.TUID) {
        index = i
        return true
      }
      return false
    })

    if (index != -1 && index != ts.length - 1) {
      let temp = ts[index]
      ts[index] = ts[index + 1]
      ts[index + 1] = temp

      for (let i = 0; i < ts.length; i++) {
        await client.collection('teachers').updateOne({
          TUID: ts[i].TUID
        }, {
          $set: {
            order: 1000 - i
          }
        })
      }
    }
  })

  ctx.body = {
    ok: 1
  }
});

router.post('teacher/book', async (ctx, next) => {
  await mongo.persist(async (client) => {
    await client.collection('books').insertOne({
      ...ctx.request.body,
      logs: ['book time ' + ctx.request.body.time.join(' ')]
    })
  })

  ctx.body = {
    ok: 1
  }
});

router.get('bookList', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let res = await client.collection('books').find().sort({date: -1}).limit(20).toArray()
    ctx.body = {
      ok: 1,
      message: 'success',
      data: res
    }
  })
})

router.post('book/delete', async (ctx, next) => {
  await mongo.persist(async (client) => {
    let b = await client.collection('books').findOne({
      _id: mongo.ObjectID(ctx.request.body._id)
    })
    if (b.teacher && !b.clid) {
      ctx.body = {
        ok: 0,
        message: 'failed'
      }
      return
    }

    if (b.teacher && b.clid) {
      // do cancel
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
        data: 'clid=' + b.clid + '&MethordType=%22WEBCANCEL%22&__=CancelMyClass'
      })

      if (res.status != 200 || res.data.value.code != 'success') {
        ctx.body = {
          ok: 0,
          message: 'failed'
        }
        return
      }
    }

    await client.collection('books').deleteOne({
      _id: mongo.ObjectID(ctx.request.body._id)
    })

    ctx.body = {
      ok: 1,
      message: 'success'
    }
  })
})

module.exports = router;
