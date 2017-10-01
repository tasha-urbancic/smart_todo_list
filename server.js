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

app.use(function(req, res, next) {
  const userID = req.params.id;
  res.locals = {
    user_id: userID
  };
  next();
});

// Mount all resource routes
app.use("/todos", todosRoutes(knex));







////////////////////////////////
////////////////////////////////

app.get("/register", (req, res) => {
  res.render('register');
});

// submit registration info
app.post("/register", (req, res) => {
  let emailValue = req.body.email;

  console.log(emailValue)
  if (!emailValue || !req.body.password) {
    res.sendStatus(400);
    return;
  } else if ( 1 === 0) { //queries.isEmailUnique(emailValue).length > 0
    // queries.isEmailUnique(password_hash).then(results => {
    //     console.log(results);
    // });
    //res.sendStatus(400);
    return;
  }

  const password_hash = bcrypt.hashSync(req.body.password, 10);
  queries.addUser(emailValue, password_hash).then(results => {
    let id = results[0].id;
    console.log(id);
    req.session.user_id = id;
    res.redirect("/");
    return;
  });

});


app.get("/login", (req, res) => {
  //query.login needed here
  //res.redirect("/");  needed after query.
  res.render("login");
});


app.post("/login", (req, res) => {
  for (let id in users) {
    if (users[id].email === req.body.email) {  //verifyEmail()
      if (bcrypt.compareSync(req.body.password, users[id].password)) {
        req.session.user_id = users[id]["id"];
        res.redirect("/")
        return;
      }
    }
  }
  res.sendStatus(400);
});


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


// function isEmailUnique(emailValue) {
//   for (var keys in users) {
//     if( users[keys].email === emailValue ) {
//       return true;
//     }
//   }
// }

function isEmailStored(emailValue) {
  for (var keys in users) {
    if (users[keys]["email"] === emailValue ) {
      return true;

    }
  }
}

function isPasswordStored(passwordValue) {
  for (var keys in users) {
    if (users[keys]["password"] === passwordValue ) {
      return true;
    }
  }
}








////////////////////////////////
////////////////////////////////


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
  queries
    .updateTodoCategory(req.body.data.id, req.body.data.category_id)
    .then(results => {
      res.end("success: category changed");
    });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
