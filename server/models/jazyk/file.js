var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var fileSchema = new Schema({
    app: {type: String, required: true},
    tpe: {type: String, required: true},
    cloudFile: {type: String, required: true},
    localFile: {type: String, required: true},
    name: String,
    format: String,
    ETag: String,
    dtAdded: { type: Date, default: Date.now }
  }, {collection: 'cloudfiles'}
);

module.exports = mongoose.model('File', fileSchema);
