var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var static = require('node-static');
var http = require('http');
var app = http.createServer(handler);
var io = require('socket.io').listen(app);
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var razorpay = require('razorpay');
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");




var indexRouter = require('./routes/index');

var userRouter = require('./routes/user');

var firebaseConfig = {
  // ...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//ModiShopping
var app = express();

const uri = 'mongodb+srv://Prachi:ModiShopping@modidairy.9hpcs.mongodb.net/modiDairy?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true});

mongoose.connection.on('connected', () => {
  console.log("Connected to mongoose!");
}); 

require('./config/passport');

// view engine setup
app.engine('.hbs',expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'Prabhodhyan',
  resave: false, 
  saveUninitialized:false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie:{maxAge: 180*60*1000}
})); 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
app.use('/user', userRouter);
app.use('/', indexRouter);

// serve files on request
function handler(request, response) {
	request.addListener('end', function() {
		files.serve(request, response);
	});
}


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

io.sockets.on('connection', function (socket) {

  // start listening for coords
  socket.on('send:coords', function (data) {

  	// broadcast your coordinates to everyone except you
  	socket.broadcast.emit('load:coords', data);
  });
});


module.exports = app;
