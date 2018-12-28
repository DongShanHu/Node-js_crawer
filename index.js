const request = require('request')
const async = require('async')
const cheerio = require('cheerio')

//各參賽網站
const ironmans = [
  'https://ithelp.ithome.com.tw/users/20107159/ironman/1325',
  'https://ithelp.ithome.com.tw/users/20107356/ironman/1315',
  'https://ithelp.ithome.com.tw/users/20107440/ironman/1355',
  'https://ithelp.ithome.com.tw/users/20107334/ironman/1335',
  'https://ithelp.ithome.com.tw/users/20107329/ironman/1286',
  'https://ithelp.ithome.com.tw/users/20091297/ironman/1330',
  'https://ithelp.ithome.com.tw/users/20075633/ironman/1375',
  'https://ithelp.ithome.com.tw/users/20107247/ironman/1312',
  'https://ithelp.ithome.com.tw/users/20107335/ironman/1337',
  'https://ithelp.ithome.com.tw/users/20106699/ironman/1283',
  'https://ithelp.ithome.com.tw/users/20107420/ironman/1381',
]
//取得主題內容
async.map( ironmans, getInfo, (err, results)=>{
  console.log(results);
})

function getInfo(url, callback){
  request(url, function(err, res, body){

    /// cheerio 來模擬 jQuery 的選擇器去選取我們要抓的資料，最後將拿到的資訊傳到 callback 裡面，那麼 getInfo function 就完成了。
    var $ = cheerio.load(body)
    var link = url
    //選手名稱
    var name = $('.profile-header__name').text().trim()
    //參賽主題
    var title = $('.qa-list__title--ironman').text().trim().replace(' 系列', '')
    //參賽天數
    var joinDays = $('.qa-list__info--ironman span').eq(0).text().replace(/[^0-9]/g,'')
    //參賽文章數
    var posts = $('.qa-list__info--ironman span').eq(1).text().replace(/[^0-9]/g,'')
    //追蹤人數
    var subscriber = $('.qa-list__info--ironman span').eq(2).text().replace(/[^0-9]/g,'')

    //文章列表的部分看起來會需要一個 loop 來抓取 class 為 qa-list profile-list ir-profile-list 
    //的物件們，然後每個再去抓他們各自的文章相關資訊
    var postList = $('.qa-list').map((index, obj) => {
      return {
        title: $(obj).find('.qa-list__title').text().trim(),
        like: $(obj).find('.qa-condition__count').eq(0).text().trim(),
        comment: $(obj).find('.qa-condition__count').eq(1).text().trim(),
        view: $(obj).find('.qa-condition__count').eq(2).text().trim(),
        date: $(obj).find('.qa-list__info-time').text().trim(),
        url: $(obj).find('.qa-list__title a').attr('href').trim(),
      }
    }).get()
    
    callback(null, {
      name, title, link, joinDays, posts, subscriber, postList
    });
  })
}