module.exports = function getCategory(knex, todoItem) {

  return knex('keywords')
  .distinct('category_id')
  .select()
  .whereRaw("? LIKE keywords.keyword || ' %'", [todoItem]);
  // .where(`${todoItem}`, "like", "keywords.keyword || ' %'");
  
};

// raw("SELECT DISTINCT category_id FROM keywords WHERE ? LIKE keywords.keyword || ' %'", [todoItem]);



// parameterized queries


// concat 

// replace ? with read harry potter

// use ranking.... tvs vector shit

// join to keywords... using this keyword ts vector?
// set a threshold for the match (even 0 will give a result)
// use a like query


//take todo item, cast to ts vector?
// where clause matches to ts vector from keyword


// ts vectors
// just cast it to a ts vector.....
// want a rank
// delclarative loop