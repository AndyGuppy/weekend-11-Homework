// make a request
var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
}

// request response
var requestComplete = function(){
  if (this.status !== 200) return;
    var jsonString = this.responseText;
    var eolData = JSON.parse(jsonString);
    var country = eolData[0];

    console.log(eolData);
}

var getSelectedSpecie= function(specie) {

  var search = document.querySelector('SELECT').value;
  console.log(specie)
  var url = 'http://eol.org/api/search/1.0.json?q=' + specie + '&page=1&exact=false&filter_by_taxon_concept_id=&filter_by_hierarchy_entry_id=&filter_by_string=&cache_ttl=';

  var back =makeRequest(url, requestComplete);
  console.log(back)
}

var populateList= function(species){

  select = document.createElement("SELECT");
  mainContainer = document.getElementById("main-container")
  // select = document.getElementById( 'species' );
  console.log('inside populate')
  console.log(species[1]);

  mainContainer.appendChild(select)

  for( specie in species) {
    select.add( new Option( species[specie] ) );
  };

  select.onchange = function(){getSelectedSpecie(select.value)};
}



var app = function(){

var item;
var species = [];
var common;
Papa.parse('./britishlist.csv', {
download: true,
  step: function(row) {

    species.push(row.data[0][1]);
    // console.log("Common name -- " + row.data[0][1] + " ( " + row.data[0][2] + " )");
  },
  complete: function() {
    console.log("All done!");
    populateList(species) ;
  }
  
});
 
  // var url = "https://avibase.bsc-eoc.org/checklist.jsp?lang=EN&p2=1&list=birdlife&synlang=&region=BR1&version=text&lifelist=&highlight=0";
  // makeRequest(url, requestComplete);
}

window.onload = app;