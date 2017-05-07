var response = require('../../response'),
    mongoose = require('mongoose'),
    Profile = require('../../models/sync/profile');

module.exports = {
  load: function(req, res) {
    Profile.find({}, function (err, profiles) {
      response.handleError(err, res, 500, 'Error fetching profiles', function(){
        response.handleSuccess(res, profiles, 200, 'Fetched profiles list');
      });
    });
  },
  add: function(req, res) {
    let profile = new Profile(req.body);
    profile.save(function (err, result) {
      response.handleError(err, res, 500, 'Error adding profile', function(){
        response.handleSuccess(res, result, 200, 'Added profile');
      });
    });
  }
}