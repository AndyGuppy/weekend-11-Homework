// make a request
var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = callback;
  request.send();
}

// initial request response
var requestComplete = function(){
  if (this.status !== 200) return;
    var jsonString = this.responseText;
    var eolData = JSON.parse(jsonString);
    var idString = eolData.results[0].link
    var specieId = idString.substring(idString.indexOf("/",8)+1,idString.indexOf("?",idString.indexOf("/",8)))
    console.log("Encyclopedia of Life ID search complete, id Returned = " + specieId)
    console.log("attempting to pull species info.....")
    //make a second request to E.O.L  for information on ID xxxxxx
    var url = 'http://eol.org/api/pages/1.0.json?batch=false&id=' + specieId+ '&images_per_page=4&images_page=4&videos_per_page=0&videos_page=0&sounds_per_page=0&sounds_page=0&maps_per_page=1&maps_page=1&texts_per_page=2&texts_page=1&iucn=false&subjects=overview&licenses=all&details=true&common_names=true&synonyms=true&references=true&taxonomy=true&vetted=0&cache_ttl=&language=en'
    console.log("..from...." + url)
    makeRequest(url, getInfoBack);
    
}

var getInfoBack = function(){
  if (this.status !== 200) return;
    var jsonString = this.responseText;
    //eolData is the dataobject returne from E.O.L
    var eolData = JSON.parse(jsonString);
    var p = document.createElement('p');
    var h1 = document.createElement('h1');
    var h2 = document.createElement('h2');
    //empty array of images
    var images =[];

    mainContainer = document.getElementById("main-container")
    
    h1.innerHTML =specie // Species as header
    h2.innerHTML =eolData.scientificName // scientific name as subheader
    p.innerHTML= eolData.dataObjects[0].description; // species descriptive info

    //Itterate through elements of dataobject and looking for images to add to array
    for (var i=0; i < eolData.dataObjects.length; i++) {
      objectType = eolData.dataObjects[i].mimeType;
      mediaURL = eolData.dataObjects[i].mediaURL;

      if(objectType === "image/jpeg"){
        images.push(eolData.dataObjects[i].mediaURL)
      }
    };
    mainContainer.appendChild(h1);
    mainContainer.appendChild(h2);
    mainContainer.appendChild(p);
    getSelectedImages(images)
}

// display the array of images into a table 3 wide
var getSelectedImages = function(images) {
  var columns = 3, l = images.length, i,
  table = document.createElement('table'),
  tbody = table.appendChild(document.createElement('tbody')),
  tr, td;
  album = document.getElementById("album")
  console.log("qty of images found - " + l);

  // itterate through the images adding to the table
  for( i=0; i<l; i++) {
    var img = document.createElement('img');
    if( i % columns == 0) tr = tbody.appendChild(document.createElement('tr'));
     tr.appendChild(document.createElement('td'))
     div = document.createElement('div')
     div.id = "image";
      
     img.src = images[i]
     img.style = "width:180px;height:130px" ;
    tr.appendChild(img)
   }
   console.log("Images added - all done !" );
   album.appendChild(tbody);

}

var getSelectedSpecie= function(specie) {

  //Make a request to the encyclopedia of life for an ID for the species and call requestComplete on response
  var url = 'http://eol.org/api/search/1.0.json?q=' + specie + '&page=1&exact=false&filter_by_taxon_concept_id=&filter_by_hierarchy_entry_id=&filter_by_string=&cache_ttl=';
  makeRequest(url, requestComplete);


  
}

var populateList= function(species){

  //create a drop down 
  select = document.createElement("SELECT");
  //hook the main container
  mainContainer = document.getElementById("main-container")
  //add the select to the main-container
  mainContainer.appendChild(select)

//itertate through the species array populating the drop down box
  for( specie in species) {
    select.add( new Option( species[specie] ) );
  };

//when drop down is selected call getSelectedSpecies
  select.onchange = function(){
    specie = select.value
    getSelectedSpecie(select.value)};
}

// Global Variable
var specie 

//App
var app = function(){
var speciesList = [];
console.log("loading up CVS file intoDropdown")
// Papa.parse is a CSV manipulation plug in
Papa.parse('./britishlist.csv', {
download: true,
  //each step add the specie to the specieslist
  step: function(row) {
    speciesList.push(row.data[0][1]);
  },
  // on completion call pupulateList
  complete: function() {
    populateList(speciesList) ;
  }
  
});

}

window.onload = app;