window.onload = init();

function init(){
	var date = new Date(); 
	var setupDate=new Date();
	setupDate.setFullYear(2017,7,16);	
	var time=date.getTime()-setupDate.getTime();
	//计算出相差天数
	var days=Math.floor(time/(24*3600*1000))
	document.getElementById('dateNav').innerHTML="今天是："+date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDay()+"日";
	document.getElementById('timeSpan').innerHTML="网站已建立"+days+"天";
}
//每秒执行一次
//setInterval("window.onload()","1000");		