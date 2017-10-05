# Smart Todo List Project

## Getting Started

```
1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`.
2. Set up a new database using PostgreSQL.
2. Update the .env file with the correct database connection credentials.
3. Install dependencies by running the command `npm i`.
4. Fix to binaries for sass: `npm rebuild node-sass`.
5. Run migrations: `npm run knex migrate:latest`.
  - Check the migrations folder to see what gets created in the DB.
6. Run the seed: `npm run knex seed:run`.
  - Check the seeds file to see what gets seeded in the DB.
7. Run the server: `npm run local`.
8. Visit `http://localhost:8080/`.
```

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- bcrypt 1.0.3 or above
- body-parser 1.15.2 or above
- bootstrap 4.0.0-beta or above
- connect-flash 0.1.1 or above
- cookie-session 1.3.2 or above
- dotenv 4.0.0 or above
- ejs 2.4.1 or above
- express 4.13.4 or above
- knex 0.13.0 or above
- knex-logger 0.1.0 or above
- mixins 0.0.1 or above
- morgan 1.7.0 or above
- node-sass-middleware 0.11.0 or above
- pg 7.3.0 or above
- request 2.83.0 or above
- request-promise 4.2.2 or above

## Final Product

Adding a new to-do:
![“Add New Todo”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/add-new-todo6.gif?raw=true)

Minimizing lists:
![“Minimize Lists”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/minimize-categories.gif?raw=true)

Changing categories:
![“Changing Categories”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/miscategorize-edit.gif?raw=true)

Deleting to-dos:
![“Deleting Todos”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/delete-todo.gif?raw=true)
