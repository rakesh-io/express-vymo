var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const URL = 'mongodb+srv://admin2:d0EJd6xnIX1U8LiC@cluster0.2raow.azure.mongodb.net/ecommerce_test?retryWrites=true&w=majority';
mongoose.connect(URL).then(() => {
  console.log('Database connection successful!');
}).catch(() => {
  console.log('Conection fail', err);
});

var indexRouter = require('./routes/index.route');
var usersRouter = require('./routes/users.route');
var productsRouter = require('./routes/products.route');
var placesRouter = require('./routes/places.route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/places', placesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.send({message: err.message})
  res.render('error');
});

module.exports = app;
