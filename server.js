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
const bcrypt = require('bcrypt');
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const knexLogger = require("knex-logger");
const morgan = require("morgan");

// Seperated Routes for each Resource
const todosRoutes = require("./routes/todos");

// Start up cookie session
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

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
app.use(morgan("dev"));

app.use(function(request, response, next) {
  console.log(request.session);
  response.locals = {
    error: undefined,
    userId: request.session.user_id,
    user: request.session.user
  };
  next();
});

// Mount all resource routes
app.use("/todos", todosRoutes(knex));

// render register page
app.get("/register", (req, res) => {
  res.render('register');
});

// render login page
app.get("/login", (req, res) => {
  res.render('login');
});

// submit registration info
app.post("/register", (req, res) => {
  let emailValue = req.body.email;
  console.log(emailValue);

  // if username already taken, redirect to login page
  return queries.getUser(emailValue).then((results) => {
    if (results.length === 0) {
      const password_hash = bcrypt.hashSync(req.body.password, 10);
      return queries.addUser(emailValue, password_hash).then(results => {
        let id = results[0].id;
        req.session.user_id = id;
        req.session.user = emailValue;
        res.redirect("/");
        return;
      });
    } else if (results[0].email === emailValue) {
      console.log('email is stored, returning to login');
      res.redirect('/login');
      return;
    }
  });
});

// authenticate login
app.post("/login", (req, res) => {
  // check if email doesn't exist, redirect to registration
  let emailValue = req.body.email;

  return queries.getUser(emailValue).then((results) => {
    console.log(results);
    if (results.length === 0) {
      res.redirect('/register');
      return;
    } else if (results[0].email === emailValue) {
      return queries.getUser(emailValue).then((results) => {
        const user = results[0];
        if (!user) {
          res.status(404);
          return res.redirect(404, "/register");
        } else if (!bcrypt.compareSync(req.body.password, user.password_hash)) {
          res.status(404);
          return res.redirect(404, "/login");
        }
        req.session.user_id = user.id;
        req.session.user = emailValue;
        res.redirect("/");
        res.sendStatus(400);
        return;
      });
    }
  });
});

// set user as logged out -- clear cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// render home page
app.get("/", (req, res) => {
  queries.getCategories().then(results => {
    res.render("index", {
      errors: req.flash('errors'),
      categories: results
    });
  });
});

// delete todo
app.post("/user/:id/delete/:todo_id", (req, res) => {
  queries.removeTodo(req.body.id).then(results => {
    res.end("success: item deleted");
  });
});

// update the text of the todo
app.post("/user/:id/update-text/:todo_id", (req, res) => {
  queries.updateTodoText(req.body.data.id, req.body.data.item).then(results => {
    res.json(results);
    res.end("success: todo item changed");
  });
});

// update the category of the todo
app.post("/user/:id/update-category/:todo_id", (req, res) => {
  queries
    .updateTodoCategory(req.body.data.id, req.body.data.category_id)
    .then(results => {
      res.end("success: category changed");
    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});


