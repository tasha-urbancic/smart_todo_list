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
    const item = {
      item: req.body.text,
      completed_toggle: 0,
      user_id: req.session.user_id,
      category_id: 1
    };

    knex("todos")
      .insert(item)
      .asCallback(results => {
        res.json(results);
      });
  },

  removeTodo: function (knex, todoid) {
    knex("todos")
      .where("todos.id", todoid)
      .del()
      .asCallback();
  },

  // If you want to pass in an update object instead, replace item & category_id.  In that case you won't need to test for undefined.

  updateTodo: function (knex, todoid, item, category_id) {
    let updateObject = {};
    if (item !== undefined) {
      updateObject.item = item;
    };
    if (category_id !== undefined) {
      updateObject.category_id = category_id;
    }
    knex("todos")
      .where("todos.id", todoid)
      .update(updateObject)
      .asCallback();
  }

};
