/*//no es necesario validar los datos entrantes
function start(){
    //$('#paq_1').show();
    //var conte = document.getElementById('paq_1');
    setTimeout (logica, 3000);
}

function logica(){
    //var tamVentana = jQuery('#valorTamanioVentana').val();
    $('#paq_1').show();
    var conte = document.getElementById('paq_1');
}*/
$('#form-simulador').click(function (evento) {
  evento.preventDefault();
});

function start(){
  s();
  function s(){
      setTimeout (bs, 800);
  }
}

function bs(){
    $('#mov_1').show(); 
    var conte = document.getElementById('mov_1');
    $('#mov_1').addClass('uno');
    conte.addEventListener("animationend", function(){
        //funcion para comparar.. 
        $('#mov_1').removeClass('uno');  
        $('#mov_1').css("display", "none");    
    }, false);
}

