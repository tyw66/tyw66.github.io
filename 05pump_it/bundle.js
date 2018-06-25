var w_height = window.innerHeight;
var w_width = window.innerWidth;

var xIter=new Array();
var yIter=new Array();
var moveItems;

var VEC_X=10;
var VEC_Y=10;

window.onload = function(){
	init();
	setInterval("cycle()",150);	
}


function init(){
	moveItems = this.document.getElementsByClassName("moveItems");
	xIter=new Array(moveItems.length);
	yIter=new Array(moveItems.length);

	for(var i = 0; i<moveItems.length;++i){
		moveItems[i].style.top = Math.random()*w_height + "px";
		moveItems[i].style.left = Math.random()*w_height + "px";
		
		xIter[i]=Math.random()>0.5?VEC_X:-VEC_X;
		yIter[i]=Math.random()>0.5?VEC_Y:-VEC_Y;





	}

}


function cycle(){
	for(var i = 0; i<moveItems.length;++i){
		var item = moveItems[i];
		moveElem(item,i);
	}
	
}

function moveElem(item,i){

	var leftValue = parseInt(item.style.left);
	
	if(leftValue<0){
		leftValue=0;
		xIter[i]=VEC_X + VEC_X*(Math.random()-0.5);//加一个扰动，反弹后获得不一样的速度
	}
	else if(leftValue>w_width - item.offsetWidth - 10){
		leftValue=w_width - item.offsetWidth - 10;
		xIter[i]=-VEC_X + VEC_X*(Math.random()-0.5);;		
	}
	
	item.style.left = (leftValue+xIter[i])+"px";

	var topValue = parseInt(item.style.top);
	
	if(topValue<0){
		topValue=0;
		yIter[i]=VEC_Y + VEC_Y*(Math.random()-0.5);
	}
	else if(topValue>w_height - item.offsetHeight - 10){
		topValue=w_height - item.offsetHeight - 10;
		yIter[i]=-VEC_Y + VEC_Y*(Math.random()-0.5);
	}
	
	item.style.top = (topValue+yIter[i])+"px";

}