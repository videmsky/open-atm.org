/* Author: 

*/

function generateNoise(opacity) {
	if (!!!document.createElement('canvas').getContext) {
		return false;
	}
	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		x, y,
		r, g, b,
		opacity = opacity || .2;

		canvas.width = 55;
		canvas.height = 55;
	
	for (x = 0; x < canvas.width; x++) {
		for (y = 0; y < canvas.height; y++) {
			r = Math.floor(Math.random()*255);
			g = Math.floor(Math.random()*255);
			b = Math.floor(Math.random()*255);

			ctx.fillStyle = 'rgba('+r+','+g+','+b+','+opacity+')';
			ctx.fillRect(x,y,1,1);
		}
	}

	document.body.style.backgroundImage = "url(" + canvas.toDataURL("image/png")+")";
}

generateNoise(.1);





















