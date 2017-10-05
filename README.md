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

## Final Product

###Adding a new to-do:
![“Add New Todo”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/add-new-todo6.gif?raw=true)
###Minimizing lists:
![“Minimize Lists”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/minimize-categories.gif?raw=true)
###Changing categories:
![“Changing Categories”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/miscategorize-edit.gif?raw=true)
###Deleting to-dos:
![“Deleting Todos”](https://github.com/tasha-urbancic/smart_todo_list/blob/master/docs/delete-todo.gif?raw=true)
