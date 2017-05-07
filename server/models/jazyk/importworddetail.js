var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var conjugationSchema = new Schema({
  singular: [String],
  plural: [String]
}, {_id : false})

var wordNounSchema = new Schema({
  lan: {type: String, required: true},
  word: {type: String, required: true},
  docTpe: {type: String, default: 'details'},
  wordTpe: {type: String, default: 'noun'},
  article: String,
  case: String,
  genus: String,
  plural: String,
  diminutive: String
}, {collection: 'wordpairs'});

var wordAdjectiveSchema = new Schema({
  lan: {type: String, required: true},
  word: {type: String, required: true},
  docTpe: {type: String, default: 'details'},
  wordTpe: {type: String, default: 'adjective'},
  case: String,
  comparative: String,
  superlative: String
}, {collection: 'wordpairs'});

var wordVerbSchema = new Schema({
  lan: {type: String, required: true},
  word: {type: String, required: true},
  docTpe: {type: String, default: 'details'},
  wordTpe: {type: String, default: 'verb'},
  aspect: String,
  aspectPair: String,
  followingCase: String,
  conjugation: conjugationSchema
}, {collection: 'wordpairs'});

var wordPrepositionSchema = new Schema({
  lan: {type: String, required: true},
  word: {type: String, required: true},
  docTpe: {type: String, default: 'details'},
  wordTpe: {type: String, default: 'preposition'},
  followingCase: String
}, {collection: 'wordpairs'});

module.exports = {
  noun: wordNounSchema,
  adjective: wordAdjectiveSchema,
  verb: wordVerbSchema,
  preposition: wordPrepositionSchema
};