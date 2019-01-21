const request = require("request");
const cheerio = require("cheerio");
// 取得七天的賣出價格，使用 filter 去取出條件為「本行賣出」和七天內的資料。然後再去取得最這七天的最低匯率點，若是等於今天的匯率點，那麼 gotoBackRightNow 就等於 true，反之等於 false。
getJpn(body => {
  var $ = cheerio.load(body);
  var rate = $(".rate-content-cash.text-right.print_table-cell")
    .filter(index => {
      return index % 2 && index < 14;
    })
    .map((index, obj) => {
      return $(obj).text();
    })
    .get();

  var lowest = Math.min(...rate);
  var gotoBackRightNow = lowest == rate[0] ? true : false;
  console.log(gotoBackRightNow);
});

// 發送 get request 並且將結果丟給 callback。
function getJpn(callback) {
  request("http://rate.bot.com.tw/xrt/quote/ltm/JPY", (err, res, body) => {
    callback(body);
  });
}
