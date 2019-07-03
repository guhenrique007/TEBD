let vetorEspec = [];
let vetorMedicos = [];
var i = 0;


//pré DOM
$(document).ready(function() {
    
    var queryStringEspec =
    'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
          'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
          'SELECT DISTINCT  ?subject ?name ?desc '+
          'WHERE { ' +
          '?subject j.0:nome ?name.'+
          '?subject j.0:descricao ?desc.'+
          //'FILTER(str(?predicate) = "http://movieland.com/ufrrj/tebd/#nome") '+
          '} '+
          'ORDER BY ASC(?subject)';
    listaEspecialidades(queryStringEspec);
  
});

//after
$(document).ready(function(){
    $('select.lista-especialidades').change(function() {
        indiceSelect = ($('select.lista-especialidades').prop('selectedIndex'));
        var especialidade = $('select.lista-especialidades').val();
        var especId = vetorEspec[indiceSelect].codigo;
        especId.replace(/^0+/, '');
        console.log('indice: '+ indiceSelect);
        console.log('especId: '+especId);

        vetorEspec.forEach(element => {
          if (element.nome == especialidade){
              especId = element.codigo;   
          }            
        });

        $('#descEspec').text(vetorEspec[0].descricao);
        console.log('desc: '+ vetorEspec[indiceSelect].descricao + '<br><br>');


        var queryStringMedicos = 
          'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+	
          'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
          'SELECT DISTINCT ?subject ?predicate ?object '+
          'WHERE { '+
          //'?subject j.0:cod_especialidade "'+especId+'" . '+
          '?subject j.0:cod_especialidade "1". '+
          '?subject ?predicate ?object '+
          'FILTER(str(?predicate) = "http://movieland.com/ufrrj/tebd/#nome") '+
          '} ';

        listaMedicos(queryStringMedicos);

      });
});



//funçoes 
function listaEspecialidades(queryString){
    fetch('http://localhost:3030/especialidades/sparql', {
      method: 'post',
      headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
      body: queryString
    }).then(function(response){
      return response.json();
    }).then(function (json) {
        //console.log(json.results.bindings);
        json.results.bindings.forEach(element => {
          //console.log(element);
          $('select.lista-especialidades').append('<option>' + element.name.value + '</option>');
          var especData = {"codigo":"","nome":"","descricao":""};
          especData.codigo = element.subject.value.replace( /^\D+/g, '');
          especData.nome = element.name.value; 
          especData.descricao = element.desc.value;
         
          vetorEspec.push(especData);
          
      })
      
      console.log(vetorEspec);
  })
}

function listaMedicos(queryString){
    fetch('http://localhost:3030/medico/sparql', {
        method: 'post',
        headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
        body: queryString
      }).then(function(response){
        return response.json();
      }).then(function (json) {
          //console.log(json.results.bindings);
          json.results.bindings.forEach(element => {
            $('select.lista-medicos').append('<option>' + element.object.value + '</option>');
           
            vetorMedicos.push(element.object.value);
            
        })
    }) 
}

  