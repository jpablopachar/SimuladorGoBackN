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
      setTimeout (bs, 800);
  }
}

function bs(){
    $('#paq_1').show(); 
    var conte = document.getElementById('paq_1');
    console.log(valorExtremoAExtremo.value);
    var tamanioVentana = jQuery('#valorTamanioVentana').text();
    /*$('#paq_1').addClass('uno'); */
    $('#paq_1').css({
      'animation-name': 'uno',
      /*'animation-duration': valorExtremoAExtremo.value + 'ms'*/
      'animation-duration': valorExtremoAExtremo.value + 'ms',
      
    });
    conte.addEventListener("animationend", function(){
        //funcion para comparar.. 
        /* $('#paq_1').removeClass('uno'); */  
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

//Variables
var tamano_actual = 0;
var tv = document.getElementById('tamanioVentana');
var ventana = document.getElementById('send-window');

//Metodo para hacer crecer la ventana
tv.addEventListener("change", function(){
  var nunevo_tamano = $("#tamanioVentana").val();
  diferencia = nunevo_tamano - tamano_actual;
 // para transformar la diferencia en posi
   console.log(diferencia);
  if(diferencia < 0){
    diferencia = diferencia * -1;
  }

  if(  nunevo_tamano >tamano_actual ){
    //alert(tamano_actual + " " + nunevo_tamano +"mas");
    $("#send-window").width($("#send-window").width()+ (40*diferencia));
  } else if(nunevo_tamano <tamano_actual){
    //alert(tamano_actual + " " + nunevo_tamano +"menos");
    $("#send-window").width($("#send-window").width()- (40*diferencia));
  }
  tamano_actual = nunevo_tamano;  
  //ventana.style.width = ancho + '43px' ;
  console.log(ventana.style.width + " " + diferencia);
});