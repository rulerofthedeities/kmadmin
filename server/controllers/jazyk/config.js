const response = require('../../response'),
      mongoose = require('mongoose'),
      LanConfigModel = require('../../models/jazyk/lanconfig');
// connect to jazyk db 
const jazykUri = 'mongodb://127.0.0.1:27017/km-jazyk',
      jazykConn = mongoose.createConnection(jazykUri),
      Config = jazykConn.model('Config', LanConfigModel, "config");

module.exports = {
  getLanConfig: function(req, res) {
    const lanCode = req.params.lan;
    Config.findOne({tpe:'language', code: lanCode}, {}, function(err, config) {
      response.handleError(err, res, 500, 'Error fetching lan config', function(){
        response.handleSuccess(res, config, 200, 'Fetched lan config');
      });
    });
  }
}
