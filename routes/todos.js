"use strict";

const express = require("express");
const router = express.Router();
const queries = require("../queries/queries");

module.exports = knex => {
  router.get("/", (req, res) => {
    queries.getTodoList(req.session.user_id).then(results => {
      res.json(results);
    });
  });

  router.post("/", (req, res) => {
    queries.addTodo(req.body.text, req.session.user_id).then(([todoObject]) => {
      console.log(todoObject);
      res.send(todoObject);
    });
  });

  return router;
};
