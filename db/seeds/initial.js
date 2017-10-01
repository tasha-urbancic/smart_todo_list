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

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex("categories")
      .returning("id")
      .insert([
        {
          name: "media"
        },
        {
          name: "books"
        },
        {
          name: "food"
        },
        {
          name: "products"
        }
      ]),
    knex("users")
      .returning("id")
      .insert([
        {
          email: "sammy.jenner@gmail.com",
          password_hash: "abcde"
        },
        {
          email: "daniel.jenkins@gmail.com",
          password_hash: "abcde"
        }
      ])
  ]).then(([categoryIds, userIds]) => {
    return knex("todos")
      .insert([
        {
          user_id: userIds[0],
          category_id: categoryIds[0],
          item: "Watch Gladiator",
          completed_toggle: 0
        },
        {
          user_id: userIds[0],
          category_id: categoryIds[1],
          item: "Read Time Magazine",
          completed_toggle: 0
        },
        {
          user_id: userIds[0],
          category_id: categoryIds[3],
          item: "Buy Garden Trowel",
          completed_toggle: 0
        },
        {
          user_id: userIds[1],
          category_id: categoryIds[1],
          item: "Read Programming 101 for Bootcamps",
          completed_toggle: 0
        },
        {
          user_id: userIds[0],
          category_id: categoryIds[2],
          item: "Eat at Tacofino!",
          completed_toggle: 1
        }
      ])
      .then(() => {
        return knex("keywords").insert([
          {
            keyword: "watch",
            category_id: categoryIds[0]
          },
          {
            keyword: "movies",
            category_id: categoryIds[0]
          },
          {
            keyword: "music albums",
            category_id: categoryIds[0]
          },
          {
            keyword: "read",
            category_id: categoryIds[1]
          },
          {
            keyword: "a fictional character",
            category_id: categoryIds[1]
          },
          {
            keyword: "books",
            category_id: categoryIds[1]
          },
          {
            keyword: "a text",
            category_id: categoryIds[1]
          },
          {
            keyword: "periodicals",
            category_id: categoryIds[1]
          },
          {
            keyword: "buy",
            category_id: categoryIds[3]
          },
          {
            keyword: "invention",
            category_id: categoryIds[3]
          },
          {
            keyword: "a software product",
            category_id: categoryIds[3]
          },
          {
            keyword: "product",
            category_id: categoryIds[3]
          },
          {
            keyword: "music works",
            category_id: categoryIds[3]
          },
          {
            keyword: "consumer products",
            category_id: categoryIds[3]
          },
          {
            keyword: "eat",
            category_id: categoryIds[2]
          },
          {
            keyword: "finance",
            category_id: categoryIds[2]
          },
          {
            keyword: "retail locations",
            category_id: categoryIds[2]
          },
          {
            keyword: "food",
            category_id: categoryIds[2]
          },
          { category_id: categoryIds[0], keyword: "watch" },
          { category_id: categoryIds[0], keyword: "follow" },
          { category_id: categoryIds[0], keyword: "see" },
          { category_id: categoryIds[0], keyword: "attend" },
          { category_id: categoryIds[0], keyword: "catch" },
          { category_id: categoryIds[0], keyword: "check out" },
          { category_id: categoryIds[0], keyword: "view" },
          { category_id: categoryIds[0], keyword: "take in" },
          { category_id: categoryIds[1], keyword: "read" },
          { category_id: categoryIds[1], keyword: "interpret" },
          { category_id: categoryIds[1], keyword: "scan" },
          { category_id: categoryIds[1], keyword: "study" },
          { category_id: categoryIds[1], keyword: "translate" },
          { category_id: categoryIds[1], keyword: "decipher" },
          { category_id: categoryIds[1], keyword: "skim" },
          { category_id: categoryIds[1], keyword: "flip through" },
          { category_id: categoryIds[1], keyword: "go over" },
          { category_id: categoryIds[1], keyword: "go through" },
          { category_id: categoryIds[1], keyword: "leaf through" },
          { category_id: categoryIds[1], keyword: "pore over" },
          { category_id: categoryIds[1], keyword: "peruse" },
          { category_id: categoryIds[2], keyword: "eat" },
          { category_id: categoryIds[2], keyword: "dine" },
          { category_id: categoryIds[2], keyword: "feed" },
          { category_id: categoryIds[2], keyword: "feast" },
          { category_id: categoryIds[2], keyword: "nibble" },
          { category_id: categoryIds[2], keyword: "banquet" },
          { category_id: categoryIds[2], keyword: "breakfast" },
          { category_id: categoryIds[2], keyword: "gorge" },
          { category_id: categoryIds[2], keyword: "gormandize" },
          { category_id: categoryIds[2], keyword: "graze" },
          { category_id: categoryIds[2], keyword: "lunch" },
          { category_id: categoryIds[2], keyword: "munch" },
          { category_id: categoryIds[2], keyword: "masticate" },
          { category_id: categoryIds[2], keyword: "nosh" },
          { category_id: categoryIds[2], keyword: "ruminate" },
          { category_id: categoryIds[2], keyword: "snack" },
          { category_id: categoryIds[2], keyword: "sup" },
          { category_id: categoryIds[2], keyword: "break bread" },
          { category_id: categoryIds[2], keyword: "chow down" },
          { category_id: categoryIds[2], keyword: "gobble" },
          { category_id: categoryIds[2], keyword: "have a bite" },
          { category_id: categoryIds[2], keyword: "have a meal" },
          { category_id: categoryIds[2], keyword: "take nourishment" },
          { category_id: categoryIds[2], keyword: "take out" },
          { category_id: categoryIds[3], keyword: "buy" },
          { category_id: categoryIds[3], keyword: "obtain" },
          { category_id: categoryIds[3], keyword: "purchase" },
          { category_id: categoryIds[3], keyword: "acquire" },
          { category_id: categoryIds[3], keyword: "gather" },
          { category_id: categoryIds[3], keyword: "get" },
          { category_id: categoryIds[3], keyword: "procure" },
          { category_id: categoryIds[3], keyword: "score" },
          { category_id: categoryIds[3], keyword: "secure" },
          { category_id: categoryIds[3], keyword: "bargain for" },
          { category_id: categoryIds[3], keyword: "barter for" },
          { category_id: categoryIds[3], keyword: "contract" },
          { category_id: categoryIds[3], keyword: "shop for" },
          { category_id: categoryIds[3], keyword: "pay for" }
        ]);
      });
  });
};
