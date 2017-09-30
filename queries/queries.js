const getCategory = require("./getCategory");

module.exports = {
  getUser: function(knex, userName) {
    knex
      .select()
      .from("users")
      .where({ email: userName })
      .asCallback((error, rows) => {
        return rows;
      });
  },

  getTodoList: function(knex, req, res) {
    knex
      .select("*")
      .from("todos")
      .where("user_id", req.session.user_id)
      .orderBy("category_id", "asc")
      .orderBy("created_at", "desc")
      .then(results => {
        res.json(results);
      });
  },

  addTodo: function(knex, req, res) {
    return getCategory(knex, req.body.text).then(categoryIds => {
      if (categoryIds.length === 0) {
        console.log("error");
      } else {
        const categoryId = categoryIds[0].category_id;

        const item = {
          item: req.body.text,
          completed_toggle: 0,
          user_id: req.session.user_id,
          category_id: categoryId
        };

        return knex("todos")
          .insert(item)
          .returning(["id", "category_id"]);
      }
    });
  },

  removeTodo: function(knex, req, res) {
    console.log(req.body.id);
    knex("todos")
      .where("todos.id", req.body.id)
      .del()
      .asCallback(res);
  },

  // If you want to pass in an update object instead, replace item & category_id.  In that case you won't need to test for undefined.

  updateTodoText: function(knex, req, res) {
    let updateObject = {};
    updateObject.item = req.body.data.item;

    // updateObject.category_id = req.body.data.categoryId;
    // later also update the category Id here

    knex("todos")
      .where("todos.id", req.body.data.id)
      .update(updateObject)
      .asCallback(res);
  },
  updateTodoCategory: function(knex, req, res) {
    let updateObject = {};
    updateObject.category_id = req.body.data.category_id;

    knex("todos")
      .where("todos.id", req.body.data.id)
      .update(updateObject)
      .asCallback(res);
  }
};
