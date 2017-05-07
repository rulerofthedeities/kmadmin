var mongoose = require('mongoose'),
    response = require('../../response'),
    cityModel = require('../../models/avc/city');
// connect to avc db 
const avcUri = 'mongodb://127.0.0.1:27017/avc',
      avcConn = mongoose.createConnection(avcUri),
      City = avcConn.model('City', cityModel, "cities");

module.exports = {
  getCityList: function(req, res) {
    const lan = req.params.lan,
          aliasKey = 'alias.' + lan,
          publishKey = 'publish.' + lan;
    City.find({[aliasKey]:{$exists:true},[publishKey]:true}, {_id:0, 'name.en':1,'alias.en':1}, function (err, cities) {
      response.handleError(err, res, 500, 'Error fetching city list', function(){
        response.handleSuccess(res, cities, 200, 'Fetched city list');
      });
    });
  },
  getCity: function(req, res) {
    const lan = req.params.lan;
    const city = req.params.city;
    const pipeline = [];

    pipeline.push({$match:{'alias.en': city}});
    pipeline.push({$project:{
      lan: {$literal: lan},
      name: '$name.' + lan,
      localName: '$name.local',
      alias: '$alias.' + lan,
      country: '$country.name.' + lan,
      state: {
        name: '$state.name.' + lan,
        code: '$state.code.' + lan
      },
      intro: '$intro.' + lan,
      icon: '$icon.fileName',
      flag: 1,
      pos: 1,
      timezone: {
        offset: 1, 
        code: '$timezone.code.' + lan,
        name: '$timezone.name.' + lan,
        zone: 1
      },
      currency: {
        name: '$currency.name.' + lan,
        code: 1
      },
      altitude: 1,
      coordinates: 1,
      location: {
        descr: '$location.descr.' + lan,
        img: 1
      },
      affiliate: {
        eanCityID: 1,
        viatorPage:1,
        carRental: '$affiliate.carRental.' + lan
      },
      zoom: '$map.zoom',
      publish: '$publish.' + lan,
      language: '$language.' + lan
    }});

    City.aggregate(pipeline, function(err, docs) {
      response.handleError(err, res, 500, 'Error fetching city', function(){
        response.handleSuccess(res, docs[0], 200, 'Fetched city');
      });
    });
  },
  updateCity: function(req, res) {
    const city = req.body;
    const cityId = new mongoose.Types.ObjectId(city._id);
    const lan = city.lan;
    let update = {}, enUpdate = {}, stateUpdate = {};
    

    update = {
      ['alias.' + lan]: city.alias,
      ['name.' + lan]: city.name,
      ['state.name.' + lan]: city.stateName,
      ['state.code']: city.stateCode,
      ['country.name.' + lan]: city.country,
      ['currency.name.' + lan]: city.currencyName,
      ['timezone.code.' + lan]: city.timezoneCode,
      ['timezone.name.' + lan]: city.timezoneName,
      ['language.' + lan]: city.language,
      ['location.descr.' + lan]: city.locationDescr,
      ['affiliate.carRental.' + lan]: city.carRental,
      ['intro.' + lan]: city.intro,
      ['publish.' + lan]: city.isPublish
    }

    if (lan === 'en') {
      enUpdate = {
        'icon.fileName': city.icon,
        'pos.coordinates': city.location.split(','),//.map(point => parseFloat(point)),
        'altitude.m': parseInt(city.altitudeMeter),
        'altitude.ft': parseInt(city.altitudeFt),
        'timezone.offset': city.timezoneOffset,
        'timezone.zone': city.timezoneZone,
        'location.img': city.locationImg,
        'map.zoom': city.zoom,
        'name.local': city.localName,
        'coordinates': city.coordinates,
        'flag': city.flag,
        'affiliate.eanCityID': city.eanCityID,
        'affiliate.viatorPage': city.viatorPage
      }
    } 
    const fullUpdate = Object.assign(update, enUpdate);
    // const fullUpdate = { ...update, ...enUpdate }; //ES7

    City.findOneAndUpdate(
      {_id: cityId},
      {$set: fullUpdate}, function(err, result) {
        response.handleError(err, res, 500, 'Error updating city', function(){
          response.handleSuccess(res, result, 200, 'Updated city');
        });
      }
    );
      
  }
}