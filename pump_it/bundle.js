var w_height = window.innerHeight;
var w_width = window.innerWidth;

var xIter=10;
var yIter=10;

var moveItems;

window.onload = function(){
	moveItems = this.document.getElementsByClassName("moveItems");
	
	
	init();
	setInterval("cycle()",200);
	


}

function init(){	
	for(var i = 0; i<moveItems.length;++i){
		moveItems[i].style.top = Math.random()*w_height + "px";
		moveItems[i].style.left = Math.random()*w_height + "px";

	}

}

function cycle(){
	for(var i = 0; i<moveItems.length;++i){
		var item = moveItems[i];
		moveElem(item);

	}
	
}

function moveElem(item){
	var leftValue = parseInt(item.style.left);
	if(leftValue<0){
		leftValue=0;
		xIter=10;
	}
	else if(leftValue>w_width - item.offsetWidth - 2){
		leftValue=w_width - item.offsetWidth - 2;
		xIter=-10;		
	}
	item.style.left = (leftValue+xIter)+"px";


	var topValue = parseInt(item.style.top);
	if(topValue<0){
		topValue=0;
		yIter=10;
	}
	else if(topValue>w_height - item.offsetHeight - 2){
		topValue=w_height - item.offsetHeight - 2;
		yIter=-10;
	}
	item.style.top = (topValue+yIter)+"px";


}