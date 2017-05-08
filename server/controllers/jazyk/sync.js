// Imports documents from cznl to jazyk

var response = require('../../response'),
    mongoose = require('mongoose'),
    async = require('async'),
    wordCount = require('./sync_wordcount'),
    categories = require('./sync_categories'),
    WordModel = require('../../models/jazyk/importword'),
    DetailModel = require('../../models/jazyk/worddetail'),
    CznlWordModel = require('../../models/jazyk/cznlword'),
    WordDetailModels = require('../../models/jazyk/importworddetail'),
    SentenceModel = require('../../models/jazyk/sentence'),
    CountModel = require('../../models/jazyk/count');

// connect to cznl
const cznlUri = 'mongodb://127.0.0.1:27017/km-cznl',
      jazykUri = 'mongodb://127.0.0.1:27017/km-jazyk',
      countUri = 'mongodb://127.0.0.1:27017/km-wordcounts',
      cznlConn = mongoose.createConnection(cznlUri),
      jazykConn = mongoose.createConnection(jazykUri),
      countConn = mongoose.createConnection(countUri),
      cznlModel = cznlConn.model('Word', CznlWordModel),
      jazykWordModel = jazykConn.model('Word', WordModel),
      jazykDetailModel = jazykConn.model('Detail', DetailModel),
      /*
      jazykNounModel = jazykConn.model('Noun', WordDetailModels.noun),
      jazykVerbModel = jazykConn.model('Verb', WordDetailModels.verb),
      jazykPrepositionModel = jazykConn.model('Preposition', WordDetailModels.preposition),
      jazykAdjectiveModel = jazykConn.model('Adjective', WordDetailModels.adjective),
      */
      jazykSentenceModel = jazykConn.model('Sentence', SentenceModel),
      countModelNl = countConn.model('Count', CountModel, 'nl'),
      countModelCs = countConn.model('Count', CountModel, 'cs');
let addedWords = [], alteredWords = [];
const allowedCategories = categories.allowedCategories();
const allowedTags = allowedCategories.map(cat => cat.legacy);

let wordCnt = 0;

let compareWordDocs = function(req, res, callback) {
  console.log('comparing docs (excluding sentences)');
  cznlModel.count({tpe:{$ne:'zin'}}, function(err, cznlTotal) {
    jazykWordModel.count({}, function(err, jazykTotal) {
      callback(err, {cznl:cznlTotal, jazyk:jazykTotal});
    });
  });
}

let compareSentenceDocs = function(req, res, callback) {
  console.log('comparing docs (only sentences)');
  cznlModel.count({tpe:'zin'}, function(err, cznlTotal) {
    jazykSentenceModel.count({}, function(err, jazykTotal) {
      callback(err, {cznl:cznlTotal, jazyk:jazykTotal});
    });
  });
}

let removeDocs = function(req, res, callback) {
  console.log('removing cs-cz words + cs details + nl details');
  jazykWordModel.remove({lanPair:'cs-cz', docTpe:'wordpair'}, function(err, cznlWords) {
    jazykWordModel.remove({lan:'cs', docTpe:'details'}, function(err, cznlDetailsCz) {
      jazykWordModel.remove({lan:'nl', docTpe:'details'}, function(err, cznlDetailsNl) {
        callback(err, {wordpairs: cznlWords, details: {cz: cznlDetailsCz, nl: cznlDetailsNl}});
      });
    });
  });
}

let addWordDocs = function(req, res, callback) {
  console.log('adding words');
  addedWords = [];
  cznlModel.find({tpe:{$ne:'zin'}}, {tpe:1, nl:1, cz:1, nlP:1, czP:1, categories:1}, function(err, cznlWords) {
    //cznlWords = cznlWords.slice(0, 500);
    async.eachSeries(cznlWords, addWord, function (err) {
      callback(err, {added:addedWords.length});
    });
  });
}

let addSentenceDocs = function(req, res, callback) {
  console.log('adding sentences');
  addedSentences = [];
  cznlModel.find({tpe:'zin'}, {nl:1, cz:1}, function(err, cznlSentences) {
    async.eachSeries(cznlSentences, addSentence, function (err) {
      callback(err, {added:addedSentences.length});
    });
  });
}

/*
let updateAltWords = function(callback) {
  console.log('Updating alt words');
  jazykWordModel.find({docTpe: "wordpair"}, {'nl.altLegacy':1, 'cs.altLegacy':1}, function(err, altwords) {
    async.eachSeries(altwords, getAltArray, function (err) {
      callback(err, {altered:alteredWords.length});
    });
  })
}

let getAltArray = function(word, callback) {
  let words = [];
  if (word.nl.altLegacy) {
    let altWords = word.nl.altLegacy.split(';');
    altWords = altWords.map(wordItem => {return {word:wordItem.trim(), _id:word._id, lan:'nl'}});
    words = words.concat(altWords);
  }
  if (word.cs.altLegacy) {
    let altWords = word.cs.altLegacy.split(';');
    altWords = altWords.map(wordItem => {return {word:wordItem.trim(), _id:word._id, lan:'cz'}});
    words = words.concat(altWords);
  } 

  if (words.length > 0) {
    async.eachSeries(words, updateAltWord, function (err) {
      callback(err);
    });
  } else {
    callback(null);
  }
}
*/

let fetchGenusArticle = function(lan, word, callback) {
  query = lan === 'nl' ? {'nl.word':word.word} : {'cz.word':word.word};
  cznlModel.findOne(query, {}, function(err, cznlWord) {
    let genusArticle = {};
    if (cznlWord && cznlWord.tpe === 'noun') {
      if (lan === 'nl') {
        if (cznlWord.nl.article) {
          genusArticle.article = cznlWord.nl.article;
        }
      } else {
        if (cznlWord.cz.genus) {
          genusArticle.genus = cznlWord.cz.genus;
        }
      }
    } else {
      // console.log('Word not found:', word.word);
    }
    callback(err, genusArticle);
  })
}
/*
let saveAltWords = function(lan, word, countData, wordData, callback) {
  key = lan + '.alt';
  legacyKey = lan + '.altLegacy';
  altObj = {
          word: word.word,
          wordCount: countData.wordCount,
          score: countData.score
        }
  if (wordData.genus) {
    altObj.genus = wordData.genus;
  }
  if (wordData.article) {
    altObj.article = wordData.article;
  }

  jazykWordModel.findOneAndUpdate(
    {_id:word._id},
    {
      $addToSet: {
        [key]: altObj
      },
      $unset:{[legacyKey]:""}
    },
    function(err,result){
      callback(err);
    }
  )
}
let updateAltWord = function(word, callback) {
  const lan = word.lan === 'nl' ? 'nl' : 'cs';
  const model = lan === 'nl' ? countModelNl : countModelCs;
  wordCount.getWordCount(word.word, model, function(err, countData){
    //Fetch genus (cs) or article (en)
    fetchGenusArticle(lan, word, function(err, wordData) {
      saveAltWords(lan, word, countData, wordData, function(err){
        callback(err);
      })
    });
  });
}
*/

let addWord = function(word, callback) {
  //console.log('Trying to add word', word);
  jazykWordModel.findOne({_id:word._id}, {}, function(err, jazykWord) {
    if (!jazykWord) {
      // console.log('Adding word', ++wordCnt, word.nl.word);

      addNewWord(word, callback);
    } else {
      callback(err)
    }
  })
}

let addSentence = function(sentence, callback) {
  jazykSentenceModel.findOne({_id:sentence._id}, {}, function(err, jazykSentence) {
    if (!jazykSentence) {
      addNewSentence(sentence, callback);
    } else {
      callback(err)
    }
  })
}


let addNewWord = function(word, callback) {
  //Create new word
  let newWord = {
    _id: word._id,
    wordTpe: word.tpe,
    lanPair: ['nl-nl', 'cs-cz']
  }

  //Add word data
  let nlword = addWordData(word.nl);
  newWord.nl = nlword;
  let csword = addWordData(word.cz);
  newWord.cs = csword;


  //Add word details
  let newWordDetailNl = getWordDetail(word, 'nl');
  let newWordDetailCs = getWordDetail(word, 'cz');
  let newWordDetailCsP = getWordDetail(word, 'czP');
  let newWordCsP;

  //Add tags
  if (word.categories){
    tags = word.categories.filter(cat => allowedTags.filter(atag => atag === cat).length > 0);
    if (tags && !newWordDetailNl) {
      newWordDetailNl = getEmptyWordDetail(word, 'nl');
    }
    newWordDetailNl.tags = tags;
  }

  if (newWordDetailCsP) {
    newWordCsP = {
      wordTpe: word.tpe,
      lanPair: ['nl-nl', 'cs-cz']
    }

    //Add word data
    let nlword = addWordData(word.nl);
    newWordCsP.nl = nlword;
    let csword = addWordData(word.czP);
    newWordCsP.cs = csword;
  }

  //console.log('adding word', newWord);
  //console.log('adding details', newWordDetailNl, newWordDetailCs, newWordDetailCsP);
  
  // Add Score & word count for nl word
  wordCount.getWordCount(newWord.nl.word, countModelNl, function(err, countData){
    if (countData.score > 0 && !newWordDetailNl) {
      //Create empty detail doc
      newWordDetailNl = getEmptyWordDetail(word, 'nl');
    }
    if (newWordDetailNl) {
      newWordDetailNl.wordCount = countData.wordCount;
      newWordDetailNl.score = countData.score;
    }
    /*
    if (newWordCsP) {
      newWordCsP.nl.wordCount = countData.wordCount;
      newWordCsP.nl.score = countData.score;
    }
    */
    // Get word count for all words cz
    wordCount.getWordCount(newWord.cs.word, countModelCs, function(err, countData){
      if (countData.score > 0 && !newWordDetailCs) {
        //Create empty detail doc
        newWordDetailCs = getEmptyWordDetail(word, 'cz');
      }
      if (newWordDetailCs) {
        newWordDetailCs.wordCount = countData.wordCount;
        newWordDetailCs.score = countData.score;
      }
      // Get word count for all words czP
      let w = newWordCsP ? newWordCsP.cs.word : null;
      wordCount.getWordCount(w, countModelCs, function(err, countData){
        if (w) {
          //console.log('csp', w, newWordDetailCsP, newWordDetailCs);
          if (countData.score > 0 && !newWordDetailCsP) {
            //Create empty detail doc
            newWordDetailCsP = getEmptyWordDetail(w, 'czP');
          }
          if (newWordDetailCsP) {
            newWordDetailCsP.wordCount = countData.wordCount;
            newWordDetailCsP.score = countData.score;
          }
        }

        //Save detail Nl
        if (newWordDetailNl) {
          //detailModel = getModel(newWordDetailNl.tpe);
          jazykDetailModel.create(newWordDetailNl, function (err, result) {
            if (!err) {
              // console.log('Added to jazyk NL Detail:', newWordDetailNl);
              /*
              newWord.nl.detailId = result._id;
              if (newWordCsP) {
                newWordCsP.nl.detailId = result._id;
              }
              */
              // Save detail Cs
              if (newWordDetailCs) {
                saveCSDetail(newWordDetailCs, newWordDetailCsP, newWord, newWordCsP, word, function(err){
                  callback(err);
                })
              } else {
                //console.log('no detail cs for', word);
                callback(null);
              }
            }
          });
        } else {
          // console.log('no worddetail nl');
          // Save detail Cs
          if (newWordDetailCs) {
            saveCSDetail(newWordDetailCs, newWordDetailCsP, newWord, newWordCsP, word, function(err){
              callback(err);
            })
          } else {
            // console.log('NO WORD DETAIL CS');
            saveDocs(newWord, newWordCsP, word, function(err){
              callback(err);
            })
          }
        }
      });
    });
  });
}

let saveCSDetail = function(newWordDetailCs, newWordDetailCsP, newWord, newWordCsP, word, callback) {
  //detailModel = getModel(newWordDetailCs.tpe);
  jazykDetailModel.create(newWordDetailCs, function (err, result) {
    if (!err) {
      // console.log('Added to jazyk CS Detail:', newWordDetailCs);
      /*
      newWord.cs.detailId = result._id;
      if (newWordCsP) {
        newWordCsP.cs.detailId = result._id;
      }
      */
      //saved both nl & cs detail, so I can save cs word
      if (!newWordDetailCsP) {
        saveDocs(newWord, newWordCsP, word, function(err){
          callback(err);
        })
      } else {
        jazykDetailModel.create(newWordDetailCsP, function (err, result) {
          if (!err) {
            saveDocs(newWord, newWordCsP, word, function(err){
              callback(err);
            });
          } else {
            console.log('failed to add word CSP Detail', newWordDetailCsP);
            console.log(err);
            callback(err);
          }
        });
      }
    } else {
      console.log('failed to add word CS Detail', newWordDetailCs);
      console.log(err);
      callback(err);
    }
  });
}

let saveDocs = function(newWord, newWordCsP, word, callback) {
  jazykWordModel.create(newWord, function (err, result) {
    if (!err) {
      // console.log('Added to jazyk CS / NL:', addedWords.length, newWord.nl.word);
      addedWords.push(word);
      //if there is a Csp wordpair, save this as well
      if (newWordCsP) {
        jazykWordModel.create(newWordCsP, function (err, result) {
          if (!err) {
            // console.log('Added to jazyk CSP / NL:', newWordCsP.nl.word);
          } else {
            console.log('failed to add word Pf', newWordCsP);
            console.log(err);
          }
        });
        callback(err);
      } else {
        callback(null);
      }
    } else {
      console.log('failed to add word', newWord);
      console.log(err);
      callback(err);
    }
  })
}
/*
let getModel = function(tpe) {
  let model = jazykWordModel;

  switch (tpe) {
    case 'noun':
      model = jazykNounModel;
    break;
    case 'preposition':
      model = jazykPrepositionModel
    break;
    case 'verb':
      model = jazykVerbModel
    break;
  }

  return model;
}
*/

let addWordData = function(word) {
  let newlanword = {
    word: word.word,
  }
  if (word.otherwords) {
    reg = new RegExp(',', 'g');
    //newlanword.altLegacy = word.otherwords.replace(reg, ';');
    newlanword.alt = word.otherwords.replace(reg, ';');
  }
  if (word.hint) {
    newlanword.hint = word.hint;
  }
  if (word.info) {
    newlanword.info = word.info;
  }
  return newlanword;
}

let getWordDetail = function(word, lan) {
  const lanWord = word[lan];
  let add = false;
  if (!lanWord) { return null; }

  newdetails = {
    word: lanWord.word,
    lan: lan === 'nl' ? 'nl' : 'cs',
    wordTpe: word.tpe
  };
  switch (word.tpe) {
    case 'noun':
      
      newdetails.tpe = 'noun';
      if (lanWord.article) {add = true;newdetails.article = lanWord.article;}
      if (lanWord.genus) {add = true;newdetails.genus = lanWord.genus;}
      if (lanWord.plural) {add = true;newdetails.plural = lanWord.plural;}
      if (lanWord.diminutive) {add = true;newdetails.diminutive = lanWord.diminutive;}
    break;
    case 'prep':
      newdetails.tpe = 'preposition';
      if (lanWord.case) {add = true;newdetails.followingCase = lanWord.case;}
    break;
    case 'verb':
      newdetails.tpe = 'verb';
      if (lan==="cz") {
        add = true; 
        if (lanWord.case) {newdetails.followingCase = lanWord.case;}
        if (lanWord.firstpersonsingular) {newdetails.conjugation = [lanWord.firstpersonsingular];}
        
        if (word.perfective) {
          newdetails.aspect = "perfective";
        } else {
          // Add imperfective word
          newdetails.aspect = "imperfective";
          if (word.czP && word.czP.word) {
            newdetails.aspectPair = word.czP.word;
          }
        }
      } else if (lan === "czP") {
        add = true;
        if (lanWord.case) {newdetails.followingCase = lanWord.case;}
        if (lanWord.firstpersonsingular) {newdetails.conjugation = [lanWord.firstpersonsingular];}
        newdetails.aspect = "perfective";
        if (word.cz && word.cz.word) {
          newdetails.aspectPair = word.cz.word;
        }
      }
    break;
  }
  return add ? newdetails : null;
}

let getEmptyWordDetail = function(word, lan) {
  const lanWord = word[lan];
  let add = false;
  if (!lanWord) { return null; }

  newdetails = {
    word: lanWord.word,
    lan: lan === 'nl' ? 'nl' : 'cs',
    wordTpe: word.tpe
  };

  return newdetails;
}

let addNewSentence = function(sentence, callback) {
  let newSentence = {
    _id: sentence._id,
    nl: {
      sentence: sentence.nl.word,
    },
    cs: {
      sentence: sentence.cz.word,
    }
  }

  if (sentence.nl.otherwords) {
    newSentence.nl.alt = sentence.nl.otherwords
  }
  if (sentence.nl.hint) {
    newSentence.nl.hint = sentence.nl.hint
  }
  if (sentence.nl.info) {
    newSentence.nl.info = sentence.nl.info
  }
  if (sentence.cz.otherwords) {
    newSentence.cs.alt = sentence.cz.otherwords
  }
  if (sentence.cz.hint) {
    newSentence.cs.hint = sentence.cz.hint
  }
  if (sentence.cz.info) {
    newSentence.cs.info = sentence.cz.info
  }

  // Get word count for all words cz
  wordCount.getWordCount(newSentence.cs.sentence, countModelCs, function(err, countData){
    newSentence.cs.wordCount = countData.wordCount;
    newSentence.cs.score = countData.score;
    
    // Get word count for all words nl
    wordCount.getWordCount(newSentence.nl.sentence, countModelNl, function(err, countData){
      newSentence.nl.wordCount = countData.wordCount;
      newSentence.nl.score = countData.score;

      //Insert new sentence
      jazykSentenceModel.create(newSentence, function (err, result) {
        if (!err) {
          console.log('Added to jazyk:', addedSentences.length, newSentence.nl.sentence);
          addedSentences.push(newSentence);
        } else {
          console.log('failed to add sentence', newSentence);
          console.log(err);
        }
        callback(err);
      });
    });
  });
}

module.exports = {
  compareWords : function(req, res) {
    compareWordDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error comparing words', function(){
        response.handleSuccess(res, result, 200, 'Compared words');
      });
    })
  },
  compareSentences : function(req, res) {
    compareSentenceDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error comparing sentences', function(){
        response.handleSuccess(res, result, 200, 'Compared sentences');
      });
    })
  },
  addWords : function(req, res) {
    addWordDocs(req, res, function(err, result) {
      console.log('added all words!', result);
      //updateAltWords(function(err, result) {
        //console.log('updated all alt words!', result);
        response.handleError(err, res, 500, 'Error adding words', function(){
          response.handleSuccess(res, result, 200, 'added words');
        });
      //});
    });
  },
  addSentences : function(req, res) {
    addSentenceDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error adding sentences', function(){
        response.handleSuccess(res, result, 200, 'added sentences');
      });
    });
  },
  removeWords : function(req, res) {
    removeDocs(req, res, function(err, result) {
      response.handleError(err, res, 500, 'Error removing words', function(){
        response.handleSuccess(res, result, 200, 'Removed words');
      });
    });
  }
}
