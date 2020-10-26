require('dotenv').config();
const passport = require('passport');
require('./config/passport')(passport)
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
var frontendRouter = require('./routes/frontend.routes');
var authRouter=require('./routes/auth.routes');
var apiRouter=require('./routes/user.routes')
var app = express();
var db=require('./database/db')
const flash = require('connect-flash');
//db set up
db.connectToDB(process.env.DB_URL)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
    secret:'secret',
    key:'session-key',
    resave:true,
    saveUninitialized:false
  }
))
app.use(passport.initialize());
app.use(passport.session());
//use flash
app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
  res.locals.user = req.session.user;
  next();
})
app.use('/', frontendRouter);
app.use('/auth',authRouter)
app.use('/api',apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // res.locals.message = err.message;
  console.log(err.message);
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  // res.render('error');
  res.status(err.status).send({
    status: err.status ,
    result: err.message
  });
});

module.exports = app;
