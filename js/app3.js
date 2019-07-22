/* globals */
var running = false;
var display;
var contr;
var sender;
var receiver;
var typewriter = true;
var endToEndDelay = 1000;
var paper;

$(document).ready(function(){
	checkFeatures({
		inlinesvg: false,
		canvas: true
	});

	rangeInputCompability();
});

function Controller(){
	this.getMethod = function(){
		//var e = document.getElementById('method');
		//return e.options[e.selectedIndex].value;
		return $('input[name=method]:checked').val();
	}
	this.setMethod = function(){
		console.log('switch method to '+this.getMethod());
		initAnimation(this.getMethod());
	}

	this.getSenderN = function(){
		return parseInt(document.getElementById('senderN').value);
	}

	this.setSenderN = function(){
		var n = this.getSenderN();
		display.setN(n, sender.base);
		sender.N = n;
		if(typeof receiver.N != 'undefined')
			receiver.N = n;
	}

	this.getEndToEndDelay = function(){
		return parseInt(document.getElementById('endToEndDelay').value);
	}
	this.setEndToEndDelay = function(){
		endToEndDelay = this.getEndToEndDelay();
	}

	this.getTimeout = function(){
		return parseInt(document.getElementById('timeout').value);
	}
	this.setTimeout = function(){
		sender.timeout = this.getTimeout();
	}

	this.isPaused = false;
	this.pause = function(){
		if(this.isPaused === false){
			if(this.running)
				window.clearInterval(this.interval);

			$('.pkg').pause();
			$.each(runningTimers, function(index, element){
				element.pause();
			});
			$('.pkg').each(function(){
				var t = $(this).children('canvas').data('timer');
				if(typeof t != 'undefined')
					t.pause();
			});
			if(typeof display.windowTimer != 'undefined' && typeof display.windowTimer.data('timer') != 'undefined')
				display.windowTimer.data('timer').pause();

			this.isPaused = true;
		}
		else{
			this.setPkgPerMin();
			this.isPaused = false;

			$('.pkg').resume();
			$.each(runningTimers, function(index, element){
				element.start();
			});
			$('.pkg').each(function(){
				var t = $(this).children('canvas').data('timer');
				if(typeof t != 'undefined')
					t.resume();
			});
			if(typeof display.windowTimer != 'undefined' && typeof display.windowTimer.data('timer') != 'undefined')
				display.windowTimer.data('timer').resume();
		}
		document.getElementById('pause').value = (this.isPaused ? 'resume' : 'pause');
	}

	this.getPkgPerMin = function(){
		return parseInt(document.getElementById('pkgPerMin').value);
	}
	this.setPkgPerMin = function(){
		this.timeBetweenPkgs = 1/(this.getPkgPerMin()/60)*1000;

		if(this.running){
			window.clearInterval(this.interval);
			this.interval = window.setInterval('sender.send(1)', this.timeBetweenPkgs);
		}
	}

	this.running = false;
	this.interval;
	this.timeBetweenPkgs = 1000;
	this.emit = function(){
		sender.send(1);
	}
	this.startStop = function(){
		if(this.running){
			window.clearInterval(this.interval);
		}
		else{ // start
			sender.send(1);
			window.clearInterval(this.interval);
			this.interval = window.setInterval('sender.send(1)', this.timeBetweenPkgs);

			disableFormItems(true);
		}
		this.running = !this.running;

		document.getElementById('start').value = (this.running ? 'Pausar' : 'Iniciar');
	}

	this.allPacketsReceived = function(){
		if(this.running)
			return;

		disableFormItems(false);
	}
}


/**
 * a Packet
 * @param seqnum the sequence number of the packet
 */
function Packet(seqnum, data){
	this.seqnum = seqnum;
	this.data = data;
	this.timer = null;

	this.send = function(dst, timeout){
		var self = this;
		this.timer = new Timer(function(){
			dst.receive(self);
		}, timeout);
	}
	this.received = function(){
		this.timer.stop();
	}
	this.kill = function(){
		this.timer.stop();
	}
}

/**
 * this sender can send with the go back n protocol
 */
function SenderGBN(N){
	this.partner; // the end point the packets go to
	this.base = 1;
	this.nextseqnum = 1;
	this.N = N;
	this.pkt = new Array();
	this.timeout = 2000; // time until the timeout is fired
	this.timer = null;

	// this method is called when a timeout occurs
	this.timeoutHandler = function(){
		console.log("timeout");

		// start a new timeout
		var self = this;
		this.timer = new Timer(
			function(){
				self.timeoutHandler();
			}
			, this.timeout
		);
		display.startWindowTimer(this.timeout);

		// resend all packets in the current window
		for(var i = this.base; i < this.nextseqnum; i++){
			console.log("send packet "+i);
			this.pkt[i].send(this.partner, endToEndDelay);

			display.send(true, this.pkt[i]);
		}
	}

	// sends a new packet to the partner
	this.send = function send(data){
		if(this.nextseqnum < this.base+this.N){
			this.pkt[this.nextseqnum] = new Packet(this.nextseqnum, data);
			console.log("send packet "+this.nextseqnum);
			this.pkt[this.nextseqnum].send(this.partner, endToEndDelay);

			display.send(true, this.pkt[this.nextseqnum]);

			if(this.base == this.nextseqnum){
				console.log("first packet in frame: start timer");
				this.restartTimer();
			}
			this.nextseqnum++;

			return true;
		}
		else{
			console.log("refuse packet");

			return false;
		}
	}

	// receive an Ack
	this.receive = function(ack){
		if(ack.seqnum < this.base){
			console.log("ack"+ack.seqnum+" received; "+ack.seqnum+" < senderbase; ignore");
			return;
		}

		console.log("ack"+ack.seqnum+" received");

		for(var i = this.base; i < ack.seqnum+1; i++)
			display.confirmSender(i);

		display.setSenderBase(ack.seqnum+1-this.base, ack.seqnum+1);

		this.base = ack.seqnum+1;

		if(this.base == this.nextseqnum){
			this.timer.stop();
			display.stopWindowTimer();
			console.log("all acks received: stop timer");
		}
		else{
			console.log("restart timer");
			this.restartTimer();
		}
	}

	this.restartTimer = function(){
		if(this.timer){
			this.timer.stop();
			//display.stopWindowTimer();
		}

		var self = this;
		this.timer = new Timer(
			function(){
				self.timeoutHandler();
			}
			, this.timeout
		);
		display.restartWindowTimer(this.timeout);
	}
}

function ReceiverGBN(){
	this.partner; // the end point the packets come from
	this.expectedseqnum = 1;
	this.sndpkt = new Packet(0, 'ACK');

	// receive a packet
	this.receive = function(packet){
		if(packet.seqnum == this.expectedseqnum){
			console.log("packet "+packet.seqnum+" received: send ack");
			this.sndpkt = new Packet(this.expectedseqnum, 'ACK');
			display.confirmReceiver(this.sndpkt.seqnum);
			display.deliverPkg(this.sndpkt.seqnum);

			this.expectedseqnum++;
		}
		else{
			console.log("packet "+packet.seqnum+" received UNEXPECTED: send old ack");
		}
		this.sndpkt.send(this.partner, endToEndDelay);
		display.send(false, this.sndpkt);
	}
}

function init(){
	contr = new Controller();

	initAnimation();
}

function initAnimation(){
	display = null;
	sender = null;
	receiver = null;
	for(var t in runningTimers)
		runningTimers[t].stop();

	var n = contr.getSenderN();

  display = new Display(n, false);
  sender = new SenderGBN(n);
  receiver = new ReceiverGBN();


	sender.partner = receiver;
	receiver.partner = sender;

	contr.setEndToEndDelay();
	contr.setTimeout();
}



function Display(windowN, hasWindowReceiver){
	this.paper = $('#root');
	this.paper.children(':not(div.desc)').remove();
	this.paper.css({'left':  '0px'});

	this.windowN = windowN;
	this.windowOffset = 5;
	this.seqnumToPkg = new Object();
	this.windowSender;
	this.windowReceiver;
	this.xOffset = 0;
	this.nextFreeSeqNum = 1-this.windowOffset;
	this.nextFreePkgIndex = 0;
	this.nextSeqNumToRemove = 0;
	this.windowTimer;
	this.packetsAlive = 0;

	this.packetsAliveDec = function(seqnum){
		this.packetsAlive--;
		//console.log(this.packetsAlive + ' ' + seqnum);
		this.alive();
	};

	this.alive = function(){
		if(this.packetsAlive == 0 && Object.keys(this.pkgTimers).length == 0 && this.windowTimerStarted == false){
			contr.allPacketsReceived();
		}
	}

	// senderWindow
	this.setN = function(windowN, base){
		this.windowN = windowN;
		if(typeof this.windowSender == 'undefined'){
			var marginLeft = 100;
			var x = 10+27*(base+this.windowOffset-1)-2;
			var y = 8
			var width = 4+this.windowN*16+(this.windowN-1)*11;
			var height = 34;

			this.windowSender = $('<div>&nbsp;</div>').css({
				left: x+'px',
				top: y+'px',
				width: width+'px',
				height: height+'px'
			}).attr('class', 'window').appendTo(this.paper);

			// create Window timer
			if(!hasWindowReceiver){
				this.windowTimer = $('<canvas height="40" width="40">&nbsp;</canvas>').css({
					left: x+'px'
				}).attr('class', 'window-timer').appendTo(this.paper);
			}

			if(hasWindowReceiver){
				this.windowReceiver = $('<div>&nbsp;</div>').css({
					left: 10+27*(base+this.windowOffset-1)-2+'px',
					top: 358+'px',
					width: width+'px',
					height: height+'px'
				}).attr('class', 'window').appendTo(this.paper);
			}
		}
		else{
			// only correct width
			var width = 4+this.windowN*16+(this.windowN-1)*11;
			this.windowSender.css('width', width+'px');

			if(hasWindowReceiver){
				this.windowReceiver.css('width', width+'px');
			}
		}
	}

	// this method creates a new rectangle representing a empty packet for the sender and the receiver
	this.createPackets = function(){
		var width = 16, height = 30, size = 25;
		var s = $('<div><canvas width="'+size+'" height="'+size+'"></canvas></div>').css({
			left: 10+this.nextFreePkgIndex*27+'px',
			top: 10+'px'
		}).attr('class', 'pkg').data('index', this.nextFreePkgIndex).appendTo(this.paper);
		var r = $('<div>&nbsp;</div>').css({
			left: 10+this.nextFreePkgIndex*27+'px',
			top: 360+'px'
		}).attr('class', 'pkg empty').data('index', this.nextFreePkgIndex).appendTo(this.paper);

		this.seqnumToPkg[this.nextFreeSeqNum] = {'sender': s, 'receiver': r};
		this.nextFreeSeqNum++;
		this.nextFreePkgIndex++;
	}

	// draw sender and receiver
	for(var i = 0; i < 30; i++){
		this.createPackets();
	}
	this.setN(this.windowN, 1);

	this.confirmSender = function(seqnum){
		console.log('confirm '+seqnum);
		$(this.seqnumToPkg[seqnum].sender).attr('class', 'pkg confirmed');
	}

	this.confirmReceiver = function(seqnum){
		console.log('confirm '+seqnum);
		$(this.seqnumToPkg[seqnum].receiver).attr('class', 'pkg');
	}

	this.deliverPkg = function(seqnum){
		$(this.seqnumToPkg[seqnum].receiver).attr('class', 'pkg delivered');
	}

	var xOffsetLast = this.xOffset;
	this.setSenderBase = function(count, newBase){
		if(count == 0)
			return;

		var tmp = this.xOffset;
		this.xOffset += count*27;

		// add new tailing packets
		for(var i = 0; i < count; i++){
			this.createPackets();
		}

		// shift sender window right
		var newX = 10+this.seqnumToPkg[newBase].sender.data('index')*27-2;
		this.windowSender.animate({
			'left': newX+'px'
		}, 100);

		if(this.windowTimer != null){
			this.windowTimer.stop().animate({
				'left': newX+'px'
			}, 100);
		}

		if(typeof this.windowSenderTimer != 'undefined'){
			this.moveWindowTimer(newX);
		}

		// shift all packets left
		if(!typewriter || (newX + this.windowSender.width() - xOffsetLast >= 750)){
			var tmp = this;
			this.paper.stop().animate({
				left: -this.xOffset+"px"
			}, 400, function(){
				for(var i = tmp.nextSeqNumToRemove; i < tmp.nextFreeSeqNum; i++){
					if($(tmp.seqnumToPkg[i].sender).offset().left > -27)
						break;

					// remove packet because its out of viewport
					$(tmp.seqnumToPkg[i].sender).add(tmp.seqnumToPkg[i].receiver).remove();
					delete tmp.seqnumToPkg[i];

					tmp.nextSeqNumToRemove++;

					console.log('remove packet ' + i);
				}
			});

			xOffsetLast = this.xOffset;
		}
	}

	this.setReceiverBase = function(count, newBase){
		console.log('srb'+count);
		if(count == 0 || !hasWindowReceiver)
			return;

		// shift receiver window right
		var newX = 10+this.seqnumToPkg[newBase].sender.data('index')*27-2;
		this.windowReceiver.stop().animate({
			left: newX+'px'
		}, 200);
	}

	this.send = function(toReceiver, pkg){
		var seqnum = pkg.seqnum;
		var time = endToEndDelay;
		var square;
		var org, fromY, tClass;

		if(toReceiver){
			org = this.seqnumToPkg[seqnum].sender;
			fromY = 10;
			tClass = 'pkg';
		} else {
			org = this.seqnumToPkg[seqnum].receiver;
			fromY = 360;
			tClass = 'pkg ack';
		}

		square = $(org).clone().attr('class', tClass).appendTo(this.paper).css('top', fromY+'px');
		this.packetsAlive++;

		var self = this;

		square.animate({top: ((toReceiver) ? 360 : 10)+'px'}, time, 'linear', function(){
			$(square).remove();
			self.packetsAliveDec(seqnum);
		});

		square.mousedown(function(e){
			pkg.kill();
			self.packetsAliveDec(seqnum);

			square.stop().css({
				background: '#ff0000'
			}).delay(100).remove();

			console.log(((toReceiver) ? 'pkg': 'ack')+seqnum + ' killed');
		});
	}

	this.pkgTimers = Object();
	this.startPkgTimer = function(seqnum, time){
		if(typeof this.seqnumToPkg[seqnum] == 'undefined')
			return;

		var $c = $(this.seqnumToPkg[seqnum].sender).children('canvas');
		if(typeof $c.data('timer') == 'undefined'){
			$c.data('timer', new TimerCircle(25, $c, 'pkg'));
		}

		$c.data('timer').start(time);
	}

	this.stopPkgTimer = function(seqnum){
		if(typeof this.seqnumToPkg[seqnum] == 'undefined')
			return;

		var t = $(this.seqnumToPkg[seqnum].sender).children('canvas').data('timer');
		if(typeof t != 'undefined')
			t.stop();

		this.alive();
	}

	this.windowTimerStarted = false;

	this.startWindowTimer = function(time){
		if(typeof this.windowSenderTimer == 'undefined'){
			this.windowTimer.data('timer', new TimerCircle(40, this.windowTimer, 'window'));
		}

		this.windowTimer.data('timer').start(time);
		this.windowTimerStarted = true;
	}

	this.restartWindowTimer = function(time){
		if(this.windowTimer.data('timer'))
			this.windowTimer.data('timer').stop();

		this.startWindowTimer(time);
	}

	this.stopWindowTimer = function(){
		this.windowTimer.data('timer').stop();
		this.windowTimerStarted = false;

		this.alive();
	}

	function TimerCircle(size, canvas, type){
		var timer = $({percent:100}), lastValue = 200;
		var canvas = $(canvas);
		var context = canvas[0].getContext('2d');
		if(type != 'window' && type != 'pkg')
			throw "type "+type+' is not defined';

		function timeoutCircle(c, x, y, width, value, total, lineWidth){
			if(value <= 0)
				return;

			c.save();
			var pad = lineWidth/2;
			var r = width/2-pad, cx = x+r+pad, cy = y+r+pad;
			c.strokeStyle = '#ff00ff';
			c.lineWidth = lineWidth;
			c.lineCap = 'butt';

			c.beginPath();
			c.arc(cx, cy, r, Math.PI*3/2, 2*Math.PI*value/total+Math.PI*3/2, false);
			c.stroke();
			c.restore();
		}

		function timeoutCircleFilled(c, x, y, width, value, total){
			if(value <= 0)
				return;

			c.save();

			var r = width/2, cx = x+r, cy = y+r;
			c.fillStyle = '#ff00ff';

			c.beginPath();
			c.arc(cx, cy, r, Math.PI*3/2, 2*Math.PI*value/total+Math.PI*3/2, false);
			c.lineTo(cx, cy);
			c.closePath();
			c.fill();
			c.restore();
		}

		this.stop = function(){
			timer.stop(true, true);
			return this;
		}

		this.start = function(time){
			var self = this;
			timer.stop(false, true);
			timer[0].percent = 100; // reset
			timer.animate(
				{percent: 0},
				{
					step: function(now, fx) {
						now = Math.ceil(now);
						if(now == lastValue)
							return;

						context.clearRect(0, 0, size, size);
						if(type == 'window')
							timeoutCircle(context, 0, 0, size, now, 100, 10);
						else // pkg
							timeoutCircleFilled(context, 0, 0, size, now, 100);
						lastValue = now;
					},
					duration: time
				}
			);
			return this;
		}

		this.pause = function(){
			timer.pause();
			return this;
		}

		this.resume = function(){
			timer.resume();
			return this;
		}
  }
}