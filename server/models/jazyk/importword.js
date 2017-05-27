var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var altWordSchema = new Schema({
  detailId: {type: Schema.Types.ObjectId},
  word: String
}, {_id : false})

var wordLangSchema = new Schema({
  detailId: {type: Schema.Types.ObjectId},
  word: {type: String, required: true},
  //altLegacy: String,
  alt: [altWordSchema],
  hint: String,
  info: String,
  score: Number,
  wordCount: Number
}, {_id : false})

var wordSchema = new Schema({
  docTpe: {type: String, default: 'wordpair'},
  wordTpe: {type: String, required: true},
  lanPair: {type: [String], required: true},
  tags: [String],
  nl: wordLangSchema,
  cs: wordLangSchema,
  author: {type: String, default: 'jazykimport'},
  score: Number,
  wordCount: Number
  }, {collection: 'wordpairs'}
);

wordSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.tags.length == 0) {
      this.tags = undefined;       
    }            
    if (this.cs.alt.length == 0) {
      this.cs.alt = undefined;       
    }                                    
  }
  next();
});

module.exports = wordSchema;