function node(x,y, vx,vy, size, depth) {
  this.x = x;
  this.y = y;
  this.velocity = new Victor(vx, vy);
  this.depth = depth;
  this.size = size;

  this.frame = function(n) {
  	// Apply Movement
    this.x += (this.velocity.x);
    this.y += (this.velocity.y);
    
	// Repel
    if (this.x < padding) {this.velocity.x -= ((this.x - padding) / padding / magnet)} 
    if (this.x > (page_width - padding)) {this.velocity.x += ((page_width - padding - this.x) / padding / magnet)} 
    if (this.y < padding) {this.velocity.y -= ((this.y - padding) / padding / magnet)} 
    if (this.y > (page_height - padding)) {this.velocity.y += ((page_height - padding - this.y) / padding / magnet)}
    
    // Bounce
    //if (this.x > page_width) {this.velocity.x = -this.velocity.x}
    //if (this.x < 0) {this.velocity.x = -this.velocity.x}
    //if (this.y > page_height) {this.velocity.y = -this.velocity.y}
    //if (this.y < 0) {this.velocity.y = -this.velocity.y}
    
    
  }
}


function drawFrame(ctx, frame) {

	// Clear the frame.
	ctx.fillStyle = "rgba(255,255,255,0.018)";
	ctx.fillRect(0,0,page_width,page_height);
	
	// Update Node Positions
	for (n = 0; n < nodes.length; n++) {
	  nodes[n].frame(n);
	}
	
	// Draw Lines Connecting Nodes
	ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
	for (n = 1; n < nodes.length; n++) {
		ctx.lineTo(nodes[n].x, nodes[n].y);
	}
	ctx.stroke();
	
	// Draw Nodes
	for (n = 0; n < nodes.length; n++) {
    	ctx.beginPath();
    	ctx.arc(Math.round(nodes[n].x),Math.round(nodes[n].y), 5, 0,2*Math.PI); // circle
    	ctx.fillStyle = "rgba(255,50,50,1)";
		ctx.fill();
	}
}



////////////////////////////////////////////////////////////////////
startBackground = function() {
	nodes = [];
	velocity_per_frame = 1;
	frame = 0;
	padding = 400;
	magnet = 10;
	
	$('#background').css('background', '#FFF');
	
	// Set up the background canvas
	canvas = document.getElementById('background');
	ctx = canvas.getContext("2d");
	page_width = window.innerWidth;
	page_height = window.innerHeight;
	ctx.canvas.width = page_width;
	ctx.canvas.height = page_height;
	ctx.strokeStyle = "black";
	
	canvas_size = ctx.canvas.width * ctx.canvas.height;
	
	// Make new nodes
	for (var i=0; i<10; i++) {
		var v = new Victor(rand(10)-5,rand(10)-5);
		v = vectorNormal(v).multiply(new Victor(rand(5)+2,rand(5)+2));
		nodes.push(new node(rand(page_width-(padding*2))+padding,rand(page_height-(padding*2))+padding, v.x,v.y, 250,1));
	}
	
	// Animation Loop
	function draw() {
		requestAnimationFrame(draw);
		frame++;
		drawFrame(ctx, frame);
	}
	
	draw();
}

startBackground();