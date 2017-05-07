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

var timezoneSchema = new Schema({
  offset: String,
  code: lanSchema,
  name: lanSchema,
  zone: String
}, {_id: false});

var citySchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: true},
    alias: {type: lanSchema, required: true},
    name: lanSchema,
    intro: lanSchema,
    language: lanSchema,
    state: new Schema({name: lanSchema, code: String}, {_id: false}),
    country: new Schema({name: lanSchema}, {_id: false}),
    icon: new Schema({fileName: String}, {_id: false}),
    pos: new Schema({type: String, coordinates: [String]}, {_id: false}),
    currency: new Schema({name: lanSchema, code: String}, {_id: false}),
    altitude: new Schema({m: Number, ft: Number}, {_id: false}),
    location: new Schema({descr: lanSchema, img: String}, {_id: false}),
    timezone: timezoneSchema,
    map: {zoom: String},
    coordinates: String,
    flag: String,
    affiliate: {
      eanCityID: String,
      viatorPage: String,
      carRental: lanSchema
    },
    publish: lanBoolSchema
  }, {collection: 'cities', timestamps: true}
);
module.exports = citySchema;