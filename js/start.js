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
function start(){
    s();
    function s(){
        setTimeout (bs, 800);
    }
}

function bs(){
    $('#paq_1').show(); 
    var conte = document.getElementById('paq_1');
    var tamanioVentana = jQuery('#valorTamanioVentana').text();
    $('#paq_1').addClass('uno');
    conte.addEventListener("animationend", function(){
        //funcion para comparar.. 
        $('#paq_1').removeClass('uno');  
        $('#paq_1').css("display", "none");
        if(tamanioVentana==1){

        }else if(tamanioVentana==2){
            ventana_de_2();
        }else if(tamanioVentana==3){
            ventana_de_3;
        }else if(tamanioVentana==4){
            ventana_de_4;
        }
        //alert(tamanioVentana);
    }, false);
}

function ventana_de_2{

}

function ventana_de_3{
    
}

function ventana_de_4{

}