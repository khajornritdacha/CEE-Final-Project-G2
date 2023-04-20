<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const AppError = require("./src/utils/appError");
const itemsRoutes = require("./src/routes/itemRoutes");
const coursevilleRoutes = require("./src/routes/coursevilleRoutes");
=======
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const AppError = require('./src/utils/appError');
const itemsRoutes = require('./src/routes/itemRoutes');
const coursevilleRoutes = require('./src/routes/coursevilleRoutes');
const assignmentsRoutes = require('./src/routes/assignmentRoutes');
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046

const app = express();

const sessionOptions = {
<<<<<<< HEAD
  secret: "my-secret",
=======
  secret: 'my-secret',
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
  resave: true,
  saveUninitialized: true,
  cookie: {
    // setting this false for http connections
    secure: false,
  },
};

const corsOptions = {
  origin: true,
  credentials: true,
};

<<<<<<< HEAD
app.use(express.static("static"));
=======
app.use(express.static('public'));
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

<<<<<<< HEAD
app.use("/items", itemsRoutes);
app.use("/courseville", coursevilleRoutes);
app.get("/", (req, res) => {
  res.send("Congratulation. This server is successfully run.");
});

app.all("*", (req, res, next) => {
=======
app.use('/items', itemsRoutes);
app.use('/courseville', coursevilleRoutes);
app.use('/assignments', assignmentsRoutes);

app.all('*', (req, res, next) => {
>>>>>>> 645b73609f4e9361b07d058d955d97bf2d179046
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
