var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var fileSchema = new Schema({s3:String, local:String}, {_id : false})
var detailSchema = new Schema({
    lan: {type: String, required: true},
    word: {type: String, required: true},
    docTpe: {type: String, default: 'details'},
    wordTpe: {type: String, required: true},
    region: String,
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
    conjugation: { type: [String], default: void 0 },
    isDiminutive: Boolean,
    isPlural: Boolean,
    isComparative: Boolean,
    isSuperlative: Boolean,
    images: { type: [fileSchema], default: void 0 },
    audios: { type: [fileSchema], default: void 0 },
    score: Number,
    wordCount: Number
  }, {collection: 'wordpairs'}
);

module.exports = detailSchema;
