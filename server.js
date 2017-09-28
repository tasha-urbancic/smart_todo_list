"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const todosRoutes = require("./routes/todos");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Need to pass locals...?
// app.use(function (req, res, next) {
//   const userID = req.params.id
//   res.locals = {
//     user: userID
//   };
//   next();
// });


// Mount all resource routes
app.use("/todos", todosRoutes(knex));

//login route
app.get("/user/:id/login/", (req, res) => {
  let user_id = req.params.id;
  let templateVars = { user: user_id }
  req.redirect('/');
});


// Home page
app.get("/", (req, res) => {
  knex
  .select("*")
  .from("categories")
  .then(results => {
    res.render("index", {
      categories: results
    });
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
