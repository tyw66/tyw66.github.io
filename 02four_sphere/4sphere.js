var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


init();
animate();
function mk_model(objName,textureName,x,y,z){
	// load texture
	var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};
	var textureLoader = new THREE.TextureLoader( manager );
	var texture = textureLoader.load( textureName );

	// load model
	var onProgress = function ( xhr ) {
		document.getElementById("state-output").innerHTML = "Loading....Please Wait.";
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};

	var loader = new THREE.OBJLoader( manager );
	var object;
	loader.load( objName, function ( object ) {
		
		document.getElementById("state-output").innerHTML = "Load finish.";
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = texture;
			}
		} );
		//设置模型在场景中的位置
		object.position.x = x;
		object.position.y = y;
		object.position.z = z;	
		scene.add(object);
	}, onProgress, onError );

}

function init() {
	
	// setup scene
	scene = new THREE.Scene();

	// setup light
	var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1.0 );//颜色 强度
	scene.add( ambientLight );
	//var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	//scene.add( pointLight );
	
	// setup camera
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 250;	
	//camera.lookAt(scene.position);
	scene.add( camera );

	// load model
	if(window.innerWidth > window.innerHeight){
		var obj1 = mk_model('model/sphere.obj','texture/1.png',-50,10,0);
		var obj2 = mk_model('model/sphere.obj','texture/2.png',50,10,0);
		var obj3 = mk_model('model/sphere.obj','texture/3.png',-50,-30,0);
		var obj4 = mk_model('model/sphere.obj','texture/4.png',50,-30,0);
	}
	else{
		var obj1 = mk_model('model/sphere.obj','texture/1.png',0,50,0);
		var obj2 = mk_model('model/sphere.obj','texture/2.png',0,10,0);
		var obj3 = mk_model('model/sphere.obj','texture/3.png',0,-30,0);
		var obj4 = mk_model('model/sphere.obj','texture/4.png',0,-70,0);
	}
	
	//setup renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );	
	renderer.setClearColor(0xEEEEEE, 1.0);
	//renderer.shadowMapEnabled=true;//告诉render我们需要阴影(允许阴影隐射)
		
	container = document.createElement( 'div' );
	container.appendChild( renderer.domElement );
	document.body.appendChild( container );
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) ;
	mouseY = ( event.clientY - windowHalfY ) ;

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x );
	camera.position.y += ( - mouseY - camera.position.y ) ;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}