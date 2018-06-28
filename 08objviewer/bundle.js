window.onload = function(){
	main();
}


function main(){
	//场景
	var scene = new THREE.Scene();
	//相机
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000 );
	//渲染器
	var renderer = new THREE.WebGLRenderer();
	//环境光
	var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1.0 );//颜色 强度
	//轴
	var axesHelper = new THREE.AxesHelper(10);
	
	//光标位置
	var mouseX = 0;
	var mouseY = 0;
	//相机离物体的距离
	var view_distance = 150;
	
	//加载管理器
	var loadManager = new THREE.LoadingManager();
	//网格
	var mesh = new THREE.Mesh();
	//材质
	var mat = new THREE.MeshBasicMaterial();

	//路径
	var objPath = './res/obj_lego/lego.obj';
	var mtlPath = './res/obj_lego/lego.mtl';
	var texturePath = './res/obj_lego/lego.png';

	//GUI
	var controls = new function () {
		this.zoomDist = 150;
		this.model = "lego-spiderman";
	};
	var gui = new dat.GUI();
	gui.add(controls,"zoomDist",0,1000);
	gui.add(controls,"model",["lego-spiderman","cube"]).onChange(function(e){
	if(e=="lego-spiderman"){
		myModel = '../assets/lego.obj';

	}
	else if(e=="cube"){
		myModel = '../assets/cube.obj';

	}
	});

	initThreeJS();
	// loadObj();
	loadMyObjModel(objPath, mtlPath, texturePath);
	render_cycle();


	///初始化场景
	function initThreeJS(){
		//场景

		//相机				
		camera.position.set(0,0,controls.zoomDist);				
		camera.lookAt(scene.position);
		scene.add(camera);

		//轴
		scene.add(axesHelper);

		//灯光
		scene.add(ambientLight);				

		//渲染器				
		renderer.antialias = true;
		renderer.setSize( window.innerWidth, window.innerHeight );	
		renderer.setClearColor(0xeeeeee, 1.0);						


		//布局
		var viewer = document.getElementById('main-part');
		viewer.appendChild( renderer.domElement );
		//document.body.appendChild( renderer.domElement );				
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
 		viewer.addEventListener( 'DOMMouseScroll' ,onDocumentMouseWheel, false);//for firfox?
		//viewer.addEventListener( 'mousewheel' ,onDocumentMouseWheel, false);//for chorme？
		window.addEventListener( 'resize', onWindowResize, false );
	}

	//响应窗口大小改变
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	//响应鼠标移动
	function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX ) ;
		mouseY = ( event.clientY ) ;
	}
	
	//响应鼠标滚轮移动
	function onDocumentMouseWheel( event ) {
		if(event.detail == -3){//向前滚
			view_distance -= 10;	
			console.log("mouse forward");				
		}
		else{//向后滚
			view_distance += 10;
			console.log("mouse backward");
		}
		if(view_distance < 0.1)view_distance=0.1;
	}

		
	///初始化模型
	// function loadObj(){
	// 	mesh = loadMyObjModel(objPath, mtlPath, texturePath);
	// 	scene.add(mesh);	
	// 	return renderer.render(scene, camera);
	// }

	loadManager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};


	//加载模型	
	function loadMyObjModel(objPath_,mtlPath_,texturePath_){
		//加载纹理
		if(texturePath_){//判断为空todo
			var textureLoader = new THREE.TextureLoader(loadManager);
			var texture = textureLoader.load(texturePath_);
		}
		else{
			console.log("纹理路径为空");
		}

		//加载模型 + 图片纹理			
		var objMesh = new THREE.Mesh();
		var objloader = new THREE.OBJLoader(loadManager);
		objloader.load(objPath_,
			//加载后
			function(obj){					
				console.log("obj load finish.");	
				document.getElementById("state-output").innerHTML = "Load finish.";
				//函数traverse(callback)遍历调用者和调用者的所有后代，callback参数是一个函数，被调用者和每一个后代对象调用callback(this)。	
				obj.traverse(function ( child ) {
					if ( child instanceof THREE.Mesh ) {
							
						// objMesh = child;
						// objMesh.material.map = texture;
						// objMesh.position.set(0,0,0);
						// console.log(objMesh);

						obj.traverse( function ( child ) {
							if ( child instanceof THREE.Mesh ) {
								child.material.map = texture;
								child.position.set(0,-50,0);
							}
						} );
						scene.add(obj);
						renderer.render(scene, camera);
						// return objMesh;
					}
				});
			},
			//加载中
			function(xhr){
				console.log("On obj model Progress.....");
				document.getElementById("state-output").innerHTML = "Loading....Please Wait.";
			},
			//加载出错
			function(xhr){
				console.log("OBJ model load Error.");
				console.log(xhr);
			}					
		);
		// return objMesh;
	}
	
	//动画渲染循环
	function render_cycle() {
		requestAnimationFrame( render_cycle );
		renderAnimate();

		renderer.render(scene, camera)
	}

	//相机动画
	function renderAnimate(){
		camera.position.x = controls.zoomDist * Math.cos( (360*mouseX/window.innerWidth-90)*3.14/180 );
		camera.position.z = controls.zoomDist * Math.sin( (360*mouseX/window.innerWidth-90)*3.14/180 );
		camera.position.y = controls.zoomDist * Math.sin( (180*mouseY/window.innerHeight-90)*3.14/180);
		return camera.lookAt( scene.position );
	}
	
	
}





