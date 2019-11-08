const runloop = require('chain-state')
const bb = require('chain-state').bb
const logger = require('laputa-log').createLogger()
const axios = require('axios')
const mongo = require('./lib/mongo')

const doTest = async () => {
  try {
    let res = await axios({
      method: 'POST',
      url: 'https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.User.aspx?method=GetTutorTableListByTUID&_timestamp=' + new Date().getTime(),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Referer': 'https://www.acadsoc.com.cn/WebNew/user/BookClass/newestbookclass.aspx',
        'Host': 'www.acadsoc.com.cn',
        'Origin': 'https://www.acadsoc.com.cn',
        'X-Requested-With': 'XMLHttpRequest',
        'cookie': 'acw_tc=2466d41b15693107936335485ee1c351bb328c0ee2b228f730d732e6ae; .ASPXANONYMOUS=Qu9JHj2p1QEkAAAAMDE4MWQ5OTYtZDI2ZC00ODQyLTgwODEtZDFlNzEyYjM3NGNhFYaX2tQY3YA5whKjLPl4IcxutP5iHQq5Pow9fPYpOVk1; ASP.NET_SessionId=toe4jym52zxgkhoj3pwinqog; isCRorSE=SE; sajssdk_2015_cross_new_user=1; ABFirst_1=60469573; _ABVID_262=49625496; _ABVGID_1=42278042; _source=FE24EABC1A7111DFE2B468C378A4B892EE8E8BD6D145BCEEEA2C4B5B7ED37E5DF2BBB8AFC0758EBAD82F8A9F3A0048A34136499FB1606EDC2661B36029437AB162D6411CF0870286A55C39D0A9795397C0D1F2F819A3D7C673F8FB4A2BC3CF9E296F0A11B541EE532B2422235DC11082; _Record=0A6542F3639B236AD95A0167141E00E9; Hm_lvt_25ca7a7a3548ecf050f1c765ccb36d0c=1569310797; Hm_lpvt_25ca7a7a3548ecf050f1c765ccb36d0c=1569310797; _9755xjdesxxd_=32; _ABVID_1047=49625521; gdxidpyhxdE=Oz55KJHnD0xl%5CE9Ey%2F1do2w2Q%2F%2Fjkuv7Ki7%2FyDdqzouKIpi6nqIVr%5C82SA1GSs4jqK93PJjSJ7n4b5V2DA0rP%2BMs%5Ct0b%5CBIYuEbRUrCEax46160zqbBt9L1ZbSIsZ%2FUOIIJ%2FTgr%2FMaP%2FuO9Tn%2FjHwdsw%5CbiGH33%2BeOQvLjsX4PkL6LPp%3A1569316593134; _AcadsocMemory=ITfGt43V0w/fhIdJaYa6GtzBDn6SMrU8qQPonPVpiaQLvn0NBLCUes3mEeWtfq1RT0idBSTXuk6HxDd5LcArZjvd8kNMx6EjHYKHwH1wHlKrHKo8CkCBwxzLAOzq0kKIw4qe96imH6MfK0e3vRM6IMSIsNl+Cgv2fboSdlzXg5M=; .web_cookie=4B3D04AAC532E5752529A5C390640B796A2A9C0A583272059F2138573636CE1555ECEF9B2CE8F42360319409F827A2EF5DAC696F4E83446C9E970EF63D4AF0EAA35B5D3F7ABC1727DAB87591C1A040934D35191F1CADEF8B97AF39FF111E1407B5F2ABC1980C9ED3B1670B6A631AAE93B45A07CAF1D3AB9412894086B9DC31BD28519A59F2C78A3F30D149A3C58E7548; _Uid=C0FE7595DD29F4AA; _PhoneMemory=EA9524F7ED21267C3CA28577452C1970; _Automation=ECB26629699314404CBC701E600ED766; UserVersionType=new; UM_distinctid=16d6281f37812-0de6ffd98a9e6-38607506-1fa400-16d6281f3791f6; CNZZDATA1261244036=634770738-1569314343-%7C1569314343; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221617789%22%2C%22%24device_id%22%3A%2216d62366512118-00ec388668fe7d-38607506-2073600-16d6236651387d%22%2C%22props%22%3A%7B%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%2C%22first_id%22%3A%2216d62366512118-00ec388668fe7d-38607506-2073600-16d6236651387d%22%7D; zjDay=1; _u=Web.UI.Fun:IpRecord:LogClientInfo:563047bf-0e22-443d-9926-823185adc768; acs_session_id=9802214f68c94be2a0e387d5d8539cb3; SERVERID=6c753b3b89ff334b6128833f61cc6d04|1569316021|1569315691'
      },
      data: 'TUID=30098&__=GetTutorTableListByTUID'
    })

    if (res.status == 200) {
      // {"TUID":23593,"FullName":"June.A","Sex":1}
      console.log(res.data.value[0].mp3file)
      console.log(JSON.stringify(res.data))
    }

  } catch (e) {
    console.log(e)
  } finally {
    process.exit(0)
  }
}

doTest()
