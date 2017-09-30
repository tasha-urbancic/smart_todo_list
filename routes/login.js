"use strict";

const express = require("express");
const router = express.Router();
const queries = require('../queries/queries');

module.exports = knex => {
  router.get("/", (req, res) => {
    let id = req.params.id;
    req.session.user_id = id;
    res.redirect("/");
  });

  return router;
};

