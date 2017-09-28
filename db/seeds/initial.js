
// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('table_name').del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('table_name').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };

exports.seed = function (knex, Promise) {
  return Promise.all([
    knex('categories').returning('id').insert([{
      name: 'media'
    }, {
      name: 'books'
    }, {
      name: 'food'
    }, {
      name: 'products'
    }]),
    knex('users').returning('id').insert({
      email: '1@1.com',
      password_hash: 'asdfasdf'
    })
  ]).then(([categoryIds, userIds]) => {
    return knex('todos').insert([{
      user_id: userIds[0],
      category_id: categoryIds[0],
      item: 'Watch Gladiator',
      completed_toggle: 0,
    }, {
      user_id: userIds[0],
      category_id: categoryIds[1],
      item: 'Read Time Magazine',
      completed_toggle: 0,
    }, {
      user_id: userIds[0],
      category_id: categoryIds[3],
      item: 'Buy Garden Trowel',
      completed_toggle: 0,
    }, {
      user_id: userIds[0],
      category_id: categoryIds[1],
      item: 'Read Programming 101 for Bootcamps',
      completed_toggle: 0,
    }, {
      user_id: userIds[0],
      category_id: categoryIds[2],
      item: 'Eat at Tacofino!',
      completed_toggle: 1,
    }
    ]);
  });
};
