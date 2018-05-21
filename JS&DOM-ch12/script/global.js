window.onload=function(){
    hightLightPage();
    prepareSlideShow();
}

function insertAfter(newElement, targetElement){
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement){
        targetElement.appendChild(newElement);
    }else{
        parent.insertBefore(newElement,targetElement.nextSibling);   
    }
}

function addclass(element, value){
    if(!element.className){
        element.className = value;
    }else{
        newClassName = element.className;
        newClassName += "";
        newClassName += value;
        element.className = newClassName;
    }
}

//获取当前相对路径的方法
function GetUrlRelativePath(){
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if(relUrl.indexOf("?") != -1){
    relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

function hightLightPage(){
    if(!document.getElementsByTagName)return false;
    if(!document.getElementById)return false;
    var headers = document.getElementsByTagName("header");
    if(headers.length == 0)return false;
    var navs = document.getElementsByTagName("nav");
    if(navs.length == 0)return false;

    //TODO 没解决，当前页面高亮
    var links = navs[0].getElementsByTagName("a");
    var linkurl;
    for(var i = 0; i<links.length; i++){
        linkurl = links[i].getAttribute("href");
        // console.log(linkurl);
        // console.log(window.location.href);
        if(window.location.href.indexOf(linkurl) != -1){
            links[i].className = "here";
            var linktext = links[i].lastChild.nodeValue.toLocaleLowerCase();
            document.body.setAttribute("id",linktext);
        }
    }
}


function moveElement(elementID, final_x, final_y, interval){
    if(!document.getElementById)return false;
    if(!document.getElementById(elementID))return false;
    var elem = document.getElementById(elementID);
    if(elem.moveElement){
        clearTimeout(elem.moveElement);
    }
    if(!elem.style.left){
        elem.style.left = "0px";
    }
    if(!elem.style.top){
        elem.style.top = "0px";
    }
    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);
    if(xpos == final_x && ypos == final_y){
        return true;
    }
    if(xpos < final_x){
        var dist = Math.ceil((final_x - xpos)/10);
        xpos = xpos + dist;
    }
    if(xpos > final_x){
        var dist = Math.ceil((xpos - final_x)/10);
        xpos = xpos - dist;
    }
    if(ypos < final_y){
        var dist = Math.ceil((final_y - ypos)/10);
        ypos = ypos + dist;
    }
    if(ypos < final_y){
        var dist = Math.ceil((ypos - final_y)/10);
        ypos = ypos - dist;
    }
    elem.style.left = xpos +"px";
    elem.style.top = ypos +"px";
    var repeat = "moveElement('"+elementID+"',"+final_x+","+final_y+","+interval+")";
    elem.moveElement = setTimeout(repeat,interval);

}

function prepareSlideShow(){
    // 确保浏览器支持 DOM 方法
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) {return false};
    // 确保元素存在
    if (!document.getElementById("intro")) {return false};
    var intro = document.getElementById("intro");
    // 添加元素
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id", "slideshow");
    var frame = document.createElement("img");
    frame.setAttribute("id", "frame");
    frame.setAttribute("src", "images/frame.gif");
    frame.setAttribute("alt", "");
    slideshow.appendChild(frame);


    var preview = document.createElement("img");
    preview.setAttribute("id", "preview");
    preview.setAttribute("src", "images/slidershow.gif");
    preview.setAttribute("alt", "");
    slideshow.appendChild(preview);
    insertAfter(slideshow,intro);

    var links = document.getElementsByTagName("a");
    var destination;
    for(var i=0; i<links.length;i++){
        links[i].onmouseover = function(){
            destination = this.getAttribute("href");
            if(destination.indexOf("index.html") != -1){
                moveElement("preview",0,440,5);
            }
            if(destination.indexOf("about.html") != -1){
                moveElement("preview",150,440,5);
            }
            if(destination.indexOf("photos.html") != -1){
                moveElement("preview",300,440,5);
            }
            if(destination.indexOf("live.html") != -1){
                moveElement("preview",450,440,5);
            }
            if(destination.indexOf("contact.html") != -1){
                moveElement("preview",600,440,5);
            }


        }
    }


  }
