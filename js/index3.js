const tamanioVentana = document.getElementById('senderN');
const valorTamanioVentana = document.getElementById('valorTamanioVentana');
const retrazoExtremo = document.getElementById('endToEndDelay');
const valorRetrazoExtremo = document.getElementById('valorRetrazoExtremo');
const timeout = document.getElementById('timeout');
const valorTimeout = document.getElementById('valorTimeout');
const numeroPaquetes = document.getElementById('pkgPerMin');
const valorNumeroPaquetes = document.getElementById('valorNumeroPaquetes');

valorTamanioVentana.innerHTML = tamanioVentana.value;
valorRetrazoExtremo.innerHTML = retrazoExtremo.value;
valorTimeout.innerHTML = timeout.value;
valorNumeroPaquetes.innerHTML = numeroPaquetes.value;

tamanioVentana.oninput = function() { valorTamanioVentana.innerHTML = this.value; }
retrazoExtremo.oninput = function() { valorRetrazoExtremo.innerHTML = this.value; }
timeout.oninput = function() { valorTimeout.innerHTML = this.value; }
numeroPaquetes.oninput = function() { valorNumeroPaquetes.innerHTML = this.value; }