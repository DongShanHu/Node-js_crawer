const request = require('request')
const cheerio = require('cheerio')
const async = require('async')

getAreas((areas) => {
  getStores(areas, (stores) => {
    console.log('done');
  })
})

function getStores(areas, callback) {
  async.mapSeries(areas, (areaInfo, callback) => {

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

function getAreas(callback) {

  // 先建立一個 1-25 的 array 作為 city 代碼
  var cities = Array.from(new Array(25), (val, index) => index + 1);

  async.map(cities, (city, callback) => {
    var options = {
      url: 'http://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx',
      method: 'POST',
      form: {
        __VIEWSTATE: '/wEPDwUJNzkzNTQ1MDA0D2QWAgIBD2QWBgIDDxBkEBUXD+iri+mBuOaTh+e4o+W4ggnlj7DljJfluIIJ6auY6ZuE5biCCeaWsOWMl+W4ggnlrpzomK3nuKMJ5qGD5ZyS5biCCeaWsOeruee4ownoi5fmoJfnuKMJ5b2w5YyW57ijCeWNl+aKlee4ownpm7LmnpfnuKMJ5ZiJ576p57ijCeWxj+adsee4ownlj7DmnbHnuKMJ6Iqx6JOu57ijCea+jua5lue4ownln7rpmobluIIJ5paw56u55biCCeWPsOS4reW4ggnlmInnvqnluIIJ5Y+w5Y2X5biCCemHkemWgOe4ownpgKPmsZ/nuKMVFwEwATEBMgEzATQBNQE2ATcBOQIxMAIxMQIxMgIxNQIxNgIxNwIxOAIxOQIyMAIyMQIyMgIyMwIyNAIyNRQrAxdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZxYBZmQCBQ8QZA8WAWYWARAFEuiri+WFiOmBuOaTh+e4o+W4ggUBMGdkZAIJDxYCHgRUZXh0ZWRk7OMyo+rJ/R1KANTviXoPJPkndR0NsYC1LwiYNtiju6s=',
        __EVENTVALIDATION: '/wEdABvTQvp4f+icOnK0DqytTtX9GJFKGrixhNRIBkKHiTebmJdHjsaBD0tCA6n9BB0cd7/SuQcSL6aQDg9Xs0L9/OBOSLETwEpIPSGV/A3bSuaAq8txQ6H1pf/4yb6ee6XiSSrgaVU5g0VVgJ5Xw9CH21cr36wwFXY2y6HKS1iL/nz+DDAHNXrk/vTky92TeS8ewGxkOSICh45RRzPxQ2bOKdPZ9TMJgR6J0q0FSJhqpjArpYdDzKZ8fTpfS2upIzElKx9bOnQFKnqDLVt2LS60TXk3u+nrqeNztF0KTWk34Ojx+jt3L4XPmsr8zaHgPBUz8pz7zOH2Pa0Mz/p4CmWFOAIg2fQR55pz9djUgYpzP4S2sWILB2nYss/6vQyjOHLvdkLarj4gGBBx2fNmqMNazPxdO3eEsM9YImABtx30At0gB3zJH8aWmeVGgbN57epKFZK/0kflOYpV0ABwrxcGpmVNHTe/qwnS0Vxfgwc2Iwb7sKhxAQig1Wxc0udiyyKR9F0VLn1n0gyzxgAosISrlV2haCFZhaURDecAdKwOW58JS834O/GfAV4V4n0wgFZHr3etOZ1vOVspvi/jeFVo5fpgRuvTJkzux3zGT3OyLhvV9A==',
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