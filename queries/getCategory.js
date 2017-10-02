const knexConfig = require("../knexfile");
const ENV = process.env.ENV || "development";
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");

module.exports = function getCategory(todoItem) {
  const textLowerCase = todoItem.toLowerCase();

  return knex("keywords")
    .distinct("category_id")
    .select()
    .whereRaw("? LIKE keywords.keyword || ' %'", [textLowerCase]);
};
