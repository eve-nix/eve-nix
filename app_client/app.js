const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const uglifyJs = require( 'uglify-js' );
const fs = require( 'fs' );

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const appFiles = [
  'app.angular.js',
  'client/controllers/home.controller.js',
  'client/directives/footerGeneric/footerGeneric.directive.js',
  'client/directives/navigation/navigation.directive.js',
  'client/directives/orderTable/orderTable.directive.js',
  'client/directives/pageHeader/pageHeader.directive.js',
  'client/services/orders.service.js'
]

const uglified = uglifyJs.minify( appFiles );

fs.writeFile( 'public/javascripts/eveNix.min.js', uglified.code, ( err ) => {
  if ( err ) {
    console.log( err );
  }
  else {
    console.log( 'Script generate and saved: public/javascripts/eveNix.min.js' );
  }
} );

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

/* send index.html response */
app.use( ( req, res ) => {
  res.sendFile( path.join( __dirname, 'client', 'views', 'index.html' ) );
} );

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
