"use strict";

const express = require("express");
const router = express.Router();
const queries = require('../queries/queries');

module.exports = knex => {
  router.get("/", (req, res) => {
    queries.getTodoList(knex, req, res);
  });

  return router;
};