var wolfram = require("wolfram").createClient("[CENSORED]");
var nodeWolframApi = require("node-wolfram-api");

wolfram.query("integrate 2x", function(err, result) {
  if (err) throw err;
  console.log("Result: %j", result);
});

// APP NAME: smart-todo-list
// APPID: L9K45E-GQJ4HH2XT2
// USAGE TYPE: Personal/Non-commercial Only

// WOLFRAM_APPID=L9K45E-GQJ4HH2XT2 npm queries/wolfram_api.js