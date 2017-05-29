'use strict';
var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    compression = require('compression'),
    path = require('path'),
    bodyParser = require('body-parser'),
    bearerToken  = require('express-bearer-token'),
    routes = require('./server/routes'),
    indexes = require('./server/indexes'),
    db_url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/km-admin';

//config
app.set('port', process.env.PORT || 4700);
app.set('env', process.env.NODE_ENV || 'development');
app.set('token_expiration', 604800);// Token expires after 7 days

//Check if required config vars are present
if (!process.env.JWT_TOKEN_SECRET) {
  console.log('WARNING: no config var JWT_TOKEN_SECRET set!!');
}
if (!process.env.AWS_S3_ID) {
  console.log('WARNING: no config var AWS_S3_ID set!!');
}
if (!process.env.AWS_S3_KEY) {
  console.log('WARNING: no config var AWS_S3_KEY set!!');
}

//middleware
app.use(compression());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, '/files/jazyk/images/publish')));

if (app.get('env') == 'development') {
  console.log('Server running in development mode');
}

//routing
routes.initialize(app, new express.Router());

//start server
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
//mongoose.Promise = require('bluebird');
mongoose.connect(db_url, options, function(err) {
  indexes.create(function() {
    app.listen(app.get('port'), function() { 
      console.log('Server up: http://localhost:' + app.get('port'));
    });
  });
});
