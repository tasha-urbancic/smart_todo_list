
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('todos', function (table) {
      table.foreign('user_id').references('users.id');
      table.foreign('category_id').references('categories.id');
    }),

    knex.schema.table('keywords', function (table) {
      table.foreign('category_id').references('categories.id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('keywords', function (table) {
      table.dropForeign('category_id')
    }),

    knex.schema.table('todos', function (table) {
      table.dropForeign('user_id'),
      table.dropForeign('category_id')
    })
  ])
};
