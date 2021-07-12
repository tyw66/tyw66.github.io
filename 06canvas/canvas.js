var can;
var img;
var ctx;
window.onload=function(){
	init();
	grayit();
}

function init(){
	can = document.getElementById("canZone");
	img = document.getElementById("oriZone");
	can.width = img.width;
	can.height = img.height;
	// var img = document.createElement("img");
	// img.setAttribute("id","oriZone");
	// img.setAttribute("src","tmp.jpg");
	//document.getElementsByTagName("body")[0].appendChild(img);
	// console.log(img.width);
	ctx = can.getContext("2d");
	ctx.drawImage(img,0,0);
}


function grayit(){
	//灰度
	var c =ctx.getImageData(0,0,can.width,can.height);
	for(i=0;i<c.height;i++){
		for(j=0;j<c.width;j++){
			var x = (i*4)*c.height+(j*4);
			var r = c.data[x];
			var g = c.data[x+1];
			var b = c.data[x+2];
			var a = c.data[x+3];
			// if(max(r,g,b)==r){
			// 	c.data[x] = 0;
			// }
			// else if(max(r,g,b)==g){
			// 	c.data[x+1] = 0;
			// }
			// else if(max(r,g,b)==b){
			// 	c.data[x+2] = 0;
			// }

			c.data[x]= (r+g+b)/3;
			c.data[x+1]= (r+g+b)/3;
			c.data[x+2] = (r+g+b)/3;
			c.data[x+3] = 100;
		}
	}

	//alert(c.width);
	// for(var index=0;index<c.height*c.width*4;++index){
	// 	c.data[index]=index%255;
	// }

	ctx.putImageData(c,0,0,0,0,c.width,c.height);
	return can.toDataURL();
}

function max(a,b,c){
	return a>b?(a>c?a:c):(b>c?b:c);
}


