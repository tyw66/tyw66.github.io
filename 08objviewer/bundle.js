window.onload = function () {
	main();
}


function main() {
	//0.变量
	//光标位置
	var mouseX = 0;
	var mouseY = 0;

	//相机离物体的距离
	var view_distance = 150;

	//记录上一个模型 用于删除
	var lastModel;

	//路径变量
	var objPath;
	var mtlPath;
	var texturePath;

	objPath = './res/obj_lego/lego.obj';
	mtlPath = './res/obj_lego/lego.mtl';
	texturePath = './res/obj_lego/lego.png';

	//dat-GUI
	var controls = new function () {
		this.zoomDist = 150;
		this.model = "乐高蜘蛛侠";
	};
	var gui = new dat.GUI();
	gui.add(controls, "zoomDist", 0, 1000);
	gui.add(controls, "model", ["乐高蜘蛛侠", "玉"]).onChange(function (e) {
		if (e == "乐高蜘蛛侠") {
			objPath = './res/obj_lego/lego.obj';
			mtlPath = './res/obj_lego/lego.mtl';
			texturePath = './res/obj_lego/lego.png';
			loadMyObjModel(objPath, mtlPath, texturePath);
		}
		else if (e == "玉") {
			objPath = './res/obj_jade/jade.obj';
			mtlPath = './res/obj_jade/jade.mtl';
			texturePath = './res/obj_jade/jade.png';
			loadMyObjModel(objPath, mtlPath, texturePath);
		}
	});


	//1.初始化场景
	//场景
	var scene = new THREE.Scene();
	//相机
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
	//渲染器
	var renderer = new THREE.WebGLRenderer();
	//环境光
	var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);//颜色 强度
	//轴
	var axesHelper = new THREE.AxesHelper(10);

	initThreeJS();
	function initThreeJS() {
		//场景

		//相机				
		camera.position.set(0, 0, controls.zoomDist);
		camera.lookAt(scene.position);
		scene.add(camera);

		//轴
		scene.add(axesHelper);

		//灯光
		scene.add(ambientLight);

		//渲染器				
		renderer.antialias = true;
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xeeeeee, 1.0);


		//布局
		var viewer = document.getElementById('main-part');
		viewer.appendChild(renderer.domElement);
		//document.body.appendChild( renderer.domElement );				
		document.addEventListener('mousemove', onDocumentMouseMove, false);
		//viewer.addEventListener( 'DOMMouseScroll' ,onDocumentMouseWheel, false);//for firfox?
		viewer.addEventListener('mousewheel', onDocumentMouseWheel, false);//for chorme？
		window.addEventListener('resize', onWindowResize, false);
	}

	//响应窗口大小改变
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	//响应鼠标移动
	function onDocumentMouseMove(event) {
		mouseX = (event.clientX);
		mouseY = (event.clientY);
	}

	//响应鼠标滚轮移动
	function onDocumentMouseWheel(event) {
		if (event.detail == -3) {//向前滚
			view_distance -= 10;
			console.log("向前滚");
		}
		else {//向后滚
			view_distance += 10;
			console.log("向后滚");
		}
		if (view_distance < 0.1) view_distance = 0.1;
	}



	//2.加载模型
	loadMyObjModel(objPath, mtlPath, texturePath);
	//加载管理器
	var loadManager = new THREE.LoadingManager();
	loadManager.onProgress = function (item, loaded, total) {
		console.log("item:", item, "load:", loaded, "/", total);
	};
	//加载模型	
	function loadMyObjModel(objPath_, mtlPath_, texturePath_) {
		//检查路径
		document.getElementById("state-output1").innerHTML = "";
		if (!objPath_) {
			document.getElementById("state-output1").innerHTML = "找不到obj文件路径，加载终止.";
			return;
		}
		if (!mtlPath_) {
			document.getElementById("state-output1").innerHTML = "材质文件：空。";
		}
		if (!texturePath_) {
			document.getElementById("state-output1").innerHTML += "贴图文件：空。";
		}
				
		var objloader = new THREE.OBJLoader(loadManager);
		var mtlloader = new THREE.MTLLoader();
		var textureLoader = new THREE.TextureLoader(loadManager);
		
		//加载纹理
		var texture = textureLoader.load(texturePath_);
		
		//加载MTL
		mtlloader.load(mtlPath_, function (materials) {
			materials.preload();
			//objloader.setMaterials(materials);
		});

		//加载模型
		objloader.load(objPath_,
			//加载后
			function (obj) {
				console.log("obj load finish.");
				document.getElementById("state-output2").innerHTML = "Load finish.";
				//函数traverse(callback)遍历调用者和调用者的所有后代，callback参数是一个函数，被调用者和每一个后代对象调用callback(this)。	
				obj.traverse(function (child) {
					if (child instanceof THREE.Mesh) {
						child.material.map = texture;
						//child.position.set(0, -50, 0);
						scene.remove(lastModel);
						scene.add(obj);
						lastModel = obj;
						renderer.render(scene, camera);
					}
				});
			},
			//加载中
			function (xhr) {
				console.log("On obj model Progress.....");
				document.getElementById("state-output2").innerHTML = "Loading....Please Wait.";
			},
			//加载出错
			function (xhr) {
				console.log("OBJ model load Error.");
				document.getElementById("state-output2").innerHTML = "OBJ model load Error.";
				console.log(xhr);
			}
		);

	}


	//3.动画渲染循环
	render_cycle();
	function render_cycle() {
		requestAnimationFrame(render_cycle);
		renderAnimate();

		renderer.render(scene, camera)
	}

	//相机动画
	function renderAnimate() {
		camera.position.x = controls.zoomDist * Math.cos((360 * mouseX / window.innerWidth - 90) * 3.14 / 180);
		camera.position.z = controls.zoomDist * Math.sin((360 * mouseX / window.innerWidth - 90) * 3.14 / 180);
		camera.position.y = controls.zoomDist * Math.sin((180 * mouseY / window.innerHeight - 90) * 3.14 / 180);
		return camera.lookAt(scene.position);
	}


}

