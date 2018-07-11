var indexFilme;
var vetorFilmeId= [];


$(document).ready(function() {
  var queryString =
  'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
        'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
        'SELECT DISTINCT ?subject ?object '+
        'WHERE { ' +
        '?subject ?predicate ?object ' +
        'FILTER(str(?predicate) = "http://movieland.com/ufrrj/tebd/#title") '+
        '} '
  listaFilmesAjax(queryString);
  
});

 

$(document).ready(function() {
//funcao que escolhe o filme e pede pra listar atores do filme x
  $('select.lista-filmes').change(function() {
    var nomeDoFilme = $('select.lista-filmes').val();
    var filmeId;
    vetorFilmeId.forEach(element => {
      if (element.nome == nomeDoFilme){
          filmeId = element.id;
      }            
    });

   // console.log(filmeId);
	
	/*
	 * FILME TÀ SENDO PASSADO NA MÂO
	 * */
    var queryStringFilme = 
      'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+	
      'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
      'SELECT DISTINCT ?subject ?predicate ?object '+
      'WHERE { '+
      '?subject ?predicate ?object '+
      'FILTER(str(?subject) = "http://movieland.com/ufrrj/tebd/#movie/'+filmeId +'" ) '+
      '} ';

/*
   * FILME TÀ SENDO PASSADO NA MÂO
   * */

    var queryStringAtores =
      'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
      'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
      'SELECT DISTINCT ?subject ?predicate ?object '+
      'WHERE { '+
        '?subject j.0:movieId "'+filmeId +'" . '+
        '?subject j.0:actorId ?object '+
    '} ';

    printaFilmeJson(queryStringFilme);
    printaAtores(queryStringAtores);

  });

});


function listaFilmesAjax(queryString) {
  fetch('http://localhost:3030/filmes/sparql', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
              json.results.bindings.forEach(element => {
                $('select.lista-filmes').append(
                    '<option>' + element.object.value + '</option>');
                  
                  var nomeFilmeId = {"nome":"","id":""};
                  nomeFilmeId.nome = element.object.value;
                  nomeFilmeId.id = element.subject.value.replace( /^\D+/g, '');
                  vetorFilmeId.push(nomeFilmeId);
              })
          })
}

//já que eu n posso testar muito vou repetir codigo
function printaFilmeJson(queryString){
  
   var atributos = [
    'title ',
    'descrição ',
    'id linguagem ',
    'rental duration ',
    'replacemente Cost',
    'movieId ',
    'release year ',
    'lenght ',
    'lastUpdate ',
    'rating ',
    'rental rating ',
    'full text ',
    'special features'
   ]

   var indAtrib = 0;

   fetch('http://localhost:3030/filmes/sparql', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
              //console.log(json.results.bindings);
              json.results.bindings.forEach(element => {
	        var node = document.createElement("LI");
          //console.log(element.object);
          var textnode = document.createTextNode(element.object.value + " \n");
	        node.appendChild(textnode);
	        document.getElementsByClassName("atores")[0].appendChild(node);
              })
          })
}

function printaAtores(queryString){

   fetch('http://localhost:3030/actors_movies/sparql', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
             // console.log(json.results.bindings);
              json.results.bindings.forEach(element => {
		/*console.log('to aqui');
	        console.log(element.object.value);*/
		printaAtor(element.object.value);

              })
          })
}

function printaAtor(atorId){
	
  var queryString= 
   'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
   'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
   'SELECT DISTINCT ?subject ?predicate ?object '+
   'WHERE { '+
   '?subject ?predicate ?object '+
   'FILTER(str(?subject) = "http://movieland.com/ufrrj/tebd/#actor/'+atorId+'" ) '+
   '} ';

   fetch('http://localhost:3030/actors/sparql', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
              //console.log(json.results.bindings);
          var jaEntrou = false;
          json.results.bindings.forEach(element => {

	        var node = document.createElement("a");
          node.setAttribute('href','#');
          node.id = atorId;
          node.onclick = printaId;
	        var textnode = document.createTextNode(element.subject.value.replace( /^\D+/g, '') + " \n");
	        node.appendChild(textnode);
	        if(!jaEntrou){
            document.getElementsByClassName("idAtores")[0].appendChild(node);  
            jaEntrou = true;
          }
          
              
              })
          })
}

function printaId(event){
 var idAtor = event.target.id;
var queryStringAtores =
      'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
      'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
      'SELECT DISTINCT ?subject ?predicate ?object '+
      'WHERE { '+
        '?subject j.0:actorId "'+idAtor+'" . '+
        '?subject j.0:movieId ?object '+
    '} ';

    fetch('http://localhost:3030/actors_movies/sparql', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryStringAtores

        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
              //console.log(json.results.bindings);
              document.write('IDS DOS FILMES QUE O ATOR ATUOU:'+ '<br>' +'<br>');
              json.results.bindings.forEach(element => {
               // console.log(element.object.value);
                var nomeDoAtor;
              
                var info = element.object.value + '<br>';
                var infoCompleta = info;
                document.write(infoCompleta);

              })
              printaAtorCompleto(idAtor);
          })

}

function printaAtorCompleto(idAtor){
  var queryString= 
   'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
   'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
   'SELECT DISTINCT ?subject ?predicate ?object '+
   'WHERE { '+
   '?subject ?predicate ?object '+
   'FILTER(str(?subject) = "http://movieland.com/ufrrj/tebd/#actor/'+idAtor+'" ) '+
   '} ';

   fetch('http://localhost:3030/actors/sparql', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
              //console.log(json.results.bindings);
          var jaEntrou = false;
          document.write('<br>'+'NOME DO ATOR:'+ '<br>' +'<br>');
          json.results.bindings.forEach(element => {

          var node = document.createElement("a");
          node.setAttribute('href','#');
          node.id = idAtor;
          node.onclick = printaId;
          var textnode = document.createTextNode(element.object.value + " \n");
          //console.log(textnode);
          node.appendChild(textnode);
          if(!jaEntrou){
            //document.getElementsByClassName("atores")[0].appendChild(node);
            document.write(element.object.value);  
            //jaEntrou = true;
          }
          
              
              })
          })





}