
exports.seed = function(knex, Promise) {
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        knex('categories').insert({name: 'media'}),
        knex('categories').insert({name: 'food'}),
        knex('categories').insert({name: 'books'}),
        knex('categories').insert({name: 'products'})
      ]);
    });
};
