window.onload = function(){
	initThreeJS();
	render_cycle();
}

function initThreeJS(){
	var mouseX = 0;
	var mouseY = 0;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var view_distance = 30;//相机离物体的距离

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
	var renderer = new THREE.WebGLRenderer( { antialias: true } );
	var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1.0 );//颜色 强度
	var mat = new THREE.MeshBasicMaterial();

	var axesHelper = new THREE.AxesHelper(10);

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
	renderer.setSize( window.innerWidth, window.innerHeight );	
	renderer.setClearColor(0xeeeeee, 1.0);						


	//布局
	document.body.appendChild( renderer.domElement );				
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'DOMMouseScroll' ,onDocumentMouseWheel, false);
	window.addEventListener( 'resize', onWindowResize, false );
							
	//模型	
	function loadMyObjModel(objPath_, mtlPath_,texturePath){
		var objMesh = new THREE.Mesh();
		var objloader = new THREE.OBJLoader();
		var obj;				
		objloader.load(objPath_,mtlPath_,
			function(obj){	
				
				console.log(obj);	
				//函数traverse(callback)遍历调用者和调用者的所有后代，callback参数是一个函数，被调用者和每一个后代对象调用callback(this)。	
				obj.traverse(function ( child ) {
					if ( child instanceof THREE.Mesh ) {
							
						objMesh = child;
						//var myTexture = THREE.ImageUtils.loadTexture(texturePath);
						//objMesh.material.map = myTexture;
						console.log(objMesh);
						// return objMesh;
					}
				});
			},
		function(xhr){console.log("On obj model Progress.....");},
		function(xhr){console.log("OBJ model load Error.");console.log(xhr);}					
		);
		return objMesh;
	}

	var obj = new THREE.Mesh();
	obj = loadMyObjModel(objPath, mtlPath, "");
	obj.position.set(0,0,0);
	scene.add(obj);

	return renderer.render(scene, camera);



	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		}
		
		function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX ) ;
		mouseY = ( event.clientY ) ;
		}
		
		function onDocumentMouseWheel( event ) {
		console.log("mouse");
		if(event.detail == -3){//向前滚
			view_distance -= 10;					
		}
		else{//向后滚
			view_distance += 10;
		}
		if(view_distance<0.1)view_distance=0.1;
		}
		
		function renderAnimate(){
		camera.position.x = controls.zoomDist * Math.cos( (360*mouseX/window.innerWidth-90)*3.14/180 );
		camera.position.z = controls.zoomDist * Math.sin( (360*mouseX/window.innerWidth-90)*3.14/180 );
		camera.position.y = controls.zoomDist * Math.sin( (180*mouseY/window.innerHeight-90)*3.14/180);
		return camera.lookAt( scene.position );
		}
		
		function render_cycle() {
		requestAnimationFrame( render_cycle );
		renderAnimate();
		//render();
		renderer.render(scene, camera)
		}
}




