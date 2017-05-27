const filteredCategories = [
  {legacy: 'accessoires', english: 'accessories', new: 'kleding/accessoires'},
  {legacy: 'afrika', english: 'africa', new: 'geografie/afrika'},
  {legacy: 'amerika', english: 'america', new: 'geografie/amerika'},
  {legacy: 'amfibieën', english: 'amphibians', new: 'dieren/amfibieën'},
  {legacy: 'auto', english: 'car', new: 'dieren/amfibieën'},
  {legacy: 'azië', english: 'asia', new: 'geografie/azië'},
  {legacy: 'badkamer', english: 'bathroom', new: 'huis/badkamer'},
  {legacy: 'beroepen', english: 'professions', new: 'beroepen'},
  {legacy: 'bezoek', english: 'visit', new: 'sociaal/bezoek'},
  {legacy: 'bloemen', english: 'flowers', new: 'natuur/bloemen'},
  {legacy: 'boerderij', english: 'farm', new: 'boerderij'},
  {legacy: 'bomen', english: 'trees', new: 'natuur/bomen'},
  {legacy: 'computer', english: 'computer', new: 'elektronica/computer'},
  {legacy: 'consumentenelektronica', english: 'consumer electronics', new: 'elektronica/consumentenelektronica'},
  {legacy: 'dieren', english: 'animals', new: 'dieren'},
  {legacy: 'drank', english: 'beverages', new: 'voeding/drank'},
  {legacy: 'eten', english: 'food', new: 'voeding/eten'},
  {legacy: 'europa', english: 'europe', new: 'geografie/europa'},
  {legacy: 'familie', english: 'family', new: 'sociaal/familie'},
  {legacy: 'feestdagen', english: 'holidays', new: 'feestdagen'},
  {legacy: 'fiets', english: 'bicyle', new: 'verkeer/fiets'},
  {legacy: 'financiën', english: 'finance', new: 'financiën'},
  {legacy: 'fruit', english: 'fruit', new: 'voeding/fruit'},
  {legacy: 'gaan', english: 'go', new: 'verkeer/gaan'},
  {legacy: 'gebouwen', english: 'buildings', new: 'gebouwen'},
  {legacy: 'gereedschap', english: 'tools', new: 'gereedschap'},
  {legacy: 'getallen', english: 'numbers', new: 'getallen'},
  {legacy: 'gezegde', english: 'proverbs', new: 'uitspraken/gezegden'},
  {legacy: 'gezondheid', english: 'health', new: 'mens/gezondheid'},
  {legacy: 'grammatica', english: 'grammar', new: 'taal/grammatica'},
  {legacy: 'groente', english: 'vegetables', new: 'voeding/groente'},
  {legacy: 'hobbies', english: 'hobbies', new: 'vrijetijd/hobbies'},
  {legacy: 'hotel', english: 'hotel', new: 'vakantie/hotel'},
  {legacy: 'huis', english: 'home', new: 'huis'},
  {legacy: 'huisdieren', english: 'pets', new: 'dieren/huisdieren'},
  {legacy: 'huishouden', english: 'housekeeping', new: 'huis/huishouden'},
  {legacy: 'insecten', english: 'insects', new: 'dieren/insecten'},
  {legacy: 'kamperen', english: 'camping', new: 'vakantie/kamperen'},
  {legacy: 'kantoor', english: 'office', new: 'werk/kantoor'},
  {legacy: 'kantoorbenodigdheden', english: 'office equipment', new: 'werk/kantoor/kantoorbenodigdheden'},
  {legacy: 'kapper', english: 'hairdresser', new: 'kapper'},
  {legacy: 'keuken', english: 'kitchen', new: 'huis/keuken'},
  {legacy: 'kledij', english: 'clothing', new: 'kledij'},
  {legacy: 'kleuren', english: 'colors', new: 'kleuren'},
  {legacy: 'kruiden', english: 'herbs', new: 'voeding/kruiden'},
  {legacy: 'landen', english: 'countries', new: 'geografie/landen'},
  {legacy: 'leger', english: 'army', new: 'leger'},
  {legacy: 'lichaam', english: 'body', new: 'mens/lichaam'},
  {legacy: 'literatuur', english: 'literature', new: 'kunst/literatuur'},
  {legacy: 'luchtvaart', english: 'aviation', new: 'verkeer/luchtvaart'},
  {legacy: 'materialen', english: 'materials', new: 'verkeer/materialen'},
  {legacy: 'media', english: 'media', new: 'media'},
  {legacy: 'meubilair', english: 'furniture', new: 'huis/meubilair'},
  {legacy: 'middeleeuwen', english: 'middle ages', new: 'geschiedenis/middeleeuwen'},
  {legacy: 'muziek', english: 'music', new: 'kunst/muziek'},
  {legacy: 'muziekinstrument', english: 'musical instruments', new: 'kunst/muziek/muziekinstrument'},
  {legacy: 'natuur', english: 'nature', new: 'natuur'},
  {legacy: 'personen', english: 'people', new: 'mens/personen'},
  {legacy: 'planten', english: 'plants', new: 'natuur/planten'},
  {legacy: 'politiek', english: 'politics', new: 'politiek'},
  {legacy: 'post', english: 'post', new: 'post'},
  {legacy: 'recht', english: 'law', new: 'recht'},
  {legacy: 'reizen', english: 'travel', new: 'vakantie/reizen'},
  {legacy: 'relaties', english: 'relations', new: 'sociaal/relaties'},
  {legacy: 'reptielen', english: 'reptiles', new: 'dieren/reptielen'},
  {legacy: 'restaurant', english: 'restaurant', new: 'restaurant'},
  {legacy: 'rivieren', english: 'rivers', new: 'natuur/rivieren'},
  {legacy: 'ruimte', english: 'space', new: 'natuur/ruimte'},
  {legacy: 'scheepvaart', english: 'shipping', new: 'verkeer/scheepvaart'},
  {legacy: 'school', english: 'school', new: 'school'},
  {legacy: 'schoolgerief', english: 'school supplies', new: 'school/schoolgerief'},
  {legacy: 'spel', english: 'games', new: 'vrijetijd/spel'},
  {legacy: 'sport', english: 'sports', new: 'vrijetijd/sport'},
  {legacy: 'steden', english: 'cities', new: 'steden'},
  {legacy: 'talen', english: 'languages', new: 'talen'},
  {legacy: 'tandarts', english: 'dentist', new: 'mens/gezondheid/tandarts'},
  {legacy: 'tijd', english: 'time', new: 'tijd'},
  {legacy: 'treinen', english: 'trains', new: 'verkeer/treinen'},
  {legacy: 'tsjechië', english: 'czechia', new: 'tsjechië'},
  {legacy: 'tuin', english: 'garden', new: 'natuur/tuin'},
  {legacy: 'verkeer', english: 'traffic', new: 'verkeer'},
  {legacy: 'vissen', english: 'fish', new: 'dieren/vissen'},
  {legacy: 'voertuigen', english: 'vehicles', new: 'verkeer/voertuigen'},
  {legacy: 'vogels', english: 'birds', new: 'dieren/vogels'},
  {legacy: 'wapens', english: 'weapons', new: 'wapens'},
  {legacy: 'winkelen', english: 'shopping', new: 'winkelen'},
  {legacy: 'wiskunde', english: 'math', new: 'school/wiskunde'},
  {legacy: 'zoo', english: 'zoo', new: 'dieren/zoo'},
  {legacy: 'zoogdieren', english: 'mammals', new: 'dieren/zoogdieren'},
];
let legacyCategories = filteredCategories.map(category => category.legacy);

let getTranslation = function(tag) {
  let translation = '';
  let cat = filteredCategories.find(cat => cat.legacy === tag);
  if (cat) {
    translation = cat.english;
  } else { 
    console.log('cat not found', tag)
  }
  return translation;
}

module.exports = {
  allowedCategories: function() {return filteredCategories},
  getCategories: function(cats, callback) {
    let categories = [];
    if (cats) {
      let i ;
      cats.forEach(category => {
        i = legacyCategories.indexOf(category);
        if (i > -1){
          categories.push(filteredCategories[i].new);
        }
      })
      //Remove doubles (in sub and in main category)
      let toRemoveCategories = [];
      categories.forEach(category1 => {
        categories.forEach(category2 => {
          if (category2 !== category1){
            if (category1.substring(0, category2.length + 1) === category2 + '/' ) {
              toRemoveCategories.push(category2);
            }
          }
        })
      });
      let categoriesToAdd = [];
      categories.forEach(category => {
        i = toRemoveCategories.indexOf(category);
        if (i < 0){
          categoriesToAdd.push(category);
        }
      })

      callback(categoriesToAdd);
    }
  },
  translateTags: function(tags) {
    return tags.map(tag => getTranslation(tag));
  }
}