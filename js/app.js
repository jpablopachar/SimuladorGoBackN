const tamanioVentana = document.getElementById('tamanioVentana');
const valorTamanioVentana = document.getElementById('valorTamanioVentana');
const retrazoExtremo = document.getElementById('retrazoExtremo');
const valorRetrazoExtremo = document.getElementById('valorRetrazoExtremo');
const timeout = document.getElementById('timeout');
const valorTimeout = document.getElementById('valorTimeout');
const numeroPaquetes = document.getElementById('numeroPaquetes');
const valorNumeroPaquetes = document.getElementById('valorNumeroPaquetes');

valorTamanioVentana.innerHTML = tamanioVentana.value;
valorRetrazoExtremo.innerHTML = retrazoExtremo.value;
valorTimeout.innerHTML = timeout.value;
valorNumeroPaquetes.innerHTML = numeroPaquetes.value;

tamanioVentana.oninput = function() { valorTamanioVentana.innerHTML = this.value; }
retrazoExtremo.oninput = function() { valorRetrazoExtremo.innerHTML = this.value; }
timeout.oninput = function() { valorTimeout.innerHTML = this.value; }
numeroPaquetes.oninput = function() { valorNumeroPaquetes.innerHTML = this.value; }

/* Variables globales */
var corriendo = false;
var pantalla;
var contr;
var emisor;
var receptor;
var typewriter = true;
var finRetrazo = 1000;
var papel;

/* $(document).ready(() => {
  
}); */

function controlador() {
  this.getTamanioVentana = function() { return parseInt($('#tamanioVentana').val()); }
  
  this.setTamanioVentana = function() {
    let n = this.getTamanioVentana();
    console.log(n);
    pantalla.
  }
  
  this.todosPaquetesRecibidos = function() {
    if (this.corriendo) return;
    
    
  }
} 

function Pantalla(ventanaN, receptorVentana) {
  this.paper = $('#root');
  this.paper.children(':not(div.desc)').remove();
  this.paper.css({'left': '0px'});
  
  this.ventanaN = ventanaN;
  this.desplazamientoVentana = 6;
  this.ventanaEmisor;
  this.ventanaReceptor;
  this.xOffset = 0;
  this.siguienteNumSecLibre = 1 - this.desplazamientoVentana;
  // console.log(this.siguienteNumSecLibre);
  this.siguienteInicioPaqueteLbre = 0;
  this.siguienteNumSecARemover = 0;
  this.temporizadorVentana;
  this.paqueteActual = 0;
  
  this.descenderPaqueteActual = function(numSec) {
    this.paqueteActual--;
    console.log(this.paqueteActual + ' ' + numSec);
    this.
  }
  
  this.actual = function() {
    if (this.paqueteActual == 0 && Object.keys(this.temporizadorPaquete).length == 0 && inicioTemporizadorVentana = false) {
      
    }
  }
  
  // ventanaEmisor
  
  this.temporizadorPaquete = Object();
}