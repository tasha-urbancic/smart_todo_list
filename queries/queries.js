const getCategory = require("./getCategory");
const knexConfig = require("../knexfile");
const ENV = process.env.ENV || "development";
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");
var request = require("request");
var rp = require('request-promise');

/**
* Converts string to Title Case.
* Takes inputs:
*
* @param {str} string
*
* It returns a string, in title case:
* @param {} string
*/
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
* Generates a wolfram api request string.
* Takes inputs:
*
* @param {text} string
*
* It returns a string, the url of the wolfram fast api.
* @param {} string
*/
function getWolframHttp(text) {
  const wolframStyleStr = toTitleCase(text).replace(/\s/g, "");

  return (
    "http://www.wolframalpha.com/queryrecognizer/query.jsp?appid=DEMO&mode=Default&i=" +
    wolframStyleStr +
    "&output=json"
  );
}

/**
* Takes the resulting domain from the wolfram 
* api request string, and queries the database
* for matching keywords, to get the category ID.
* Takes inputs:
*
* @param {domain} string
*
* Knex returns a promise from the database, 
* resolving to the category_id.
* @param {} promise
*/
function getCategoryByKeyword(domain) {
  return knex
    .select('keywords.category_id')
    .from('keywords')
    .whereRaw("? LIKE '%' || keywords.keyword || '%'", [domain])
    .returning(["category_id"]);

}

module.exports = {
  // get the user's email
  getUser: function (userName) {
    return knex
      .select('*')
      .from("users")
      .where({ email: userName });
  },

  // get all categories to feed into .ejs templates
  getCategories: function () {
    return knex.select("*").from("categories");
  },

  // find the todos for this user
  getTodoList: function (userId) {
    return knex
      .select("*")
      .from("todos")
      .where("user_id", userId)
      .orderBy("category_id", "asc")
      .orderBy("created_at", "desc");
  },

  // check that the user's email exists
  checkUserEmailExists: function (emailValue) {
    return knex
      .select('id', 'email', 'password_hash')
      .from('users')
      .where('email', emailValue)
      .returning(['id', 'email', 'password_hash'])
  },

  // add a user
  addUser: function (email, password) {
    const user = {
      email: email,
      password_hash: password
    };
    return knex("users")
      .insert(user)
      .returning(["id"]);
  },

  /**
  * Checks if any of the keywords match the text input.
  * If not, it queries the wolfram API for a match.
  * If not, it is placed in miscellaneous.
  * Takes inputs:
  *
  * @param {text} string
  * @param {integer} userId
  *
  * Uses knex to return a promise from the database, 
  * resolving to an array with the todo id and category_id.
  * @param {} promise
  */
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
            console.log('yes')
            const categoryId = 5
            const item = {
              item: text,
              completed_toggle: 0,
              user_id: userId,
              category_id: categoryId
            };
            return Promise.resolve(knex("todos")
              .insert(item)
              .returning(["id", "category_id"]));
          }
        }).catch((error) => Promise.reject(error));
      }
    });
  },

  // remove the todo
  removeTodo: function (id) {
    return knex("todos")
      .where("todos.id", id)
      .del();
  },

  /**
  * Once the todo text is updated, it checks if any 
  * of the keywords match the text input.
  * If not, it queries the wolfram API for a match.
  * If not, it is placed in miscellaneous.
  * Takes inputs:
  *
  * @param {integer} id
  * @param {text} string
  *
  * Uses knex to return a promise from the database, 
  * resolving to an array with the todo id and category_id.
  * @param {} promise
  */
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
          if (domain) {
            return getCategoryByKeyword(domain).then((result) => {
              updateObject.category_id = result[0].category_id;
              console.log('starting knex update');
              return knex("todos")
                .where("todos.id", id)
                .update(updateObject)
                .returning(["id", "item", "category_id"]);
            });
          } else {
            updateObject.category_id = 5;
            return knex("todos")
              .where("todos.id", id)
              .update(updateObject)
              .returning(["id", "item", "category_id"]);
          }
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
  // update a todo's category
  updateTodoCategory: function (id, categoryId) {
    let updateObject = {};
    updateObject.category_id = categoryId;
    return knex("todos")
      .where("todos.id", id)
      .update(updateObject);
  }
};
