const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//將response url 丟進 postman 觀察其object
var data = {
  FromCity: 9,
  FromStation: 1011,
  FromStationName: 0,
  ToCity: 18,
  ToStation: 1319,
  ToStationName: 0,
  TrainClass: 2,
  searchdate: moment().format("YYYY-MM-DD"),
  FromTimeSelect: moment().format("HHmm"),
  ToTimeSelect: moment()
    .add(1, "hours")
    .format("HHmm"),
  Timetype: 1
};

var options = {
  url: "http://twtraffic.tra.gov.tw/twrail/TW_SearchResult.aspx",
  method: "POST",
  form: data
};

//模擬 js 的執行才會有 data，所以我們會使用 jsdom 這個 library 來模擬，並且要加上 {runScripts: "dangerously"} 這個參數，這樣他才會執行裡面的 js。
request(options, (err, res, body) => {
  var dom = new JSDOM(body, { runScripts: "dangerously" });
  console.log(dom.window.JSONData);
});
