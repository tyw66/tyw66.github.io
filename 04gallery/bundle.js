
window.onload = function(){
	initGallery();
	//alert(typeof initGallery);
	//countbodychild();
}

//初始化工作
function initGallery(){
	//兼容性检测
	if(!document.getElementById || !document.getElementsByClassName){
		return false;
	}
	
	var gallery = document.getElementById("imgGallery");
	if(!gallery){
		return false;
	}
	
	//遍历链接，添加点击事件
	var links = gallery.getElementsByTagName("a");
	for(var i=0;i<links.length;i++){
		links[i].onclick = function(){
			return !showPic(this);
			//return !showPic(links[i]);//todo: 需用this, 这样写就不行
		}			
	}

	//创建并初始化图片显示区节点
	var imgZone = document.createElement("img");
	imgZone.setAttribute("id","imgZone");
	imgZone.setAttribute("src","./myPainting/000.jpg");
	imgZone.setAttribute("alt","my image gallery");
	var description = document.createElement("p");
	description.setAttribute("id","description");
	
	var dtext = document.createTextNode("Choose a picture.");
	description.appendChild(dtext);

	var body = document.getElementsByTagName("body")[0];
	body.appendChild(imgZone);
	body.appendChild(description);
	
}	



//显示节点的图片
function showPic(whichpic){
	var imgZone = document.getElementById("imgZone");
	if(!imgZone) return false;
	
	var source = whichpic.getAttribute("href");
	imgZone.setAttribute("src",source);
	
	var description = document.getElementById("description");
	if(description){
		//检测
		var words = whichpic.getAttribute("title")?whichpic.getAttribute("title"):"";
		//只有1个内容时，等价的
		description.childNodes[0].nodeValue=words;
		//description.firstChild.nodeValue=words;
		//description.innerHTML=words;		
	}

	return true;
}


function countbodychild(){
	var body_elem = document.getElementsByTagName("body")[0];
	alert(body_elem.childNodes.length);
}

