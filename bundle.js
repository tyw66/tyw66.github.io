window.onload = init();

function init(){
	var date = new Date(); 
	var setupDate=new Date();
	setupDate.setFullYear(2017,8,16);	
	var time=date.getTime()-setupDate.getTime();
	//计算出相差天数
	var days=Math.floor(time/(24*3600*1000))
	document.getElementById('dateNav').innerHTML="当前："+date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+"日";
	document.getElementById('timeSpan').innerHTML="网站已建立"+days+"天";

	//获取当前年份，显示版权信息
	var copyRightInfo="Copyright &copy 2017 - "+date.getFullYear()+" tyw66. All Rights Reserved. tyw66@qq.com 版权所有";
	document.getElementById('copyRight').innerHTML=copyRightInfo;
}
//每秒执行一次
//setInterval("window.onload()","1000");		