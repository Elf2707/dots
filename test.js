const NUMBER_OF_POINTS = 10000;

class Point {
	constructor(x, y, vx, vy, color) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.color = color;
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, 3, 3);
	}

	calcNextCoordsInRect(viewWidth, viewHeight, mouse) {
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;

		if((this.x <= 0) || (this.x >= viewWidth)){
			this.vx	= -this.vx;
		};

		if((this.y <= 0) || (this.y >= viewHeight)){
			this.vy	= -this.vy;
		};

		if(mouse) {
			if((Math.abs(this.x - mouse.x) < 50) && (Math.abs(this.y - mouse.y) < 50)) {
				this.x -= 70;
				this.y -= 70;
			}
		}
	}
}

class PointsMess {
	constructor(pointsNumber, viewWidth, viewHeight, ctx, mouse) {
		this.points = [];

		for(let i = 0; i < pointsNumber; i++) {
			this.points[i] = new Point(rand(0, viewWidth), rand(0, viewHeight),
									rand(0, 10), rand(0, 10), randRGBColor());
		}

		this.viewWidth = viewWidth;
		this.viewHeight = viewHeight;
		this.ctx = ctx;
		this.mouse = mouse;
		this.run = false;
	}

	// Draw scene
	draw() {
		this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
		for(let i = 0, size = this.points.length; i < size ; i++) {
			this.points[i].draw(this.ctx);
		};
	}

	nextFrame() {
		for(let i = 0, size = this.points.length; i < size ; i++) {
			this.points[i].calcNextCoordsInRect(this.viewWidth, this.viewHeight, this.mouse);
		};
	}

	switchRunningState() {
		this.run = !this.run;

		if( this.run ) {
			this.messTimer = setInterval(() => {
				this.draw();
				this.nextFrame();
			}, 30);
		} else {
			if(this.messTimer) {
				clearInterval(this.messTimer);
				this.messTimer = null;
			}
		}
	}
}

window.onload = function() {
	let ctx, w, h, canvas, mouse;
	canvas = document.getElementById('canvas');
	w = canvas.width;
	h = canvas.height;
	ctx = canvas.getContext('2d');
	ctx.strokeRect(0, 0, w, h);
	mouse = {};

	canvas.addEventListener('mousemove', function(event) {
        mouse.x = event.layerX - canvas.offsetLeft;
        mouse.y = event.layerY - canvas.offsetTop;
    });

    canvas.addEventListener('click', (event) => {
		if(window.PointsMess) {
			window.PointsMess.switchRunningState();
		}
	});
	
	//Init poinst
	window.PointsMess = new PointsMess(NUMBER_OF_POINTS, w, h, ctx, mouse);
}

function rand(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function randRGBColor() {
	return `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`
}