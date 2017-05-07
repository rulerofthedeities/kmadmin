var response = require('../../response'),
    connections = require("./connections"),
    mongoose = require('mongoose'),
    async = require('async'),
    MongoClient = mongoose.mongo.MongoClient;

let connectToMongo = function(params, tpe, callback) {
    const connId = mongoose.Types.ObjectId(params['conn' + tpe]);
    let dbName = params.db;

    // fetch connection
    connections.loadOne(connId, function(err, connection) {
      let user = '';
      let authDb = '';
      if (!err) {
        //Fetch user name and password
        if (connection.authentication) {
          user = connection.authentication.userName + ':' + connection.authentication.password + '@';
          authDb = connection.authentication.authDb;
          dbName = '';
        }

        /*** TMP ***/
        if (tpe.toLowerCase() === 'tgt' && authDb === '') {
          dbName = "test-cznl";
        }

        const uri = 'mongodb://' + user + connection.server + ':' + connection.port + '/' + (dbName ? dbName : authDb);
        //console.log('connecting to', uri);

        MongoClient.connect(uri, function(err, db) {
          callback(err, db);
        });

      } else {
        callback(err, null);
      }
    });
  };

  let fetchDocs = function(params, res, tpe, callback) {
    connectToMongo(params, tpe, function(err, db) {
      response.handleError(err, res, 500, 'Error connecting to mongodb', function(){
        const collName = params.coll;
        db.collection(collName).find({}, {}, {sort:{_id:1}}).toArray(function(err, docs) {
          response.handleError(err, res, 500, 'Error loading Ids', function(){
            callback(err, docs);
            db.close();
          });
        });
      });
    });
  }

  let addDocs = function(params, docs, res, tpe, callback) {
    //convert _id string to objectId
    docs.forEach(doc => {doc._id = mongoose.Types.ObjectId(doc._id);});
    //Add docs to database
    connectToMongo(params, tpe, function(err, db) {
      response.handleError(err, res, 500, 'Error connecting to mongodb', function(){
        const collName = params.coll;
        db.collection(collName).insert(docs, {multi:true}, function(err, result) {
          response.handleError(err, res, 500, 'Error adding docs', function(){
            callback(err, result);
            db.close();
          });
        });
      });
    });
  }

  let updateDocs = function(params, docs, res, tpe, callback) {
    connectToMongo(params, tpe, function(err, db) {
      response.handleError(err, res, 500, 'Error connecting to mongodb', function(){
        const collName = params.coll;
        docs.forEach(doc => {
            //convert _id string to objectId
            doc._id = mongoose.Types.ObjectId(doc._id);
        });
        let updateDoc = function(doc, callback) {
          db.collection(collName).update({_id: doc._id}, doc, {}, function(err, result) {
            callback(err);
          });
        }
        //Update docs in database
        async.eachSeries(docs, updateDoc, function (err) {
          callback(err);
          db.close();
        });
      });
    });
  }

  let deleteDoc = function(params, res, tpe, callback) {
    connectToMongo(params, tpe, function(err, db) {
      response.handleError(err, res, 500, 'Error connecting to mongodb', function(){
        const collName = params.coll;
        const docId = mongoose.Types.ObjectId(params.id);
        //console.log('deleting', docId);
        
        db.collection(collName).remove({_id: docId}, function(err, result) {
          callback(err);
        });
        
      });
    });

  }

module.exports = {
  compare: function(req, res) {
    // console.log('fetching docs from source');
    fetchDocs(req.params, res, 'Src', function(err, srcDocs) {
      response.handleError(err, res, 500, 'Error fetching docs from source', function(){
        // console.log('fetching docs from target');
        fetchDocs(req.params, res, 'Tgt', function(err, tgtDocs) {
          response.handleError(err, res, 500, 'Error fetching docs from target', function(){
            const max = Math.max(srcDocs.length, tgtDocs.length);
            const newDocs = [];
            const updatedDocs = [];
            const removedDocs = [];
            let src, tgt;
            let i = 0, j = 0;
            while(i < max || j < max) {
              if (!tgtDocs[j]) {
                newDocs.push(srcDocs[i]);
                i++;j++;
              } else {
                src = JSON.stringify(srcDocs[i]);
                tgt = JSON.stringify(tgtDocs[j]);
                if (srcDocs[i]._id.toString() === tgtDocs[j]._id.toString()) {
                  if (src != tgt) {
                    updatedDocs.push(srcDocs[i]);
                  }
                  i++;j++;
                } else {
                  if (srcDocs[i]._id > tgtDocs[j]._id) {
                    removedDocs.push(tgtDocs[j]);
                    j++;
                  } else if  (srcDocs[i]._id < tgtDocs[j]._id){
                    newDocs.push(srcDocs[i]);
                    i++;
                  }
                }
              }
            }
            // console.log('New docs', newDocs.length);
            // console.log('Updated docs', updatedDocs.length);
            // console.log('Removed docs', removedDocs.length);
            response.handleSuccess(res, {
              total:{source:srcDocs.length, target: tgtDocs.length},
              docs:{toUpdate: updatedDocs, toAdd:newDocs, toDelete:removedDocs}
            }, 200, 'Fetched docs from source and target');
          });
        });
      });
    });
  },
  add : function(req, res) {
    addDocs(req.params, req.body, res, 'Tgt', function(err, result) {
      response.handleError(err, res, 500, 'Error adding docs to target', function(){
        response.handleSuccess(res, result.insertedCount, 200, 'Added docs to target');
      });
    });
    
  },
  update : function(req, res) {
    updateDocs(req.params, req.body, res, 'Tgt', function(err) {
      response.handleError(err, res, 500, 'Error updating docs on target', function(){
        response.handleSuccess(res, 'ok', 200, 'Updated docs on target');
      });
    });
  },
  delete : function(req, res) {
    deleteDoc(req.params, res, 'Tgt', function(err) {
      response.handleError(err, res, 500, 'Error deleting doc from target', function(){
        response.handleSuccess(res, 'ok', 200, 'Deleted doc from target');
      });
    }); 
  }
}
