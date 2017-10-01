const getCategory = require("./getCategory");
const knexConfig = require("../knexfile");
const ENV = process.env.ENV || "development";
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");
var request = require("request");

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

module.exports = {
  getUser: function(userName) {
    return knex
      .select()
      .from("users")
      .where({ email: userName });
  },

  getCategoryByKeyword: function(domain) {
    return knex.select("category_id").from("keywords").where(keyword, domain);
  },

  getCategories: function() {
    return knex.select("*").from("categories");
  },

  getTodoList: function(userId) {
    return knex
      .select("*")
      .from("todos")
      .where("user_id", userId)
      .orderBy("category_id", "asc")
      .orderBy("created_at", "desc");
  },

  addTodo: function(text, userId) {
    console.log(text);
    return getCategory(text).then(categoryIds => {
      if (categoryIds.length === 0) {
        console.log(
          "your input string did not contain any key verbs. Testing wolfram API"
        );

        const wolframStyleStr = toTitleCase(text).replace(/\s/g, "");

        const httpReqString = "http://www.wolframalpha.com/queryrecognizer/query.jsp?appid=DEMO&mode=Default&i=" +
        wolframStyleStr +
        "&output=json";

        const wolframOutput = request(httpReqString, function(error, response, body) {
          const domain = JSON.parse(body).query[0].domain;
          console.log(domain);
          return domain;
        });
        
        console.log(wolframOutput);

      } else {
        const categoryId = categoryIds[0].category_id;
        const item = {
          item: text,
          completed_toggle: 0,
          user_id: userId,
          category_id: categoryId
        };

        return knex("todos")
          .insert(item)
          .returning(["id", "category_id"]);
      }
    });
  },

  removeTodo: function(id) {
    return knex("todos")
      .where("todos.id", id)
      .del();
  },

  updateTodoText: function(id, item) {
    let updateObject = {};
    updateObject.item = item;
    console.log(item);

    return getCategory(item).then(categoryIds => {
      if (categoryIds.length === 0) {
        console.log(
          "your input string did not contain any key words. Setting default cat_id"
        );
      } else {
        updateObject.category_id = categoryIds[0].category_id;

        return knex("todos")
          .where("todos.id", id)
          .update(updateObject)
          .returning(["id", "item", "category_id"]);
      }
    });
  },
  updateTodoCategory: function(id, categoryId) {
    let updateObject = {};
    updateObject.category_id = categoryId;

    return knex("todos")
      .where("todos.id", id)
      .update(updateObject);
  }
};
