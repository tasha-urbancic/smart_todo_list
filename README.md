# Node Skeleton

## Project Setup

1. Create your own empty repo on GitHub
2. Clone this repository (do not fork)
  - Suggestion: When cloning, specify a different folder name that is relevant to your project
3. Remove the git remote: `git remote rm origin`
4. Add a remote for your origin: `git remote add origin <your github repo URL>`
5. Push to the new origin: `git push -u origin master`
6. Verify that the skeleton code now shows up in your repo on GitHub

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- bcrypt 1.0.3 or above
- body-parser 1.15.2 or above
- bcrypt 1.0.x or above
- bcrypt 1.0.x or above
- bcrypt 1.0.x or above
- bcrypt 1.0.x or above

    "bcrypt": "^1.0.3",
    "body-parser": "^1.15.2",
    "bootstrap": "^4.0.0-beta",
    "connect-flash": "^0.1.1",
    "cookie-session": "^1.3.2",
    "dotenv": "^4.0.0",
    "ejs": "^2.4.1",
    "express": "^4.13.4",
    "knex": "^0.13.0",
    "knex-logger": "^0.1.0",
    "mixins": "0.0.1",
    "morgan": "^1.7.0",
    "node-sass-middleware": "^0.11.0",
    "pg": "^7.3.0",
    "request": "^2.83.0",
    "request-promise": "^4.2.2"

## Final Product

Adding a new to-do:
![“Add New Todo”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/add-new-todo6.gif?raw=true)

Minimizing lists:
![“Minimize Lists”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/minimize-categories.gif?raw=true)

Changing categories:
![“Changing Categories”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/miscategorize-edit.gif?raw=true)

Deleting to-dos:
![“Deleting Todos”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/delete-todo.gif?raw=true)
