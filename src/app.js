require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();
app.use(express.json());

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("POST request received");
});

app.get("/", (req, res) => {
  res.send("Express Store");
});

/*
{
  "username": "String between 6 and 20 characters",
  "password": "String between 8 and 36 characters, must contain at least one number",
  "favoriteClub": "One of 'Cache Valley Stone Society', 'Ogden Curling Club', 'Park City Curling Club', 'Salt City Curling Club' or 'Utah Olympic Oval Curling Club'",
  "newsLetter": "True - receive newsletters or False - no newsletters"
}
*/

app.post("/user", (req, res) => {
  console.log(req.body);
  const { username, password, favoriteClub, newsletter = false } = req.body;
  //validation
  if (!username) {
    return res.status(404).send("username required");
  }
  if (!password) {
    return res.status(404).send("password required");
  }
  if (!favoriteClub) {
    return res.status(404).send("favorite club is required");
  }

  if (username.length < 6 || username.length > 20) {
    return res.status(400).send("Username must be between 6 and 20 characters");
  }

  if (password.length < 8 || password.length > 36) {
    return res.status(400).send("Password must be between 8 and 36 charaters");
  }

  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res.status(400).send("Password must contain one digit");
  }

  res.send(200);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
