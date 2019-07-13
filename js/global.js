function desactivarFormItems(desactivar, grupo) {
  let grupoClases;
  
  if (typeof grupo == 'undefined') {
    grupoClases = '';
  } else {
    grupoClases = '.disable-group' + grupo;
  }
  
  if (desactivar === true) {
    let e = $('.config .form-item.disable' + grupoClases).addClass('disabled');
  }
}