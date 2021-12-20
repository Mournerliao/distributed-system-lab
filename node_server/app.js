const http = require('http');
// const https = require('https');
const createError = require('http-errors');
const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./logger');
const fs = require("fs");

const indexRouter = require('./routes/index');
const wsRouter = require('./routes/websocket');

const app = express();

const httpsOption = {
  key : fs.readFileSync("./public/https/5543222_www.xiaoqw.online.key"),
  cert: fs.readFileSync("./public/https/5543222_www.xiaoqw.online.pem"),
}

// Create HTTP && WebSocket server
const server = http.createServer(app);
// const server = https.createServer(httpsOption, app);
expressWs(app, server);

//后端添加请求头解决跨域
app.all('*', function (req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("X-Powered-By", ' 3.2.1');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ws', wsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
const _errorHandler = (err, req, res, next) => {
  const errorMsg = err.message;

  logger.error(`${req.method} ${req.originalUrl} ${errorMsg}`);
  res.status(err.status || 500).json({
    code: -1,
    success: false,
    message: errorMsg,
    data: {},
  })
}

app.use(_errorHandler);

module.exports = {app,server};
