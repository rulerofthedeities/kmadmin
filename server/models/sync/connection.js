var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authSchema = new Schema({
    userName: {type: String, required: true},
    password: {type: String, required: true},
    authDb: {type: String, required: true}
  },
  { _id : false }
)

var connSchema = new Schema({
    name: {type: String, required: true, unique: true},
    server: {type: String, required: true},
    port: {type: String, required: true},
    authentication: authSchema
  },
  { collection: 'connections' }
);

module.exports = mongoose.model('Connection', connSchema);
