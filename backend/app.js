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

const app = express();

const sessionOptions = {
  secret: 'my-secret',
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

app.use(express.static('public'));
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/items', itemsRoutes);
app.use('/courseville', coursevilleRoutes);
app.use('/assignments', assignmentsRoutes);

app.get('/', (req, res) => {
  console.log('In root route');
  res.send('Hello world!');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
