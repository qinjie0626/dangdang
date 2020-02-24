var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();
// 要上传的图片目录静态资源
app.use('/upload',express.static('upload'))
app.use('/bannerimg',express.static('bannerimg'))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').__express);

app.use(cookieSession({
  name: 'session',
  keys: ['##F$%', 'd67@@'],
}))
app.use((req, res,next) => {
  let curSession = req.session.CURUSR ? req.session.CURUSR : ''
  if (req.url === '/' && curSession === '') {
      res.render('404.html',{tip:'请先登录',url:'/login'})
      return false
  }else{
      next()
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(apiRouter);

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
  res.render('error');
});

module.exports = app;
