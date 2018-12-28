const request = require('request');
const cheerio = require('cheerio');

//request 可以用來取得整個頁面的 HTML，
//cheerio 則是用來從 HTML 中擷取我們要的資料



///crontab 來設定每五分鐘 trigger 一次，同時加上 email server 來達到主動通知寄信
const CrontabPeriod = 60 * 5 // 五分鐘抓一次


//直接用 request 來抓取 code_job 版，然後再把文章 list 抓出來
request('https://www.ptt.cc/bbs/CodeJob/index.html', (err, res, body) => {
  var $ = cheerio.load(body)

  // 抓取文章列表
  var list = $('.r-ent a').map((index, obj) => {
    return {
      title: $(obj).text(),
      link: $(obj).attr('href'),
      timestamp: $(obj).attr('href').substr(15, 10),
    }
  }).get()

  // filter 時間
  list = list.filter((post)=>{
    return post.timestamp > (Date.now() / 1000 - CrontabPeriod)
  })

  console.log(list);
})
