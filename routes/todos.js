"use strict";

const express = require("express");
const router = express.Router();

module.exports = knex => {
  router.get("/", (req, res) => {

    knex
      .select("*")
      .from("todos")
      .where("user_id", req.session.user_id)
      .orderBy("category_id", 'asc')
      .orderBy("created_at", 'desc')
      .then(results => {
        res.json(results);
      });
  });

  return router;
};