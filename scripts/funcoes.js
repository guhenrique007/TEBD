$(document).ready(function() {
  var queryString =
  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
    "PREFIX j.0: <http://movieland.com/ufrrj/tebd/#>"+
    "SELECT DISTINCT ?subject ?object"+
    "WHERE {"+
      "?subject ?predicate ?object"+
      'FILTER(str(?predicate) = "http://movieland.com/ufrrj/tebd/#title")'+
  "}";
  listaFilmesAjax(queryString);
});

//funcao que escolhe o filme e pede pra listar atores do filme x
$('select.lista-filmes').change(function() {
  var nomeDoFilme = $('select.lista-filmes').val();
  var queryString =
  "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
    "PREFIX j.0: <http://movieland.com/ufrrj/tebd/#>"+
    "SELECT DISTINCT ?subject ?predicate ?object"+
    "WHERE {"+
      '?subject j.0:movieId "'+ nomeDoFilme +'"'+
      "?subject j.0:actorId ?object"+
  "}";
  printaAtoresJson(queryString);
});

function listaFilmesAjax(queryString) {
  fetch('http://localhost:3030/filmes/query', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
              console.log(json.results.bindings);
              json.results.bindings.forEach(element => {
                $('select.lista-filmes').append(
                    '<option>' + element.object.value + '</option>');
              })
          })
}

//já que eu n posso testar muito vou repetir codigo
function printaAtoresJson(queryString){
  fetch('http://localhost:3030/filmes/query', {
          method: 'post',
          headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
          body: queryString
        }).then(function(response) {
          return response.json();
          })
          .then(function (json) {
              console.log(json.results.bindings);
              json.results.bindings.forEach(element => {
                div.appendChild(element.object.value + " \n");
              })
          })
}
