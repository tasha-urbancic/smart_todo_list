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
  }
  /*
  removeTodo: function (knex, todoid) {
    knex("todos")
      .del()
      .where(todos.id, todoid);
  }
  */
};
