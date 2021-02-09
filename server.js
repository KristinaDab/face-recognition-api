const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors"); // To avoid 'Access-Control-Allow-Origin' error
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

//To avoid an error in heroku on registration to the db
// Don't use in real production!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

// Database connection
const db = knex({
  client: "pg",
  connection: {
    //heroku postgres db setup
    connectionString : process.env.DATABASE_URL, 
    ssl: true,
  },
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("It is working");
});

// Signin
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

// Register with transaction
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// Get profile - For future development
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// Update user image entries
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

// Handle imageurl with clarifai
app.post("/imageurl", (req, res) => {
    image.handleApiCall(req, res);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

console.log(PORT)
/*
The Plan how to make the server: 

 /-- res = this is working
 /signin --> POST = success/fail
 /register --> POST = user

 /profile/:userID --> GET = user
 /image --> PUT --> user

*/
