var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileConnSchema = new Schema({
    connId: {type: Schema.Types.ObjectId, required: true},
    dbName: {type: String, required: false},
    collName: {type: String, required: false}
  },
  { _id : false }
)

var profileSchema = new Schema({
    name: {type: String, required: true, unique: true},
    source: profileConnSchema,
    target: profileConnSchema
  },
  { collection: 'profiles' }
);

module.exports = mongoose.model('Profile', profileSchema);
