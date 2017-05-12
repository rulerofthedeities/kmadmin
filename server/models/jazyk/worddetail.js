var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var conjugationSchema = new Schema({
  singular: [String],
  plural: [String],
}, {_id: false})

var detailSchema = new Schema({
    lan: {type: String, required: true},
    word: {type: String, required: true},
    docTpe: {type: String, default: 'details'},
    wordTpe: {type: String, required: true},
    article: String,
    case: String,
    followingCase: String,
    genus: String,
    plural: String,
    diminutive: String,
    comparative: String,
    superlative: String,
    aspect: String,
    aspectPair: String,
    conjugation: [String],
    tags: [String],
    score: Number,
    wordCount: Number
  }, {collection: 'wordpairs'}
);
detailSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.conjugation.length == 0) {
      this.conjugation = undefined;       
    }           
    if (this.tags.length == 0) {
      this.tags = undefined;       
    }                          
  }
  next();
});
detailSchema.post('init', function(doc) {
  if (doc.conjugation && doc.conjugation.length < 1) {
    doc.conjugation = undefined;
  }
  if (doc.tags && doc.tags.length < 1) {
    doc.tags = undefined;
  }
});

module.exports = detailSchema;
