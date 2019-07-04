let vetorEspec = [];
let vetorMedicos = [];




//pré DOM
$(document).ready(function() {
    
    let queryStringEspec =
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
        let especialidade = $('select.lista-especialidades').val();
        let especId = vetorEspec[indiceSelect].codigo;
        especId.replace(/^0+/, '');
        console.log('indice: '+ indiceSelect);
        console.log('especId: '+especId);

        vetorEspec.forEach(element => {
          if (element.nome == especialidade){
              especId = element.codigo;   
          }            
        });

        $('#descEspec').text(vetorEspec[indiceSelect].descricao);
        console.log('desc: '+ vetorEspec[indiceSelect].descricao + '<br><br>');
        $('ul.nome-medico').empty();


        let queryStringMedicos = 
          'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+	
          'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
          'SELECT DISTINCT ?subject ?predicate ?object '+
          'WHERE { '+
          '?subject j.0:cod_especialidade "'+especId+'" . '+
          '?subject ?predicate ?object '+
          'FILTER(str(?predicate) = "http://movieland.com/ufrrj/tebd/#nome") '+
          '} ';

        let queryEspecMedicos= 
          'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+	
          'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
          'SELECT DISTINCT ?subject ?crm ?nome ?anoF ?valorConsulta '+
          'WHERE {'+
            '?subject j.0:cod_especialidade "'+especId+'" .'+
            '?subject j.0:crm ?crm.'+
            '?subject j.0:nome ?nome.'+
            '?subject j.0:ano_formacao ?anoF. '+
            '?subject j.0:valor_consulta ?valorConsulta'+
          '}'+
          'ORDER BY DESC(?subject)';
   

        listaMedicos(queryEspecMedicos);


        
      });

    $('select.lista-medicos').change(function(){
        //indiceSelect = ($('select.lista-medicos').prop('selectedIndex'));
        //let nomeMedico = $('select.lista-medicos').val();
        //$('#descEspec').text(vetorMedicos[indiceSelect].crm);



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
        json.results.bindings.forEach(element => {
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
          json.results.bindings.forEach(element => {
            console.log(element);

            let queryHorarios =
            'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
            'PREFIX j.0: <http://movieland.com/ufrrj/tebd/#> '+
            'SELECT DISTINCT ?subject ?hora '+
            'WHERE{ '+
            '?subject j.0:crm "'+element.crm.value+'" . '+
            '?subject j.0:data_hora ?hora '+
            '} '+
            'ORDER BY DESC(?subject) ';

            $('ul.nome-medico').text('Nome: ' + element.nome.value);
            $('ul.nome-medico').append('<li>' + 'CRM: ' + element.crm.value + '</li>');
            $('ul.nome-medico').append('<li>' + 'Ano Formação: ' + element.anoF.value + '</li>');
            $('ul.nome-medico').append('<li>' + 'Valor da Consulta: ' + element.valorConsulta.value + '</li>');
            let vetorHorarios = listaAgenda(queryHorarios); 
            console.log('tamanho vetor '+vetorHorarios.length);
            for(var i = 0; i < vetorHorarios.length; i++){
                alert('element ');
                //$('ul.nome-medico').append('<li>' + 'Horario: ' + vetorHorarios[] + '</li>');
            }
            console.log('vetorHorarios '+ vetorHorarios);

            
            let especData = {"crm":"","nome":"","ano_formacao":"","valor_consulta":""};
            especData.crm = element.crm.value;
            especData.nome = element.nome.value; 
            especData.ano_formacao = element.anoF.value;
            especData.valor_consulta = element.valorConsulta.value;
           
           
            vetorMedicos.push(especData);
            console.log(vetorMedicos);
            
        })
    }) 
}

//ULTIMA COISA Q FIZ E Q N FICOU PRONTA
function listaAgenda(queryString){
    let vetorHoras = [];
    fetch('http://localhost:3030/consulta/sparql', {
        method: 'post',
        headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
        body: queryString
      }).then(function(response){
        return response.json();
      }).then(function (json) {
          json.results.bindings.forEach(element => {
          //horas vai retornar 'data hora', entao tenho que separar isso e anexar em um array de objetos
          //descobrir qual dia da semana segundo a data
          let horasObj = {"horario":"","dia":""};
          horasObj.horario = element.hora.value;
          vetorHoras.push(horasObj.horario);  
          vetorHoras.push(5); 
          console.log('vetorHOras '+ vetorHoras);  
        })
    })              
    return vetorHoras;
}

  