const request = require("request");
const moment = require("moment");
//--用promise 組合兩個function----....
Promise.all([getTeamMappingArray(), getScoreboard()]).then(results => {
  var teams = results[0];
  var games = results[1];
  console.log(
    games.map(game => {
      return {
        hTeam: {
          name: teams[game.hTeam.triCode].nickname,
          score: game.hTeam.score
        },
        vTeam: {
          name: teams[game.vTeam.triCode].nickname,
          score: game.vTeam.score
        }
      };
    })
  );
});
//-----首先先來取得 teams 的 mapping array，用來對應 scoreboard.json 的隊伍代號 tricode。-------////
function getTeamMappingArray() {
  return new Promise(done => {
    request(
      "https://data.nba.net/prod/v1/2018/teams.json",
      (err, res, body) => {
        var teams = JSON.parse(body);
        var mapping = [];
        teams.league.standard.forEach(obj => {
          mapping[obj.tricode] = obj;
        });
        done(mapping);
      }
    );
  });
}
//---------getScoreboard function 再來取得 scoreboard
function getScoreboard() {
  return new Promise(done => {
    let t = moment().format("YYYYMMDD");
    request(
      // "https://data.nba.net/prod/v2/20190117/scoreboard.json"
      "https://data.nba.net/prod/v2/" + t + "/scoreboard.json",
      (err, res, body) => {
        var scoreboard = JSON.parse(body);
        done(scoreboard.games);
      }
    );
  });
}
