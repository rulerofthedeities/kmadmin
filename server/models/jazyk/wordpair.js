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
  tags: [String],
  cs: wordLangSchema,
  de: wordLangSchema,
  fr: wordLangSchema,
  en: wordLangSchema,
  nl: wordLangSchema
}, {collection: 'wordpairs'});

wordSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.tags.length == 0) {
      this.tags = undefined;       
    }                          
  }
  next();
});
wordSchema.post('init', function(doc) {
  if (doc.tags && doc.tags.length < 1) {
    doc.tags = undefined;
  }
});

module.exports = wordSchema;
