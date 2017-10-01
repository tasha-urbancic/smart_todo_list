const knexConfig = require("../knexfile");
const ENV = process.env.ENV || "development";
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");

module.exports = function getCategory(todoItem) {
  const textLowerCase = todoItem.toLowerCase();
  console.log(textLowerCase);

  return knex("keywords")
    .distinct("category_id")
    .select()
    .whereRaw("? LIKE keywords.keyword || ' %'", [textLowerCase]);
};

// parameterized queries

//take todo item, cast to ts vector?
// where clause matches to ts vector from keyword
// use a like query
// set a threshold for the match (even 0 will give a result)
// want a rank
// delclarative loop
