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

app.use(function (req, res, next) {
  const userID = req.params.id;
  res.locals = {
    user: userID
  };
  next();
});

// Mount all resource routes
app.use("/todos", todosRoutes(knex));

app.get("/register", (req, res) => {
  res.render('register');
});

// submit registration info
app.post("/register", (req, res) => {
  let emailValue = req.body.email;
<<<<<<< HEAD
  console.log(emailValue);

  // if username already taken, redirect to login page
  return queries.getUser(emailValue).then((results) => {
    if (results.length === 0) {
      const password_hash = bcrypt.hashSync(req.body.password, 10);
      return queries.addUser(emailValue, password_hash).then(results => {
        let id = results[0].id;
        console.log(id);
        req.session.user_id = id;
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

app.post("/login", (req, res) => {
  // check if email doesn't exist, redirect to registration
  let emailValue = req.body.email;

  return queries.getUser(emailValue).then((results) => {
    if (results.length === 0) {
      console.log("email isn't stored, sending to register");
      res.redirect('/register');
      return;
    } else if (results[0].email === emailValue) {
      return queries.getUser(emailValue).then((results) => {
        const user = results[0];
        console.log(req.body.password, user.password_hash);
        handleBadLoginInfo(user, req.body.password, user.password_hash);
        req.session.user_id = user.id;
        res.redirect("/");
        res.sendStatus(400);
        return;
      });
    }
  });
});

app.get("/login", (req, res) => {
  res.render('login');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

/**
* Handles user entering bad login info.
* Takes inputs:
*
* @param {user} object
* @param {request} object
* @param {response} object
*
* It returns a function, redirect, which redirects
* to the login or register page.
* @param {response.redirect()} function
*/
function handleBadLoginInfo(user, passwordEntered, hashedPassword) {
  if (!user) {
    response.status(404);
    return response.redirect(404, "/register");
  } else if (!bcrypt.compareSync(passwordEntered, hashedPassword)) {
    response.status(404);
    return response.redirect(404, "/login");
  }
}

// Home page
app.get("/", (req, res) => {
  // check here if user is logged in (i.e. cookie exists), 
  // and if not redirect to login page
  queries.getCategories().then(results => {
    res.render("index", {
      errors: req.flash('errors'),
      categories: results
    });
  });
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
  queries
    .updateTodoCategory(req.body.data.id, req.body.data.category_id)
    .then(results => {
      res.end("success: category changed");
    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
