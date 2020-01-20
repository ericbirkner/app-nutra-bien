function abre_base() {
	
	var db = window.openDatabase(db_name, "1.0", "Birkner Media", 200000);
	db.transaction(consulta_registros, errorCB);
}

function consulta_registros(tx) {
	tx.executeSql('SELECT * FROM registros', [], lista_datos, errorCB);
}

function lista_datos(tx, results) {
	var len = results.rows.length;
	console.log(results.rows);
	alert('No apague el equipo mientras sincronizamos los datos ('+len+')');
	
	
	var exito=0;
	var i = 0;
	var debug = "";
	for (i; i < len; i++) {
		
		var obj = {
			'id' 	: results.rows.item(i).id,
            'nombre' 	: results.rows.item(i).firstName,
            'apellidos' 	: results.rows.item(i).lastName,           
            'rut' 	: results.rows.item(i).rut,			
			'email' 	: results.rows.item(i).email,
            'fnac' 		: results.rows.item(i).birthday,
            'recibe_info' 		: results.rows.item(i).recibe_info
        }
		
		console.log(obj);
		
		$.ajax({
		  method: "GET",
		  url: "https://script.google.com/macros/s/AKfycbzd8CZCkP70SgJaVTpbuPNXyLncOb3EiKs-AGH70t0hN5rweeI5/exec",
		  data: $.param( obj )
		})
		.done(function( msg ) {
			console.log( "Data Saved: " + msg );
		});      
	   
	}
	
	//fin sync
	$('.sync .loading').hide();
	//$('.sync').html('<p>Se sincronizaron <b>'+exito+'</b> registros al servidor</p>');
	$('.sync').html('<p>Se sincronizaron los registros con el servidor</p>');
	
}


$(document).ready(function() {
  
	$('.sync a.btn_subir').on('click', function(Event){
    	// validation code here
		$(this).fadeOut('slow');
		abre_base();
		$('.sync .loading').fadeIn('slow');
  	});
});
