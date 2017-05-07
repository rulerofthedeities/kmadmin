var response = require('../../response'),
    connections = require("./connections"),
    mongoose = require('mongoose'),
    Admin = mongoose.mongo.Admin,
    MongoClient = mongoose.mongo.MongoClient;

module.exports = {
  load: function(req, res) {
    const connId = mongoose.Types.ObjectId(req.params.id);
    const dbName = req.params.name;
    
    // fetch connection
    connections.loadOne(connId, function(err, connection) {
      let user = '';
      let authDb = '';
      if (!err) {
        //Fetch user name and password
        if (connection.authentication) {
          user = connection.authentication.userName + ':' + connection.authentication.password + '@';
          authDb = '/' + connection.authentication.authDb;
        }
        const uri = 'mongodb://' + user + connection.server + ':' + connection.port + (dbName ? '/' + dbName : '') + authDb;
        console.log('connecting to', uri);

        MongoClient.connect(uri, function(err, db) {
          if (!err) {
            if (dbName) {
              //Fetch collections list
              db.listCollections().toArray(function(err, collections){
                response.handleError(err, res, 500, 'Error fetching collection list', function() {
                  response.handleSuccess(res, collections, 200, 'Fetched collection list');
                  db.close();
                });
              });
            } else {
              //Fetch database list
              var adminDb = db.admin();
              adminDb.listDatabases(function(err, result) {
                response.handleError(err, res, 500, 'Error fetching database list (2)', function() {
                  response.handleSuccess(res, result.databases, 200, 'Fetched database list');
                  db.close();
                });
              });  
            }
          } else {
            response.handleError(err, res, 500, 'Error connecting to mongodb host', function(){});
          }
        });

      } else {
        response.handleError(err, res, 500, 'Error loading connection', function(){});
      }
    });
  }
}