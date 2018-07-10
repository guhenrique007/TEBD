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

var indexFilme;

$(document).ready(function() {
//funcao que escolhe o filme e pede pra listar atores do filme x
  $('select.lista-filmes').change(function() {
    var nomeDoFilme = $('select.lista-filmes').val();
    indexFilme = $('select.lista-filmes').index('option');
    console.log(indexFilme);
    indexFilme = indexFilme - 1;
    
    var idFilme = retornaIdFilme(indexFilme);

	
	/*
	 * FILME TÀ SENDO PASSADO NA MÂO
	 * */
    var queryStringFilme = 
      'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+	
      'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
      'SELECT DISTINCT ?subject ?predicate ?object '+
      'WHERE { '+
      '?subject ?predicate ?object '+
      'FILTER(str(?subject) = "http://movieland.com/ufrrj/tebd/#movie/187" ) '+
      '} ';

    var queryStringAtores =
      'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
      'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
      'SELECT DISTINCT ?subject ?predicate ?object '+
      'WHERE { '+
        '?subject j.0:movieId "187" . '+
        '?subject j.0:actorId ?object '+
    '} ';

    printaFilmeJson(queryStringFilme);
    printaAtores(queryStringAtores);

  });

});

function retornaIdFilme(indexFilme){
  
  var queryString =
  'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
        'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
        'SELECT DISTINCT ?subject ?object '+
        'WHERE { ' +
        '?subject ?predicate ?object ' +
        'FILTER(str(?predicate) = "http://movieland.com/ufrrj/tebd/#movieId") '+
        '} ';
   
  fetch('http://localhost:3030/filmes/sparql', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
	      console.log(indexFilme);
	      console.log(json.results.bindings[indexFilme]);
              return json.results.bindings[indexFilme];
          })
}

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
              })
          })
}

//já que eu n posso testar muito vou repetir codigo
function printaFilmeJson(queryString){
  
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
              console.log(json.results.bindings);
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
              json.results.bindings.forEach(element => {

	        var node = document.createElement("LI");
	        var textnode = document.createTextNode(element.object.value + " \n");
	        node.appendChild(textnode);
	        document.getElementsByClassName("atores")[0].appendChild(node);
              })
          })
}

