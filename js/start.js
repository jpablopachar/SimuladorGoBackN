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
var valorExtremoAExtremo = document.getElementById('retrazoExtremo');

$('#form-simulador').click(function (evento) {
  evento.preventDefault();
});

function start(){
  s();
  desactivarFormulario();
  $('body').on('click', '.paquetes div', function() {
    // alert($(this).attr('id'));
    $(this).remove();
  });
  function s(){
      setTimeout (bs, 0000);
  }
}

function bs(){
    $('#paq_1').show(); 
    var conte = document.getElementById('paq_1');
    var tamanioVentana = jQuery('#valorTamanioVentana').text();
    /*$('#paq_1').addClass('uno'); */
    /*$('#paq_1').css({
      'animation-name': 'uno',
      'animation-duration': valorExtremoAExtremo.value + 'ms',    
    });*/
    /*let coordenadas = $('#paq_1').offset();
    console.log(coordenadas);*/
    conte.animate({
      'top': '0%',
    }, {
      queue: false,
      duration: valorExtremoAExtremo.value
    }).animate({ 'top': '50%' }, (valorExtremoAExtremo.value / 2))
    conte.addEventListener("animationend", function(){
        //funcion para comparar.. 
        $('#paq_1').css("display", "none");
        if(tamanioVentana==1){

        }else if(tamanioVentana==2){
            ventana_de_2();
        }else if(tamanioVentana==3){
            ventana_de_3();
        }else if(tamanioVentana==4){
            ventana_de_4();
        }
        activarFormulario();
        //alert(tamanioVentana);
    }, false);
}

function ventana_de_2(){
    $('#paq_2').show();
    var conte = document.getElementById('paq_2');
    $('#paq_2').addClass('dos');
    conte.addEventListener("animationend", function(){
        //funcion para comparar.. 
        $('#paq_2').removeClass('dos');  
        $('#paq_2').css("display", "none");
        //alert(tamanioVentana);
    }, false);
}

function ventana_de_3(){
    $('#paq_3').show();
    var conte = document.getElementById('paq_3');
    $('#paq_3').addClass('dos');
    conte.addEventListener("animationend", function(){
        //funcion para comparar.. 
        $('#paq_3').removeClass('tres');  
        $('#paq_3').css("display", "none");
        activarFormulario();
        //alert(tamanioVentana);
    }, false);
}

function ventana_de_4(){

}

function desactivarFormulario() {
  $('input').prop('disabled', true);
  $('button').text('Pausar');
}

function activarFormulario() {
  $('input').prop('disabled', false);
  $('button').text('Iniciar');
}

function eliminarPaquete(paquete) {
  paquete.remove;
}
