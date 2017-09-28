
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments().notNullable().primary();
      table.string('email').notNullable();
      table.string('password_hash').notNullable();
      table.timestamps(true, true);
    }),

    knex.schema.createTable('categories', function(table) {
      table.increments().notNullable().primary();
      table.string('name').notNullable();
    }),

    knex.schema.createTable('todos', function(table) {
      table.increments().notNullable().primary()
      table.string('item').notNullable();
      table.boolean('completed_toggle').notNullable();
      table.integer('user_id').notNullable();
      table.integer('category_id').notNullable();
      table.timestamps(true, true);
    }),

    knex.schema.createTable('keywords', function(table) {
      table.increments().notNullable().primary();
      table.string('keyword').notNullable();
      table.integer('category_id').notNullable();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('keywords'),
    knex.schema.dropTable('todos'),
    knex.schema.dropTable('categories'),
    knex.schema.dropTable('users')
  ])
};



