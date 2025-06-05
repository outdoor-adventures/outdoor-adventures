# Outdoor Adventures

## Description
Outdoor Adventures is a community based app centered on getting families out into nature and discovering the world around them. In a world often centered around technology, starting a journey of connecting with the outdoors can be overwhelming, especially for those who don't yet have expereince doing so. Outdoor Adventures brings together exciting activites such as hiking, camping, paddling, and many more. All can be found on one site, easily accesable for soon to be adventurers of all experience levels. Once adventures are found, they can be added by the community for all to enjoy.

## Built With:
This version uses React, Zustand, Express, Passport, and PostgreSQL. (A full list of dependencies can be found in `package.json`.)

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)

## Create Database and User Table

Create a new database named "outdoor-adventures", then create a `user` table using the query found in `database.sql` as well as the other tables available in the `database.sql`.

## Initial Setup Instructions

- In this repo's **root directory**, run `npm install`.
- Create an `.env` file in the **root directory**, then paste this line into the file:
- Run `npm run server` to start the server.
- Run `npm run client` to start the client.
- Navigate to `localhost:5173`.

## Lay of the Land

### The Home Page

To start, users are greeted by the Outdoor Adventures' home page. Right away they have the opportunity to find their next adventure, join the newsletter for community updates, or add their own adventure.

![Home Page First Section]("README Photos/HomePage1.png")