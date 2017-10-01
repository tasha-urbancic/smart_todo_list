"use strict";

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const cookieSession = require("cookie-session");
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const queries = require("./queries/queries");
const flash = require('connect-flash');

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");

const morgan = require("morgan");

// Seperated Routes for each Resource
const todosRoutes = require("./routes/todos");

//
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

app.use(morgan("dev"));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));
app.use(flash());

app.use(function(req, res, next) {
  const userID = req.params.id;
  res.locals = {
    user_id: userID
  };
  next();
});

// Mount all resource routes
app.use("/todos", todosRoutes(knex));

//login
app.get("/user/:id/login", (req, res) => {
  let id = req.params.id;
  req.session.user_id = id;
  res.redirect("/");
});

app.get("/test", (req, res) => {
  res.render("test");
});

// Home page
app.get("/", (req, res) => {
  queries.getCategories().then(results => {
    res.render("index", {
      errors: req.flash('errors'),
      categories: results
    });
  });
});

//logout page
app.get("/logout", (req, res) => {
  // req.session.user_id = null;
  // res.redirect("/");
});

//delete todo
app.post("/user/:id/delete/:todo_id", (req, res) => {
  queries.removeTodo(req.body.id).then(results => {
    res.end("success: item deleted");
  });
});

//update the text of the todo
app.post("/user/:id/update-text/:todo_id", (req, res) => {
  queries.updateTodoText(req.body.data.id, req.body.data.item).then(results => {
    res.json(results);
    res.end("success: todo item changed");
  });
});

//update the category of the todo
app.post("/user/:id/update-category/:todo_id", (req, res) => {
  // console.log(req.body.data.category_id);
  queries
    .updateTodoCategory(req.body.data.id, req.body.data.category_id)
    .then(results => {
      console.log(results);
      res.end("success: category changed");
    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
