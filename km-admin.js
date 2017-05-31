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
    checks = require('./server/checks'),
    db_url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/km-admin';

//config
app.set('port', process.env.PORT || 4700);
app.set('env', process.env.NODE_ENV || 'development');
app.set('token_expiration', 604800);// Token expires after 7 days

checks.checkWarnings(app);

//middleware
app.use(compression());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, '/files/jazyk/images/publish')));
app.use('/audio', express.static(path.join(__dirname, '/files/jazyk/audio/publish')));


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
