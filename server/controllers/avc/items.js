var mongoose = require('mongoose'),
    response = require('../../response'),
    itemModel = require('../../models/avc/item');
// connect to avc db 
const avcUri = 'mongodb://127.0.0.1:27017/avc',
      avcConn = mongoose.createConnection(avcUri),
      Item = avcConn.model('Item', itemModel, "items");

module.exports = {
  getItemList: function(req, res) {
    const lan = req.params.lan,
          city = req.params.city,
          itemKey = 'alias.' + lan;
    Item.find({'city.alias.en': city, [itemKey]:{$exists:true}, title:{$exists:true}}, {_id:0, 'title.en':1, 'alias.en':1, 'isPublished':1, 'isTopAttraction':1}, {sort: {'title.en':1}}, function (err, items) {
      response.handleError(err, res, 500, 'Error fetching item list', function(){
        response.handleSuccess(res, items, 200, 'Fetched item list');
      });
    });
  },
  getItem: function(req, res) {
    const lan = req.params.lan,
          city = req.params.city,
          item = req.params.item,
          pipeline = [];

    pipeline.push({$match:{'alias.en':item, 'city.alias.en': city}});
    pipeline.push({$project:{
      lan: {$literal: lan},
      alias: '$alias.' + lan,
      name: '$title.' + lan,
      subTitle: '$subTitle.' + lan,
      prefix: '$prefix.' + lan,
      description: '$description.' + lan,
      preview: '$preview.' + lan,
      content: '$content.' + lan,
      isPublished: '$isPublished.' + lan,
      pos: 1,
      polyline: 1,
      address: '$address.' + lan,
      address_en: '$address.en',
      location: '$location.' + lan,
      location_en: '$location.en',
      metro: '$metro.' + lan,
      metro_en: '$metro.en',
      websites: 1,
      categories: 1,
      thumb: '$img.thumb',
      photo: '$img.photo',
      isTopAttraction: 1,
      isQuality: 1,
      photos: 1,
      posters: 1,
      traffic: 1
    }});
    
    Item.aggregate(pipeline, function(err, docs) {
      response.handleError(err, res, 500, 'Error fetching item', function(){
        response.handleSuccess(res, docs[0], 200, 'Fetched item');
      });
    });
  },
  updateItem: function(req, res) {
    const item = req.body;
    // console.log('items to update', item);
    const itemId = new mongoose.Types.ObjectId(item._id);
    const lan = item.lan;
    let update = {}, enUpdate = {}, stateUpdate = {}, polylines = [], polyline, pointArr = [];
    if (item.polyline) {
      polyline = item.polyline.split('\n');
      polyline.forEach(point => {
        pointArr = point.split(',');
        pointArr = pointArr.map(latlon => parseFloat(latlon));
        polylines.push(pointArr);
      })
    }
    // console.log(polylines);
    
    update = {
      ['alias.' + lan]: item.alias,
      ['title.' + lan]: item.name,
      ['subTitle.' + lan]: item.subTitle,
      ['description.' + lan]: item.description,
      ['address.' + lan]: item.address,
      ['location.' + lan]: item.location,
      ['metro.' + lan]: item.metro,
      ['preview.' + lan]: item.preview,
      ['content.' + lan]: item.content,
      ['isPublished.' + lan]: item.isPublish
    }
    if (lan === 'en') {
      enUpdate = {
        ['prefix.' + lan]: item.prefix,
        'websites': item.websites.split(';'),
        'categories': item.categories.split(';'),
        'pos.coordinates': item.pos.split(','),//.map(point => parseFloat(point)),
        'isTopAttraction': item.isTopAttraction,
        'isQuality': item.isQuality,
        'img.photo': item.photo,
        'img.thumb': item.thumb
      }
      if (item.polyline) {
        enUpdate['polyline.coordinates'] = polylines;
      }
    }

    const fullUpdate = Object.assign(update, enUpdate);
    // const fullUpdate = { ...update, ...enUpdate }; //ES7

    // console.log(fullUpdate);

    Item.findOneAndUpdate(
      {_id: itemId},
      {$set: fullUpdate}, function(err, result) {
        response.handleError(err, res, 500, 'Error updating item', function(){
          response.handleSuccess(res, result, 200, 'Updated item');
        });
      }
    );
  }
}