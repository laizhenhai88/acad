const runloop = require('chain-state')
const bb = require('chain-state').bb
const logger = require('laputa-log').createLogger()
const axios = require('axios')
const mongo = require('./lib/mongo')

const doTest = async () => {
  try {
    await mongo.persist(async (client) => {
      let ts = await client.collection('teachers').find({Profile: null}).toArray()
      for (let i = 0; i < ts.length; i++) {
        let res = await axios({
          method: 'POST',
          url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.User.aspx',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
            'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/bookclass.aspx',
            'Host': 'www.acadsoc.com.cn',
            'Origin': 'https://www.acadsoc.com.cn',
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'TUID=' + ts[i].TUID + '&__=GetTutorTableListByTUID'
        })

        if (res.status == 200 && res.data.value.length == 1) {
          await client.collection('teachers').updateOne({
            TUID: ts[i].TUID
          }, {$set: res.data.value[0]})
        }

        console.log(ts[i].FullName)
      }
    })

  } catch (e) {
    console.log(e)
  } finally {
    process.exit(0)
  }
}

doTest()
