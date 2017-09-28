
exports.seed = function(knex, Promise) {
  return knex('todos').del()
    .then(function () {
      return Promise.all([
        knex('todos').insert({item: 'Garden Shovel', completed_toggle: 0, user_id: 1, category_id: 4 }),

      ]);
    });
};
