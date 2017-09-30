const getCategory = require("./getCategory");
const knexConfig = require("../knexfile");
const ENV = process.env.ENV || "development";
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");

module.exports = {
  getUser: function(userName) {
    return knex
      .select()
      .from("users")
      .where({ email: userName });
  },

  getCategories: function() {
    return knex
      .select("*")
      .from("categories");
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
    return getCategory(text).then(categoryIds => {
      if (categoryIds.length === 0) {
        console.log("error");
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

  // If you want to pass in an update object instead, replace item & category_id.  In that case you won't need to test for undefined.

  updateTodoText: function(id, item) {
    let updateObject = {};
    updateObject.item = item;

    // updateObject.category_id = req.body.data.categoryId;
    // later also update the category Id here

    return knex("todos")
      .where("todos.id", id)
      .update(updateObject);
  },
  updateTodoCategory: function(id, categoryId) {
    let updateObject = {};
    updateObject.category_id = categoryId;

    return knex("todos")
      .where("todos.id", id)
      .update(updateObject);
  }
};
