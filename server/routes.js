var path = require("path"),
    sync_connections = require("./controllers/sync/connections"),
    sync_profiles = require("./controllers/sync/profiles"),
    sync_databases = require("./controllers/sync/databases"),
    sync_sync = require("./controllers/sync/sync"),
    jazyk_sync = require("./controllers/jazyk/sync"),
    jazyk_edit = require("./controllers/jazyk/edit"),
    jazyk_config = require("./controllers/jazyk/config"),
    avc_cities = require("./controllers/avc/cities"),
    avc_items = require("./controllers/avc/items");

module.exports.initialize = function(app, router) {

/*** MONGOSYNC ***/
  router.get('/sync/connections', sync_connections.load);
  router.put('/sync/connections', sync_connections.add);

  router.get('/sync/databases/:id', sync_databases.load);
  router.get('/sync/collections/:id/:name', sync_databases.load);
  
  router.get('/sync/compare/:connSrc/:connTgt/:db/:coll', sync_sync.compare);
  router.post('/sync/add/:connTgt/:db/:coll', sync_sync.add);
  router.put('/sync/update/:connTgt/:db/:coll', sync_sync.update);
  router.delete('/sync/delete/:connTgt/:db/:coll/:id', sync_sync.delete);

  router.get('/sync/profiles', sync_profiles.load);
  router.post('/sync/profiles/save', sync_profiles.add);

/*** JAZYK ADMIN ***/
  router.get('/jazyk/sync/compare/words', jazyk_sync.compareWords);
  router.get('/jazyk/sync/compare/sentences', jazyk_sync.compareSentences);
  router.get('/jazyk/sync/add/words', jazyk_sync.addWords);
  router.get('/jazyk/sync/add/sentences', jazyk_sync.addSentences);
  router.get('/jazyk/sync/removecz', jazyk_sync.removeWords);

  router.get('/jazyk/wordpairs', jazyk_edit.getWordPairs);
  router.get('/jazyk/worddetails', jazyk_edit.getWordDetails);
  router.get('/jazyk/worddetail/filter', jazyk_edit.getWordDetailByFilter);
  router.get('/jazyk/worddetail/id', jazyk_edit.getWordDetailById);
  router.get('/jazyk/config/lan/:lan', jazyk_config.getLanConfig);
  router.get('/jazyk/wordpair/exists', jazyk_edit.checkWordpairExists);
  router.get('/jazyk/tags', jazyk_edit.getTags);

  router.post('/jazyk/word', jazyk_edit.addWordPair);
  router.post('/jazyk/detail', jazyk_edit.addWordDetail);
  
  router.put('/jazyk/word', jazyk_edit.updateWordPair);
  router.put('/jazyk/detail', jazyk_edit.updateWordDetail);

/*** AVC ADMIN ***/
  router.get('/avc/cities/:lan', avc_cities.getCityList);
  router.get('/avc/city/:city/:lan', avc_cities.getCity);
  router.put('/avc/city/update', avc_cities.updateCity);

  router.get('/avc/items/:city/:lan', avc_items.getItemList);
  router.get('/avc/item/:city/:item/:lan', avc_items.getItem);
  router.put('/avc/item/update', avc_items.updateItem);

  app.use('/api/', router);

  app.use(function (req, res) {
    var home = path.resolve(__dirname + '/../dist/index.html');
    res.sendFile(home);
  });
};
