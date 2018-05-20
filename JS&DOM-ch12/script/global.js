window.onload=function(){
    hightLightPage();
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