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
  tags: [String],
  case: String,
  genus: String,
  plural: String,
  diminutive: String,
  score: Number,
  wordCount: Number
}, {collection: 'wordpairs'});

var wordAdjectiveSchema = new Schema({
  lan: {type: String, required: true},
  word: {type: String, required: true},
  docTpe: {type: String, default: 'details'},
  wordTpe: {type: String, default: 'adjective'},
  case: String,
  tags: [String],
  comparative: String,
  superlative: String,
  score: Number,
  wordCount: Number
}, {collection: 'wordpairs'});

var wordVerbSchema = new Schema({
  lan: {type: String, required: true},
  word: {type: String, required: true},
  docTpe: {type: String, default: 'details'},
  wordTpe: {type: String, default: 'verb'},
  tags: [String],
  aspect: String,
  aspectPair: String,
  followingCase: String,
  conjugation: [String],
  score: Number,
  wordCount: Number
}, {collection: 'wordpairs'});

wordVerbSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.conjugation.length == 0) {
      this.conjugation = undefined;       
    }                                                     
  }
  next();
});

var wordPrepositionSchema = new Schema({
  lan: {type: String, required: true},
  word: {type: String, required: true},
  docTpe: {type: String, default: 'details'},
  wordTpe: {type: String, default: 'preposition'},
  followingCase: String,
    tags: [String],
    score: Number,
    wordCount: Number
}, {collection: 'wordpairs'});

module.exports = {
  noun: wordNounSchema,
  adjective: wordAdjectiveSchema,
  verb: wordVerbSchema,
  preposition: wordPrepositionSchema
};