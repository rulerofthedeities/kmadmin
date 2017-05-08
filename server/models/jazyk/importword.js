var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var wordCountSchema = new Schema({
  word: String,
  wordCount: Number,
  score: Number,
  article: String,
  genus: String
}, {_id : false})

var wordLangSchema = new Schema({
  //detailId: {type: Schema.Types.ObjectId},
  word: {type: String, required: true},
  //altLegacy: String,
  alt: String, //[wordCountSchema],
  hint: String,
  info: String,
  score: Number,
  wordCount: Number
}, {_id : false})

var wordSchema = new Schema({
    docTpe: {type: String, default: 'wordpair'},
    wordTpe: {type: String, required: true},
    lanPair: {type: [String], required: true},
    nl: wordLangSchema,
    cs: wordLangSchema,
    author: {type: String, default: 'jazykimport'},
    score: Number,
    wordCount: Number
  }, {collection: 'wordpairs'}
);

wordSchema.pre('save', function (next) {
  if (this.isNew) {
    /*
    if (this.nl && this.nl.tags && this.nl.tags.length == 0) {
      this.nl.tags = undefined;       
    }           
    if (this.cs && this.cs.tags) {
      this.cs.tags = undefined;       
    }           
    if (this.nl.alt.length == 0) {
      this.nl.alt = undefined;       
    }            
    if (this.cs.alt.length == 0) {
      this.cs.alt = undefined;       
    } 
    */                                      
  }
  next();
});

module.exports = wordSchema;