const request = require('request')
const cheerio = require('cheerio')
function getInfo(url, callback){
  request(url, function(err, res, body){
    var $ = cheerio.load(body)
    var link = url
    var name = $('.profile-header__name').text().trim()
    var title = $('.qa-list__title--ironman').text().trim().replace(' 系列', '')
    var joinDays = $('.qa-list__info--ironman span').eq(0).text().replace(/[^0-9]/g,'')
    var posts = $('.qa-list__info--ironman span').eq(1).text().replace(/[^0-9]/g,'')
    var subscriber = $('.qa-list__info--ironman span').eq(2).text().replace(/[^0-9]/g,'')
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