let vetorEspec = [];
let vetorMedicos = [];
let vetorHorarios = [];



//pré DOM
$(document).ready(function() {
    
    let queryStringEspec =
    'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
          'PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#> '+
          'SELECT DISTINCT  ?subject ?name ?desc '+
          'WHERE { ' +
          '?subject j.0:nome ?name.'+
          '?subject j.0:descricao ?desc.'+
          '} '+
          'ORDER BY ASC(?subject)';
    listaEspecialidades(queryStringEspec);
  
});

//after
$(document).ready(function(){
    $('select.lista-especialidades').change(function() {
        $('div.horarios').empty();
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
          'PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#> '+
          'SELECT DISTINCT ?subject ?predicate ?object '+
          'WHERE { '+
          '?subject j.0:cod_especialidade "'+especId+'" . '+
          '?subject ?predicate ?object '+
          'FILTER(str(?predicate) = "http://ufmedic.com/ufrrj/tebd/#nome") '+
          '} ';

        let queryEspecMedicos= 
          'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+	
          'PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#> '+
          'SELECT DISTINCT ?subject ?crm ?nome ?anoF ?valorConsulta '+
          'WHERE {'+
            '?subject j.0:cod_especialidade "'+especId+'" .'+
            '?subject j.0:CRM ?crm.'+
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


            let horasObj = {"hora":"","dia":""};

            let queryHorarios =
            'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
            'PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#> '+
            'SELECT DISTINCT ?subject ?hora '+
            'WHERE{ '+
            '?subject j.0:crm "'+element.crm.value+'" . '+
            '?subject j.0:data_hora ?hora '+
            '} '+
            'ORDER BY DESC(?subject) ';

            /*$('ul.nome-medico').append('Médico: ' + element.nome.value);
            $('ul.nome-medico').append('<li>' + 'CRM: ' + element.crm.value + '</li>');
            $('ul.nome-medico').append('<li>' + 'Ano Formação: ' + element.anoF.value + '</li>');
            $('ul.nome-medico').append('<li>' + 'Valor da Consulta: R$' + element.valorConsulta.value + ',00    </li>');*/


           /* fetch('http://localhost:3030/consulta/sparql', {
                method: 'post',
                headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
                body: queryHorarios
            }).then(function(response){
                return response.json();
            }).then(function (json) {
                json.results.bindings.forEach(element => {
                    //horas vai retornar 'data hora', entao tenho que separar isso e anexar em um array de objetos
                    //descobrir qual dia da semana segundo a data
                    //let horasObj = {"horario":"","dia":""};
                    horasObj.horario = element.hora.value;
                    vetorHorarios.push(horasObj.horario);  
                    $('ul.nome-medico').append('<li>' + 'Agenda: ' + horasObj.horario + '</li>');
                })
                console.log(vetorHorarios);
            })  */

            let horas = [];
            listaAgenda(queryHorarios, horasObj, element.nome.value, element.crm.value, element.anoF.value, element.valorConsulta.value);

            
            //let horas = listaAgenda(queryHorarios,horasObj);
            //$('ul.nome-medico').append('<li>' + 'Agenda: ' + horasObj.horario + '</li>');
            //console.log(horas);
            
            
            let especData = {"crm":"","nome":"","ano_formacao":"","valor_consulta":""};
            especData.crm = element.crm.value;
            especData.nome = element.nome.value; 
            especData.ano_formacao = element.anoF.value;
            especData.valor_consulta = element.valorConsulta.value;
           
           

            vetorMedicos.push(especData);
            
            
        })
        //console.log('vetor MEDICOS: '+vetorMedicos);
    }) 
}

//ULTIMA COISA Q FIZ E Q N FICOU PRONTA
function listaAgenda(queryString,horasObj,nomeMedico,crm,ano,valor){
    let vetorHoras = [];
    fetch('http://localhost:3030/consulta/sparql', {
        method: 'post',
        headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
        body: queryString
      }).then(function(response){
        return response.json();
      }).then(function (json) {
          $('ul.nome-medico').append('Médico: ' + nomeMedico);
          $('ul.nome-medico').append('<li>' + 'CRM: ' + crm + '</li>');
          $('ul.nome-medico').append('<li>' + 'Ano Formação: ' + ano + '</li>');
          $('ul.nome-medico').append('<li>' + 'Valor da Consulta: R$' + valor + ',00    </li>');
          {
          $('div.horarios').append('<table>'+
            '<tr >'+
                '<th> </th>'+
                '<th>DOM</th>'+
                '<th>SEG</th>'+
                '<th>TER</th>'+
                '<th>QUA</th>'+
                '<th>QUI</th>'+
                '<th>SEX</th>'+
                '<th>SAB</th>'+
            '</tr>'+
            '<tr class="hora8_'+crm+'">'+
                '<td>08:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora9_'+crm+'">'+
                '<td>09:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora10_'+crm+'">'+
                '<td>10:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora11_'+crm+'">'+
                '<td>11:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora12_'+crm+'">'+
                '<td>12:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora13_'+crm+'">'+
                '<td>13:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora14_'+crm+'">'+
                '<td>14:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora15_'+crm+'">'+
                '<td>15:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora16_'+crm+'">'+
                '<td>16:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora17_'+crm+'">'+
                '<td>17:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '<tr class="hora18_'+crm+'">'+
                '<td>18:00</td>'+
                '<td class="dia0_"></td>'+
                '<td class="dia1_"></td>'+
                '<td class="dia2_"></td>'+
                '<td class="dia3_"></td>'+
                '<td class="dia4_"></td>'+
                '<td class="dia5_"></td>'+
                '<td class="dia6_"></td>'+
            '</tr>'+
            '</table>'+
            '<br><br><br><br><br><br><br><br><br><br><br><br>'
            );
          }


          json.results.bindings.forEach(element => {
            let dt = new Date(element.hora.value);

            horasObj.horario = dt.getHours() ; //isso é igual a hora
            horasObj.dia = dt.getDay(); //descobrir o dia

            console.log(element.hora.value);
            console.log(dt.getDay());
            $('ul.nome-medico').append('<li>' + 'Hora: ' + horasObj.horario + ' Dia: ' + horasObj.dia +'</li>');
            $('tr.hora'+ horasObj.horario + '_' + crm ).find('td.dia'+ horasObj.dia +'_').text('X');
        })
        $('ul.nome-medico').append('<br><br><br>');
        //$('tr.hora14_96').find('td.dia0_').text('X');
    })              
    return vetorHoras;
}

  