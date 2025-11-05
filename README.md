# TantooServiceRestNode

## Overview

This is a sample Node.js service using MongoDB as the database, with Mongoose as the ODM.

## Prerequisites

-  Node.js (v14.x or later)
-  MongoDB instance (either locally or via a cloud service like MongoDB Atlas)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/RaulArmasBenavides/TantooServiceRestNode
   ```
2. Navigate to the project directory:

   ```bash
   cd TantooServiceRestNode
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables:
   Create a `.env` file in the root of the project and provide the following variables:
   For dev

   ```
   DB_CNN2=<your MongoDB connection string>
   ```

   Example MongoDB connection string:

   ```
   DB_CNN2=mongodb+srv://<username>:<password>@cluster0.ie9pfbp.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

5. Start the service:
   ```bash
   npm start
   ```

## Development

-  Nodemon is used for development purposes. It automatically restarts the server when file changes in the directory are detected.
   ```bash
   npm start
   ```

## License

This project is licensed under the ISC License.




npm i --save-dev @types/jsonwebtoken
npm i --save-dev @types/express
npm i --save-dev @types/cors