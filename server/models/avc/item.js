var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var lanSchema = new Schema({
  en: String,
  nl: String,
  fr: String,
  de: String,
  local: String
}, {_id: false});

var lanBoolSchema = new Schema({
  en: Boolean,
  nl: Boolean,
  fr: Boolean,
  de: Boolean
}, {_id: false});

var itemSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: true},
    alias: {type: lanSchema, required: true},
    legacy: {id: String},
    city: {
      alias: lanSchema,
      name: lanSchema
    },
    dt: {
      inserted: Date,
      updated: Date,
      published: Date
    },
    pos: new Schema({type: String, coordinates: [String]}, {_id: false}),
    polyline: new Schema({type: String, coordinates: [[String]]}, {_id: false}),
    title: lanSchema,
    subTitle: lanSchema,
    prefix: lanSchema,
    description: lanSchema,
    address: lanSchema,
    location: lanSchema,
    metro: lanSchema,
    preview: lanSchema,
    content: lanSchema,
    websites: [String],
    categories: [String],
    isPublished: lanBoolSchema,
    isTopAttraction: Boolean,
    isQuality: Boolean,
    img: {
      thumb: String,
      photo: String,
      slides: [{slide: String}]
    },
    posters: {
      tpe: String,
      keywords: String,
      region: [String]
    },
    photos: [String],
    traffic: Number
  }, {collection: 'items', timestamps: true}
);
module.exports = itemSchema;