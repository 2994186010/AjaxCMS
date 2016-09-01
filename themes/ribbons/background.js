/* (c) 2016 Softwyre Inc / Brandon Hoult. for More Invformation email: brandon.hoult@softwyre.com */

page_width = window.innerWidth;
page_height = window.innerHeight;

velocity_per_frame = 1;
curliness = 10;
num_nodes = (page_width * page_height / 150000);

////////////////////////////////////////////////////////////////////

function node(x, y, vx, vy, h, s, l, a) {
  this.x = x;
  this.y = y;
  this.velocity = new Victor(vx, vy);
  this.hsl = [h, s, l];

  this.frame = function(cd) {
    
    // Number of iterations to draw per frame
    for (i = 0; i < velocity_per_frame; i++) {
      var rgb = hslToRgb(this.hsl[0], this.hsl[1], this.hsl[2]);
      var r = rgb[0];
      var g = rgb[1];
      var b = rgb[2];
      this.hsl[0] += 0.001;
      
      // Rotate the velocity using perlin noise.
      this.velocity.rotateDeg(perlin.get1d(frame / 600 + x + y) * curliness); // Curliness 
      
      // Step through each pixel of node velocity (we are drawing one pixel at a time)
      for (l = 0; l < this.velocity.length(); l++) {
        var v1 = this.velocity.clone();
        v1.divide(Victor(this.velocity.length(), this.velocity.length())); // the length of the section we are drawing for this frame.
        var offsetX = v1.x;
        var offsetY = v1.y;
       
        // Apply Movement
        this.x += offsetX;
        this.y += offsetY;
        
        // Draw Node as Pixel
        setPixel(cd, this.x, this.y, r, g, b, a);

        // Draw Spray around pixel
        spray(cd, this.x, this.y, this.hsl, 30);
        // setPixel(cd, cursorX, cursorY, 0,0,0,255);

        // Detect collision with outside border and invert velocity.
        if (this.x > page_width) {
          this.x = page_width;
          this.velocity.invertX()
        }
        if (this.x < 0) {
          this.x = 0;
          this.velocity.invertX()
        }
        if (this.y > page_height) {
          this.y = page_height;
          this.velocity.invertY()
        }
        if (this.y < 0) {
          this.y = 0;
          this.velocity.invertY()
        }
      }
    }
  }
}


function drawFrame(ctx, frame) {
	// Draw Stuff on The Canvas
	for (n = 0; n < nodes.length; n++) {
	  nodes[n].frame(cd);
	}
	
	// Fade the canvas
	cdFade(cd,40,5);
	cdDiffuse(cd,150,15);
	
	// Copy The Canvas to the Screen
	ctx.putImageData(cd, 0, 0);
}

////////////////////////////////////////////////////////////////////
startBackground = function() {
  nodes = [];
  frame = 0;

  canvas = document.getElementById('background');
  ctx = canvas.getContext("2d");
  ctx.canvas.width = page_width;
  ctx.canvas.height = page_height;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "rgba(255,255,255,0.018)";
  cd = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Create Animation Nodes
  
  for (i = 0; i < num_nodes; i++) {
    nodes.push(new node(rand(page_width), rand(page_height), rand(10) - 5, rand(10) - 5, rand(360), 1, 0.5, 255));
  }
  
  // Animation Loop
  function draw() {
  	requestAnimationFrame(draw);
	frame++;
	drawFrame(ctx, frame)
  }
  
  draw();
}

// Display Copyright
theme = "ribbons";
ad = "<div style='font-weight:bold;border-bottom:1px solid black;'>Theme:"+theme+"<span style='float:right'>&copy; AjaxCMS 2016</span></div>" +
	 "<div style='text-align:center;'><div>Individual Lisence: $50 / Unlimited Use: $100</div>" +
	 "<div>Development of AjaxCMS is made possible by the sale of themes like this one.  Please email: <a style='color:#00D;' href='mailto:branodn.hoult@softwyre.com'>brandon.hoult@softwyre.com</a> " + 
	 "to purchase a licence. </div></div>"
$('#background-div').prepend("<div style='position:fixed; bottom:40px; right:10px; height:120px; width:350px; border-radius:5px; padding:5px; background-color:rgba(255,255,255,0.8);color:black;'>"+ad+"</div>");

// Ping the tracking server.
hit_data = {theme: theme, user_agent: navigator.userAgent, resolution_x: window.innerWidth, resolution_y: window.innerHeight, url: document.domain};
$.ajax({url:"http://ajaxcmshelper.softwyre.com/hit",type:"post",data:{hit_data: hit_data}});

// Start the background animation.
startBackground();