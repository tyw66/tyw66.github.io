function showPic(whichpic){
	var source = whichpic.getAttribute("href");
	var imagezone = document.getElementById("imagezone");
	imagezone.setAttribute("src",source);
	
	var words = whichpic.getAttribute("title");
	var description = document.getElementById("description");

	////只有1个内容时，等价的
	description.childNodes[0].nodeValue=words;
	description.firstChild.nodeValue=words;
	//description.innerHTML=words;
}

function countbodychild(){
	var body_elem = document.getElementsByTagName("body")[0];
	alert(body_elem.childNodes.length);
}

//window.onload = countbodychild;