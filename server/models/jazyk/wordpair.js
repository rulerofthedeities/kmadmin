var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var altWordSchema = new Schema({
  detailId: {type: Schema.Types.ObjectId},
  word: String
}, {_id : false})

var wordLangSchema = new Schema({
  detailId: Schema.Types.ObjectId,
  word: {type: String, required: true},
  alt: {type: [altWordSchema], default: void 0},
  hint: String,
  info: String
}, {_id: false});

var wordSchema = new Schema({
  docTpe: {type: String, default: 'wordpair'},
  wordTpe: {type: String, required: true},
  lanPair: [String],
  cs: wordLangSchema,
  de: wordLangSchema,
  fr: wordLangSchema,
  en: wordLangSchema,
  nl: wordLangSchema
}, {collection: 'wordpairs'});

module.exports = wordSchema;
