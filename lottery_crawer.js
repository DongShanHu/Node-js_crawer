
const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

console.log('有跑這')
getAreas((areas) => {
  getStores(areas, (stores) => {
    console.log('done');
  })
})

function getStores(areas, callback) {
  async.mapSeries(areas, (areaInfo, callback) => {
console.log('抓店家')
    var dataString = Object.keys(areaInfo).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(areaInfo[k])}`).join('&')
    dataString = dataString.replace('%20%20', '++')

    var options = {
      url: 'http://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: dataString,
    }
    request(options, (err, res, body) => {
      var $ = cheerio.load(body)
      var stores = $('.tableD tr').map((index, obj) => {
        return {
          city: $(obj).find('td').eq(0).text(),
          area: $(obj).find('td').eq(1).text(),
          address: $(obj).find('td').eq(2).text(),
          store: $(obj).find('td').eq(3).text(),
        }
      }).get()
      stores.shift()
      callback(null, stores)
    })
  }, (err, results) => {
    console.log(results);
    // 將 results 扁平化，再丟給 callback
    callback([].concat.apply([], results));
  })
}
//，首先先 getAreas，取得 所有鄉鎮市區之後
function getAreas(callback) {
console.log('抓地區')
  // 先建立一個 1-25 的 array 作為 city 代碼
  var cities = Array.from(new Array(25), (val, index) => index + 1);

  async.map(cities, (city, callback) => {
    var options = {
      url: 'http://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx',
      method: 'POST',
      form: {
        __VIEWSTATE: 'HkMORae+at1BMSyoFOwdzFel6DdER06cbECq87abp4Lx7E/U3FeeaA9S4BoZugFxxhqMyunJcz365ZTT+xFTHyiAz8+IHNkT1oOp095JtenP7tiAukf059P3AyOsZ6K1xQ0CGrJAtNEQa+40NTJWD2DS/F/Z1/y6ThRnuwtYA0DpfoW1orko304R+j7hhdWPmHxsPqkdAhV38ehx8/4gNuRhGrTmfxdHlQ5xH28f+zjx9BVIkzckv01h+MQk7vefwZ8+gvsORsQ01AC2WnWtgibdGKNsL/8Iagd3yZcR88kYnv4rRNrxXe19B/NCUnkE0WALu/7k1a5Db3c4SckCCH+k2ZR+TD/ggAzLiJ3FARRgvTQ1D8VvvjqV6JdDtmv4bSe+TglTpYaJKntBM2LZkPDJfmQMeRZs4sQl9e/eVkSQC1yS2yXtR9qMHLMl5cMVrleLElgAnxSZnF1JvN1z/zqilqJWrbl0kgDG2MIXG2g5AgHW9JvumP0VjQ5HFtJQJ7DAOPvYcTtXe0AsE3HIYq9KnQ6graGI2LZswr1YFiRCbCFHp4psZ0C1VYNN9EL3/FyWqblP6W2QCO8+T1zd0OGVs9k+XHhyqb54QFkSO+3pQFmkG2Wq1tyfjVhW7JM+SeA5pw==',
        __EVENTVALIDATION: 'CPIjgGYjXTuCHPbyRWHo9/OoEQWecE0TvF4WVfuCJClTP8MOBMmCeLgJR8cxwpCE1qscgkHCLoTbsJzkG/t81MPENFGGysAIG8pOqPRYQKmhMlVu9VKnQV3j8v+fEsZx13KTMMCMzCz6waZ/PgrTbtYu+LTTN1WLhYn/vdEiZykWHOq4IToTgdYwbP+/5mztxOc2nEVvcpNX85z0Z77lBEHZ8gT2GYreI4iXG1v4saDe9L3v3+5XXO/DsFyl0NlqPR+xr8x7j6vawXbktDCMIOOrSpEqHBF1O1YPjq0H/DnMHs4FZbS5yESfSMqf/TECKTA2G3/ErecOeGuOhnm6SBhuMBV5aYqW+CLS6L0v30iG1qEZic0C53jzFufuwbNlkwXxtZkkrtQDF3HbGCgDD1SgQJoIGCn2GSH9UQw8aaTzmhbqeKx3Obi6AAg5ZzkJbl2R221vcMAEzJLh3VZdXnuRRK1UrmGeDRCPlMR8BFVQxc+Tr2wA/aBQkdPG7zubksCgyN8uhZbyU3xReXeGxFt+Nw+wn0QOaZ1LgF7orrHPkBDs3lMYBMg/3CamnoF00GHzPAaJZROHAIB3Zl+V8GuwB7NwncAzkMT2UBpyXsCQMd9EJkSve7SsdIt47FptqXNR7lbVhNIEbX4LyvkOtwCi6ZF31qtpzThuyano5jPr+hp5',
        DropDownList1: city
      }
    }
    request(options, (err, res, body) => {
      var $ = cheerio.load(body)
      var __VIEWSTATE = $('#__VIEWSTATE').val()
      var __EVENTVALIDATION = $('#__EVENTVALIDATION').val()
      var Button1 = $('#Button1').val()
      var areas = $('#DropDownList2 option').map((index, obj) => {
        return {
          city: city,
          area: $(obj).val(),
          __VIEWSTATE: __VIEWSTATE,
          __VIEWSTATE: __VIEWSTATE,
          __EVENTVALIDATION: __EVENTVALIDATION,
          Button1: Button1,
        }
      }).get()
      callback(null, areas)
    })
  }, (err, results) => {
    // 將 results 扁平化，再丟給 callback
    callback([].concat.apply([], results));
  })
}
