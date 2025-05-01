# Prime Solo Project - Starting Repo

This version uses React, Zustand, Express, Passport, and PostgreSQL. (A full list of dependencies can be found in `package.json`.)

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)

## Create Database and User Table

Create a new database, then create a `user` table using the query found in `database.sql`.

* Note: `pool.js` is initially configured to connect to a database named `prime_app`. If you choose your own name, you'll need to modify `pool.js` so it knows how to connect to your database.

## Initial Setup Instructions

- In this repo's **root directory**, run `npm install`.
- Create an `.env` file in the **root directory**, then paste this line into the file:
    ```plaintext
      SERVER_SESSION_SECRET=superDuperSecret
    ```
- While you're in your new `.env` file, take the time to replace `superDuperSecret` with some a random string like `25POUbVtx6RKVNWszd9ERB9Bb6` to keep your application secure. 
    - Here's a site that can help you: [Password Generator Plus](https://passwordsgenerator.net).
    - If you skip this step, create a secret with less than eight characters, or leave it as `superDuperSecret`, you'll get a big warning message each time you start your server.
- Run `npm run server` to start the server.
- Run `npm run client` to start the client.
- Navigate to `localhost:5173`.
    - Verify that you are able to:
        - Register as a new user.
        - Log out.
        - Log back in.
        - Log out.
- Congrats! You now have a starting line for the cool thing you're about to build. 🙂

## Lay of the Land

This repository is intentionally quite minimal. It features the same directory structure that you know and love:

- `src/`: The React application and Zustand store.
- `public/`: Static assets for the client-side. (In this case, just a `favicon.ico` file.)
- `server/`: The Express server.

Much of the code code is descriptively commented. We recommend reading through the comments, getting a lay of the land, and becoming more comfortable with how it works before you start building on top of it.

For example, you're going to need to create new React Routes and Nav links as you build out your application. To do so, you'll first need a clear understanding of:

- How the `<Route>`s in `App.jsx` function.
- How the `<NavLink>`s in `Nav.jsx` function.


## Don't Forget to Update the Documentation

Don't forget to refactor this README file, as well as *the code comments in this project*, to read less like a starter repo and more like a finished project.

## Have Fun

Remember. This is only a two-week sprint! The goal is to:

- **Take the most clear and straightforward path to MVP!**
- Ensure your MVP functions as expected.
    - If you're going to build more stuff on top of it, you need to be able to trust it!

Once you've attained that, you'll have the opportunity to:

- Take stock of how much time is left, as well as how much bandwidth you have.
- Reason about which stretch goal(s) to attempt.
