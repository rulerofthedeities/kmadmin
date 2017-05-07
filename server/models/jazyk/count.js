var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var countSchema = new Schema({
    _id: String,
    count: {type: Number, required: true},
    score: {type: Number, required: true}
  }, {collection: 'nl'}
);
module.exports = countSchema;