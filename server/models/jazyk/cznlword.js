var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var infoSchema = new Schema({
  alt: String,
  hint: String,
  info: String
}, {_id : false})

var wordLangSchema = new Schema({
  word: {type: String, required: true},
  fromNl: infoSchema,
  toNl: infoSchema,
  otherwords: String, //Backward compatibility
  hint: String,
  info: String,
  article: String,
  genus: String,
  case: String,
  aspect: String,
  aspectPair: String,
  firstpersonsingular: String,
  dimitutive: String,
  plural: String,
  score: Number,
  wordCount: Number
}, {_id : false})

var cznlWordSchema = new Schema({
    tpe: {type: String, required: true},
    categories: [String],
    perfective: Boolean,
    nl: wordLangSchema,
    nlP: wordLangSchema, //Backward compatibility
    cz: wordLangSchema, //Backward compatibility
    czP: wordLangSchema, //Backward compatibility
    cs: [wordLangSchema],
    fr: [wordLangSchema],
    en: [wordLangSchema],
    de: [wordLangSchema]
  }, {collection: 'wordpairs'}
);
cznlWordSchema.pre('save', function (next) {
  if (this.isNew) {
    if (this.categories.length == 0) {
      this.categories = undefined;       
    }                                                                                                            
  }
  next();
});
module.exports = cznlWordSchema;