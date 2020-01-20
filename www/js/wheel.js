// JavaScript Document

var premios =[]
var posiciones= Array(45,90,135,180,225,270,315,360);


var db = window.openDatabase(db_name, "1.0", "Birkner Media", 200000);

db.transaction(function(tx){
	var sql = "SELECT * FROM premios where number != '0'";	
	console.log(sql);	
	tx.executeSql(sql,
	[], function(tx, results) {
		console.log(results);
		
		for (var i=0; i < results.rows.length; i++) {			
			premios.push(results.rows.item(i));
		}
		
		console.log(premios);
		if(premios.length==0){
			alert('No hay premios disponibles');
		}
		
	});

});



function descontar(premio) {
	var db = window.openDatabase(db_name, "1.0", "Birkner Media", 200000);
	db.transaction(function(tx) {
		var sql = 'UPDATE premios SET number= number -1 WHERE name like "%'+premio+'%"; ';
		console.log(sql);	
		tx.executeSql(sql);
	}, errorCB);
	
}


$(function(){
	
		window.WHEELOFFORTUNE = {

            cache: {},

            init: function () {
                //console.log('controller init...');

                var _this = this;
                this.cache.wheel = $('.rueda');
                this.cache.wheelMarker = $('.indicador');
               	this.cache.wheelSpinBtn = $('#juego .rueda'); 
              
				this.cache.wheelMapping = [1, 2, 3, 4, 5, 6, 7, 8].reverse();

				
                this.cache.wheelSpinBtn.on('click swipedown swiperight', function (e) {
                    e.preventDefault();
                    if (!$(this).hasClass('disabled')) _this.spin();
					$('.boton-ruleta').css('visibility','hidden');
                });
				

                //reset wheel
                this.resetSpin();

                //setup prize events
                //this.prizeEvents();
            },

            spin: function () {
                //console.log('spinning wheel');

                var _this = this;

                // reset wheel
                this.resetSpin();

                //disable spin button while in progress
                this.cache.wheelSpinBtn.addClass('disabled');

       
				var random = Math.floor(Math.random()*premios.length);
				var premiado = parseInt(premios[random].deg);
				
				console.log('premiado:'+ premiado);
				
				var yapa = 10; //la yapa se usa para que quede marcado al medio
				var deg = 3600 + premiado + yapa,
                duration = 6000; //optimal 6 secs
				
				console.log('deg:'+deg);
				
                _this.cache.wheelPos = deg;

                //transition queuing
                //ff bug with easeOutBack
                this.cache.wheel.transition({
                    rotate: '0deg'
                }, 0)
                    .transition({
                    rotate: deg + 'deg'
                }, duration, 'easeOutCubic');

                //move marker
                _this.cache.wheelMarker.transition({
                    rotate: '-20deg'
                }, 0, 'snap');

                //just before wheel finish
                setTimeout(function () {
                    //reset marker
                    _this.cache.wheelMarker.transition({
                        rotate: '0deg'
                    }, 300, 'easeOutQuad');
                }, duration - 500);

                //wheel finish
                setTimeout(function () {
                    // did it win??!?!?!
                    var spin = _this.cache.wheelPos,
                        degrees = spin % 360,
                        percent = (degrees / 360) * 100,
                        segment = Math.ceil((percent / 9)),  
                        //win = _this.cache.wheelMapping[segment]; //zero based array
						win = 1,
						premio ="";

                   	console.log('spin = ' + spin);
                    console.log('degrees = ' + degrees);
                    console.log('percent = ' + percent);
                    console.log('segment = ' + segment);
                    
					//	
					premio = premios[random].name;
						
					
					console.log('win = ' + win);
					console.log('premio = ' + premio);
					
					
					descontar(premios[random].name);	
						
										
					//alert(premio);
					$('#juego .tu_premio .box_premio').html("<img src='img/productos/"+premio+"'/>");
					$('#juego .tu_premio').css({'display':'block'});
					
					                
				}, duration);

            },

            resetSpin: function () {
                this.cache.wheel.transition({
                    rotate: '0deg'
                }, 0);
                this.cache.wheelPos = 0;
            }

        }

        window.WHEELOFFORTUNE.init();
});