const getCategory = require("./getCategory");
const knexConfig = require("../knexfile");
const ENV = process.env.ENV || "development";
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");
var request = require("request");
var rp = require('request-promise');


function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function getWolframHttp(text) {
  const wolframStyleStr = toTitleCase(text).replace(/\s/g, "");

  return (
    "http://www.wolframalpha.com/queryrecognizer/query.jsp?appid=DEMO&mode=Default&i=" +
    wolframStyleStr +
    "&output=json"
  );
}

function getCategoryByKeyword(domain) {
  return knex
    .select('keywords.category_id')
    .from('keywords')
    .whereRaw("? LIKE '%' || keywords.keyword || '%'", [domain])
    .returning(["category_id"]);

}

module.exports = {
  getUser: function (userName) {
    return knex
      .select('*')
      .from("users")
      .where({ email: userName });
  },

  getCategories: function () {
    return knex.select("*").from("categories");
  },

  getTodoList: function (userId) {
    return knex
      .select("*")
      .from("todos")
      .where("user_id", userId)
      .orderBy("category_id", "asc")
      .orderBy("created_at", "desc");
  },

  checkUserEmailExists: function (emailValue) {
    return knex
      .select('id', 'email', 'password_hash')
      .from('users')
      .where('email', emailValue)
      .returning(['id','email', 'password_hash'])
  },

  addUser: function (email, password) {
    const user = {
      email: email,
      password_hash: password
    };
    return knex("users")
      .insert(user)
      .returning(["id"]);
  },


  addTodo: function (text, userId) {

    return getCategory(text).then(categoryIds => {
      if (categoryIds.length !== 0) {
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

      } else if (categoryIds.length === 0) {
        console.log(
          "your input string did not contain any key verbs. Testing wolfram API"
        );

        const httpReqStringTest1 = getWolframHttp(text);

        //// code for later to check case of mispelled/typo of verb
        // const arrayOfWords = text.split(' ');
        // const firstWordRemoved = arrayOfWords.splice(1).join(' ');
        // const httpReqStringTest2 = getWolframHttp(firstWordRemoved);

        // check if all words from input match
        return rp(httpReqStringTest1).then((body) => {
          const domain = JSON.parse(body).query[0].domain;

          if (domain) {
            return getCategoryByKeyword(domain).then((result) => {

              const categoryId = result[0].category_id;

              const item = {
                item: text,
                completed_toggle: 0,
                user_id: userId,
                category_id: categoryId
              };

              console.log('starting knex insertion');

              if (categoryId) {
                return Promise.resolve(knex("todos")
                  .insert(item)
                  .returning(["id", "category_id"]));
              } else {
                return Promise.reject();
              }

            }).catch((error) => Promise.reject(error));
          } else {
            return Promise.reject();
          }
        }).catch((error) => Promise.reject(error));
      }
    });
  },

  removeTodo: function (id) {
    return knex("todos")
      .where("todos.id", id)
      .del();
  },

  updateTodoText: function (id, text) {
    let updateObject = {};
    updateObject.item = text;

    return getCategory(text).then(categoryIds => {
      if (categoryIds.length === 0) {
        console.log(
          "your input string did not contain any key verbs. Testing wolfram API"
        );

        const httpReqString = getWolframHttp(text);

        return rp(httpReqString).then((body) => {
          const domain = JSON.parse(body).query[0].domain;

          return getCategoryByKeyword(domain).then((result) => {

            updateObject.category_id = result[0].category_id;
            console.log('starting knex update');

            return knex("todos")
              .where("todos.id", id)
              .update(updateObject)
              .returning(["id", "item", "category_id"]);
          });
        });

      } else {
        updateObject.category_id = categoryIds[0].category_id;

        return knex("todos")
          .where("todos.id", id)
          .update(updateObject)
          .returning(["id", "item", "category_id"]);
      }
    });
  },
  updateTodoCategory: function (id, categoryId) {
    let updateObject = {};
    updateObject.category_id = categoryId;

    return knex("todos")
      .where("todos.id", id)
      .update(updateObject);
  }
};
