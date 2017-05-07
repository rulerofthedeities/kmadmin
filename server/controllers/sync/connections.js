var response = require('../../response'),
    Connection = require('../../models/sync/connection');

module.exports = {
  load: function(req, res) {
    Connection.find({}, function (err, connections) {
      response.handleError(err, res, 500, 'Error fetching connections', function(){
        response.handleSuccess(res, connections, 200, 'Fetched connections list');
      });
    });
  },
  add: function(req, res) {
    const conn = new Connection(req.body);
    conn.save(function (err, result) {
      response.handleError(err, res, 500, 'Error adding connections', function(){
        response.handleSuccess(res, result, 200, 'Added connection');
      });
    });
  },
  loadOne: function(connId, callback) {
    Connection.findOne({_id:connId}, function (err, connection) {
      callback(err, connection);
    });
  }
}