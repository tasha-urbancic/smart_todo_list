
module.exports = {

  getUser : function (knex, userName) {
    knex.select().from('users').where({email: userName}).asCallback((error, rows) => {
      //console.log(rows);
      return rows;
    })
  },

  getTodoList : function (knex, userid) {
    knex.select().from('todos').where({user_id: userid}).asCallback((error, rows) => {
      //console.log(rows);
      return rows;
    })
  }



}
