var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { swaggerUi, specs } = require('./modules/swagger');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var schoolRouter = require('./routes/school');
var classRouter = require('./routes/class');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
  extended:true
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/register', registerRouter);
app.use('/api/school', schoolRouter);
app.use('/api/class', classRouter);


// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('catch 404');
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error message
  res.status(err.status || 500).json({
    "error": {
      "code": err.status,
      "message": err.message
    }
  });
});



module.exports = app;
