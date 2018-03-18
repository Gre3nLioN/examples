var renderer = new  THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
var controls = new THREE.TrackballControls(camera,renderer.domElement);

var backgroundScene = new THREE.Scene();
var backgroundCamera = new THREE.Camera();

var groundWidth = window.innerWidth,
	groundLength = 100;

//lights
var spotLight =new THREE.PointLight( 0xffffff, 2, 50 ); 

init();
update();
function init() { // renderer
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( 0xfff555, 0 );
	renderer.shadowMapEnabled = true;
//	renderer.shadowMapDebug = true;
	document.body.appendChild(renderer.domElement);

	var loader = new THREE.JSONLoader();
//	loader.load('./models/world.json', callBackMesh);
//	loader.load('./models/world.json', callBackMars);
	loader.load('./models/world.json', callBackSun);
	loader.load('./models/planta.json', callPlanta);
	addCamera();
	addControls();
	addLight();
	addGround();
	addCube();
}

function addCamera(){
	camera.position.z = 50 ;
	camera.position.y = -100 ;
}

function addControls(){
	controls.rotateSpeed = .1;
	controls.zoomSpeed = .7;
	controls.panSpeed = 0.1;
	controls.addEventListener( 'change', render );
}

function update() {
	requestAnimationFrame(update);
	controls.update();
	render();
}

function render(){
	var time = Date.now() * 0.0005;
    spotLight.position.x = Math.sin( time * 0.7 ) * 10;
	spotLight.position.y = Math.cos( time * 0.5 ) * 20;
	spotLight.position.z = Math.cos( time * 0.3 ) * 10;
	renderer.render(scene, camera);
}

function callBackSun(geometry, materials) {

	var imagen = new THREE.ImageUtils.loadTexture('./textures/sun.jpg');
	material = new THREE.MeshLambertMaterial({
		map: imagen
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.scale.set(10, 10, 5);
	mesh.position.set(-10, 0, 20);
	mesh.rotation.y=Math.PI; 
	mesh.castShadow= true;
	mesh.receiveShadow = true;
	scene.add(mesh);


};
function callPlanta(geometry, materials) {

	var imagen = new THREE.ImageUtils.loadTexture('./textures/paloagua.jpg');
	material = new THREE.MeshLambertMaterial({
		map: imagen
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.scale.set(20, 20, 5);
	mesh.position.set(-10, -11, -10);
	mesh.rotation.x = Math.PI /2;
	mesh.castShadow= true;
	mesh.receiveShadow = true;
	scene.add(mesh);


};

function addCube(){
	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	var imagen = new THREE.ImageUtils.loadTexture('./textures/brown.jpg');
	var material = new THREE.MeshLambertMaterial({
		map: imagen,
		specular: 0x555fff,
		ambient: 0x555555,
	   	shininess: 50,
	   	shading: THREE.SmoothShading
	});
	geometry.computeMorphNormals();

	var cube = new THREE.MorphAnimMesh( geometry, material );
	cube.position.set(-60, 0, 0);
	cube.rotation.x = Math.PI / 2.8;
	cube.castShadow = true;
	cube.receiveShadow = true;
	scene.add(cube);

}

function addLight(){
	spotLight.position.set( 0, 10, -55 );
	var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

	spotLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );

	scene.add( spotLight );


	var sunlight = new THREE.DirectionalLight();

	sunlight.position.set(9, 600, 100);
	sunlight.intensity = 1.3;
	addShadows(sunlight);
	scene.add(sunlight);
	
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.25 );
	hemiLight.color.setHSL( 0.6, 1, 0.75 );
	hemiLight.groundColor.setHSL( 0.1, 0.8, 0.7 );
	hemiLight.position.y = 400;
	scene.add( hemiLight );
}

function addShadows(light){
	light.castShadow = true;
	light.ShadowCameraVisible = true;
	light.shadowCameraNear = 250;
	light.shadowCameraFar = 2000;
	light.ShadowCameraLeft = -200;
	light.shadowCameraRight = 200;
	light.shadowCameraTop = 200;
	light.shadowCameraBottom = -200;
}


function addGround() {	
	var groundTexture = THREE.ImageUtils.loadTexture('./textures/ground.jpg');
	var geometry = new THREE.PlaneGeometry(windowHalfX, windowHalfY);
	var material =  new THREE.MeshPhongMaterial({
            map: groundTexture
        });
    var ground = new THREE.Mesh(geometry, material );
	ground.receiveShadow = true;
    ground.position.set(0, -10, -10);
    scene.add(ground);
}
