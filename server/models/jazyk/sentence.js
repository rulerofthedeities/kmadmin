var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sentenceLangSchema = new Schema({
  sentence: {type: String, required: true},
  alt: String,
  hint: String,
  info: String,
  score: Number,
  wordCount: Number
}, {_id : false})

var sentenceSchema = new Schema({
    nl: sentenceLangSchema,
    cs: sentenceLangSchema
  }, {collection: 'sentences'}
);
module.exports = sentenceSchema;