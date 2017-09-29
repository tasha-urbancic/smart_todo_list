
module.exports = function getCategory(knex, todoItem) {

  let searchArray = [];
  const category = "";


  knex
    .select()
    .from("keywords")
    .asCallback((error, result) => {
    searchArray = result;

    for(let i = 0; i < searchArray.length; i++) {

      let keyword = searchArray[i].keyword;

      // *** add security on todoItem && variable - vulnerable to SQL injection attack ***

      let queryString = `SELECT to_tsvector(?) @@ to_tsquery('${keyword}') AS match;`
      // console.log(queryString);

      knex
        .raw(queryString, todoItem)
        .asCallback((error, result) => {
          if (result.rows[0].match === true) {
            console.log(searchArray[i].category_id);
            return(searchArray[i].category_id);
          }
        });
    }
  });




  return category;
}



