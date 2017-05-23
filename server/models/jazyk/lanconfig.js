var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var lanSchema = new Schema({
  de: String,
  en: String,
  fr: String,
  nl: String
}, {_id : false})

var lanConfigSchema = new Schema({
    _id: String,
    tpe: {type: String, required: true},
    code: {type: String, required: true},
    name: lanSchema
  }, {collection: 'config'}
);
module.exports = lanConfigSchema;