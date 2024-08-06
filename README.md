# Backend Challenge 20230105

## Description

This project involves developing a REST API to utilize data from the Open Food Facts project, which is an open database containing nutritional information on a variety of food products.

## Main Stacks

- Node.js;
- Nest.js;
- TypeScript;
- Prisma;
- MongoDB Atlas for database;
- DotEnv
- Axios
- Jest;
- @nestjs/testing
- @nestjs/schedule for Cron schedule function;

## Installation

To get started with the project, follow these steps:

1. Clone the repository
2. Install the dependencies with `yarn install`
3. You can use your own MongoDB Atlas credentials to connect with database or you can request my MongoDB Atlas credentials
4. Create a `.env` file in the root of the repository and add the environment variables from the `.env.example` file. Only change the DATABASE_URL variable, inserting the username, password, cluster, and database of your MongoDB Atlas
5. To start the project run `yarn start:dev`
6. If you created a new database using your own MongoDB Atlas credentials, you must run the command `yarn prisma generate`. Prisma will create the table called products
7. Once a day, the Cron job will run and populate the data base with Open Food Facts products data
8. You can test the API routes using the collection provided in the code. You just need to import it into Postman or Insomnia

> This is a challenge by [Coodesh](https://coodesh.com/)
