var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountRouter = require('./routes/account');
var userRouter = require('./routes/user');


var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors())

// app.use(upload.any())
app.use(express.static('./public'))
// app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use((req, res, next) =>{
  res.cc = (err, code = 1) => {
    res.send({
      code,
      msg: err instanceof Error ? err.message : err
    })
  }
  next()
});

const jwtConfig = require('./jwt_config/index.js')
const { expressjwt: jwt } = require('express-jwt');
const Joi = require('joi');
// app.use(jwt({
//   secret: jwtConfig.jwtSecretKey, algorithms: ['HS256']
// }).unless({
//   path: [/^\/api\//]
// }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/account', accountRouter);
app.use('/api/user', userRouter);

app.use((err, req, res, next)=>{
  if(err instanceof Joi.ValidationError) return res.cc(err)
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// app.listen(3007, () => {
//   console.log('this run at 3007')
// })

module.exports = app;
