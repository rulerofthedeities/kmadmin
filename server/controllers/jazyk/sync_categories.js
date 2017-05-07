  const filteredCategories = [
    {legacy: 'accessoires', new: 'kleding/accessoires'},
    {legacy: 'afrika', new: 'geografie/afrika'},
    {legacy: 'amerika', new: 'geografie/amerika'},
    {legacy: 'amfibieën', new: 'dieren/amfibieën'},
    {legacy: 'auto', new: 'dieren/amfibieën'},
    {legacy: 'azië', new: 'geografie/azië'},
    {legacy: 'badkamer', new: 'huis/badkamer'},
    {legacy: 'beroepen', new: 'beroepen'},
    {legacy: 'bezoek', new: 'sociaal/bezoek'},
    {legacy: 'bloemen', new: 'natuur/bloemen'},
    {legacy: 'boerderij', new: 'boerderij'},
    {legacy: 'bomen', new: 'natuur/bomen'},
    {legacy: 'computer', new: 'elektronica/computer'},
    {legacy: 'consumentenelektronica', new: 'elektronica/consumentenelektronica'},
    {legacy: 'dieren', new: 'dieren'},
    {legacy: 'drank', new: 'voeding/drank'},
    {legacy: 'eten', new: 'voeding/eten'},
    {legacy: 'europa', new: 'geografie/europa'},
    {legacy: 'familie', new: 'sociaal/familie'},
    {legacy: 'feestdagen', new: 'feestdagen'},
    {legacy: 'fiets', new: 'verkeer/fiets'},
    {legacy: 'financiën', new: 'financiën'},
    {legacy: 'fruit', new: 'voeding/fruit'},
    {legacy: 'gaan', new: 'verkeer/gaan'},
    {legacy: 'gebouwen', new: 'gebouwen'},
    {legacy: 'gereedschap', new: 'gereedschap'},
    {legacy: 'getallen', new: 'getallen'},
    {legacy: 'gezegde', new: 'uitspraken/gezegden'},
    {legacy: 'gezondheid', new: 'mens/gezondheid'},
    {legacy: 'grammatica', new: 'taal/grammatica'},
    {legacy: 'groente', new: 'voeding/groente'},
    {legacy: 'hobbies', new: 'vrijetijd/hobbies'},
    {legacy: 'hotel', new: 'vakantie/hotel'},
    {legacy: 'huis', new: 'huis'},
    {legacy: 'huisdieren', new: 'dieren/huisdieren'},
    {legacy: 'huishouden', new: 'huis/huishouden'},
    {legacy: 'insecten', new: 'dieren/insecten'},
    {legacy: 'kamperen', new: 'vakantie/kamperen'},
    {legacy: 'kantoor', new: 'werk/kantoor'},
    {legacy: 'kantoorbenodigdheden', new: 'werk/kantoor/kantoorbenodigdheden'},
    {legacy: 'kapper', new: 'kapper'},
    {legacy: 'keuken', new: 'huis/keuken'},
    {legacy: 'kledij', new: 'kledij'},
    {legacy: 'kleuren', new: 'kleuren'},
    {legacy: 'kruiden', new: 'voeding/kruiden'},
    {legacy: 'landen', new: 'geografie/landen'},
    {legacy: 'leger', new: 'leger'},
    {legacy: 'lichaam', new: 'mens/lichaam'},
    {legacy: 'literatuur', new: 'kunst/literatuur'},
    {legacy: 'luchtvaart', new: 'verkeer/luchtvaart'},
    {legacy: 'materialen', new: 'verkeer/materialen'},
    {legacy: 'media', new: 'media'},
    {legacy: 'meubilair', new: 'huis/meubilair'},
    {legacy: 'middeleeuwen', new: 'geschiedenis/middeleeuwen'},
    {legacy: 'muziek', new: 'kunst/muziek'},
    {legacy: 'muziekinstrument', new: 'kunst/muziek/muziekinstrument'},
    {legacy: 'natuur', new: 'natuur'},
    {legacy: 'personen', new: 'mens/personen'},
    {legacy: 'planten', new: 'natuur/planten'},
    {legacy: 'politiek', new: 'politiek'},
    {legacy: 'post', new: 'post'},
    {legacy: 'recht', new: 'recht'},
    {legacy: 'reizen', new: 'vakantie/reizen'},
    {legacy: 'relaties', new: 'sociaal/relaties'},
    {legacy: 'reptielen', new: 'dieren/reptielen'},
    {legacy: 'restaurant', new: 'restaurant'},
    {legacy: 'rivieren', new: 'natuur/rivieren'},
    {legacy: 'ruimte', new: 'natuur/ruimte'},
    {legacy: 'scheepvaart', new: 'verkeer/scheepvaart'},
    {legacy: 'school', new: 'school'},
    {legacy: 'schoolgerief', new: 'school/schoolgerief'},
    {legacy: 'spel', new: 'vrijetijd/spel'},
    {legacy: 'sport', new: 'vrijetijd/sport'},
    {legacy: 'steden', new: 'steden'},
    {legacy: 'talen', new: 'talen'},
    {legacy: 'tandarts', new: 'mens/gezondheid/tandarts'},
    {legacy: 'tijd', new: 'tijd'},
    {legacy: 'trappen van vergelijking', new: 'taal/trappen van vergelijking'},
    {legacy: 'treinen', new: 'verkeer/treinen'},
    {legacy: 'tsjechië', new: 'tsjechië'},
    {legacy: 'tuin', new: 'natuur/tuin'},
    {legacy: 'verkeer', new: 'verkeer'},
    {legacy: 'vissen', new: 'dieren/vissen'},
    {legacy: 'voertuigen', new: 'verkeer/voertuigen'},
    {legacy: 'vogels', new: 'dieren/vogels'},
    {legacy: 'wapens', new: 'wapens'},
    {legacy: 'winkelen', new: 'winkelen'},
    {legacy: 'wiskunde', new: 'school/wiskunde'},
    {legacy: 'zoo', new: 'dieren/zoo'},
    {legacy: 'zoogdieren', new: 'dieren/zoogdieren'},

  ];
let legacyCategories = filteredCategories.map(category => category.legacy)


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
  }
}