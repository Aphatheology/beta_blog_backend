const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const articleRoutes = require('./src/articles/article.route');
const userRoutes = require('./src/users/user.route');
const protect = require('./src/middleware/auth');

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());

require('./src/config/passport');


app.use('/articles', articleRoutes);
app.use('/users', userRoutes);

module.exports = app;

