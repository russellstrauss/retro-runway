/* eslint-env browser */

import * as THREE from 'three';
import gfx from './graphics.js';
import utils from './utils.js';
import LeafGeometry from './LeafGeometry.js';
import PalmGenerator from './PalmGenerator.js';
import {PointLights} from './pointLights.js';
const OrbitControls = require('three-orbit-controls')(THREE);

var renderer, scene, camera, controls, floor;
var pink = new THREE.Color('#EE1181');
var seafoam = new THREE.Color('#7CA893');
var black = new THREE.Color('black');
var white = new THREE.Color('white');
let wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: pink, transparent: true, opacity: .3, side: THREE.DoubleSide });
var count = 0;
let sun, stars = [];
let textureImage, canvas;

var leafOptions = [
	{
		length: 52,
		length_stem: 2,
		width_stem: 0.30,
		leaf_width: 0.5,
		leaf_up: 1.5,
		density: 19,
		curvature: 0.01,
		curvature_border: 0.002,
		leaf_inclination: 1
	},
	{
		length: 55,
		length_stem: 8,
		width_stem: 0.8,
		leaf_width: 0.4,
		leaf_up: 6,
		density: 8,
		curvature: 0.04,
		curvature_border: 0.004,
		leaf_inclination: 0.70
	},
	{
		length: 90,
		length_stem: 40,
		width_stem: 0.8,
		leaf_width: 0.5,
		leaf_up: 0.4,
		density: 7,
		curvature: 0.03,
		curvature_border: 0.003,
		leaf_inclination: 1
	},
	{
		length: 90,
		length_stem: 2,
		width_stem: 0.2,
		leaf_width: 1,
		leaf_up: 6,
		density: 16,
		curvature: 0.01,
		curvature_border: 0.002,
		leaf_inclination: 0.8
	},
	{
		length: 59,
		length_stem: 3,
		width_stem: 0.5,
		leaf_width: 0.4,
		leaf_up: 1.5,
		density: 38,
		curvature: 0.01,
		curvature_border: 0.005,
		leaf_inclination: 0.9
	},
	{
		length: 50,
		length_stem: 26,
		width_stem: 0.5,
		leaf_width: 1,
		leaf_up: 0.1,
		density: 17,
		curvature: 0.05,
		curvature_border: 0.01,
		leaf_inclination: 1
	},
	{
		length: 52,
		length_stem: 3,
		width_stem: 0.5,
		leaf_width: 0.4,
		leaf_up: 1.5,
		density: 34,
		curvature: 0.03,
		curvature_border: 0.005,
		leaf_inclination: 0.2
	},
	{
		length: 50,
		length_stem: 26,
		width_stem: 0.5,
		leaf_width: 0.30,
		leaf_up: 0.1,
		density: 11,
		curvature: 0.01,
		curvature_border: 0.01,
		leaf_inclination: 1
	},
	{
		length: 50,
		length_stem: 4,
		width_stem: 0.5,
		leaf_width: 0.5,
		leaf_up: 1.5,
		density: 30,
		curvature: 0.03,
		curvature_border: 0.005,
		leaf_inclination: 0.70
	},
	{
		length: 90,
		length_stem: 7,
		width_stem: 0.8,
		leaf_width: 0.5,
		leaf_up: 6,
		density: 30,
		curvature: 0.02,
		curvature_border: 0.001,
		leaf_inclination: 0.9
	},
	{
		length: 50,
		length_stem: 20,
		width_stem: 0.2,
		leaf_width: 0.8,
		leaf_up: 1.5,
		density: 11,
		curvature: 0.04,
		curvature_border: 0.005,
		leaf_inclination: 0.9
	}
];

let settings = {
	defaultCameraLocation: {
		x: 0,
		y: 100,
		z: 0
	},
	cameraSpeed: .5,
	colors: {
		worldColor: black,
		gridColor: pink,
		arrowColor: white
	},
	runwayWidth: 300,
	treeSpacing: 250,
	sun: {
		size: 400,
		distance: 1200,
		height: 75,
		colors: {
			top: 'red',
			bottom: '#EE1181'
		}
	}
};

function init() {
	
    scene = gfx.setUpScene(scene);
	renderer = gfx.setUpRenderer(renderer);
	camera = gfx.setUpCamera(camera);
	floor = gfx.addFloor(scene, settings.colors.worldColor, settings.colors.gridColor);
	//controls = enableControls(controls, renderer, camera);
	
    window.addEventListener('resize', function() {
        let WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
	});
	
	//add lights to the scene
    // let ambientLight = new THREE.AmbientLight( 0x34ac0f );
    // scene.add( ambientLight );
    // renderer.setClearColor( 0x434343 );
    // PointLights().map((light) => {
    //     scene.add( light );
	// });
	// gfx.setCameraLocation(camera, new THREE.Vector3(settings.defaultCameraLocation.x, settings.defaultCameraLocation.y, settings.defaultCameraLocation.z));
	// gfx.setCameraDirection(camera, new THREE.Vector3(settings.defaultCameraLocation.x + 1000, settings.defaultCameraLocation.y, settings.defaultCameraLocation.z));
	
	for (let i = 0; i < 1000; i++) {
		
		let randomX = weightedRandom(10000, 3);
		let randomZ = weightedRandom(10000, 3);
		randomX -= 5000;
		randomZ -= 5000;
			
		// let star = gfx.showPoint(new THREE.Vector3(randomX, 1000, randomZ), scene, white, .25);
		// stars.push(star);
	}
	
	// sun gradient
	var texture = new THREE.Texture( generateTexture() );
	textureImage = texture.image
	var texture = new THREE.Texture( generateTexture() );
	texture.needsUpdate = true; // important!
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5, fog: false } );
	var geometry = new THREE.CircleGeometry( settings.sun.size, 32 );
	geometry.translate(0, settings.sun.height, 0);
	geometry.rotateY(-Math.PI / 2);

	//var material = new THREE.MeshBasicMaterial( { color: pink, fog: false } );
	sun = new THREE.Mesh( geometry, material );
	sun.position.x = settings.sun.distance;
	scene.add(sun);
	
	let trees = [];
	for (let i = 0; i < 50; i++) {
		
		let leaf_opt = {
			length: randomInt(20, 50),
			length_stem: randomInt(2, 4),
			width_stem: .1,
			leaf_width: 0.5,
			leaf_up: 1.5,
			density: 30,
			curvature: 0.03,
			curvature_border: 0.005,
			leaf_inclination: 0.70
		};
	
		let palm_opt = {
			spread: .2,
			angle: 137.5,
			num: 1000,
			growth: 0.25,
			foliage_start_at: 55,
			trunk_regular: false,
			buffers: false,
			angle_open: 80,
			starting_angle_open: 50
		};
		
		let curve = false;
		if (i % 4 == 0) curve = getCurve();
		let trunkGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
		let leafGeometry = new LeafGeometry(leafOptions[randomInt(0, leafOptions.length)]);
		let palm = new PalmGenerator(leafGeometry, trunkGeometry, palm_opt, curve);
		let geometry = palm.geometry;
		let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		let mesh = new THREE.Mesh(bufGeometry, wireframeMaterial);
		scene.add(mesh);
		mesh.position.z -= settings.runwayWidth + randomInt(-50, 50);
		mesh.position.x -= (settings.treeSpacing * i - 1500) + randomInt(-50, 50);
		trees.push(mesh);
	}
	
	for (let i = 0; i < 50; i++) {
		
		let leaf_opt = {
			length: randomInt(20, 50),
			length_stem: 4,
			width_stem: 0.5,
			leaf_width: 0.5,
			leaf_up: 1.5,
			density: 30,
			curvature: 0.03,
			curvature_border: 0.005,
			leaf_inclination: 0.70
		};
	
		let palm_opt = {
			spread: .2,
			angle: 137.5,
			num: 1000,
			growth: 0.25,
			foliage_start_at: 55,
			trunk_regular: false,
			buffers: false,
			angle_open: 80,
			starting_angle_open: 50
		};
		
		let curve = false;
		if (i % 4 == 0) curve = getCurve();
		let trunkGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
		let leafGeometry = new LeafGeometry(leafOptions[randomInt(0, 11)]);
		let palm = new PalmGenerator(leafGeometry, trunkGeometry, palm_opt, curve);
		let geometry = palm.geometry;
		let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
		let mesh = new THREE.Mesh(bufGeometry, wireframeMaterial);
		scene.add(mesh);
		mesh.position.z += settings.runwayWidth  + randomInt(-50, 50);
		mesh.position.x -= (settings.treeSpacing * i - 1500) + randomInt(-50, 50);
		trees.push(mesh);
	}
	
	animate();
}

var animate = function() {

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	
	if (gfx.getDistance(camera.position, new THREE.Vector3(0, 0, 0)) > 10000) { // Reset camera location
		gfx.setCameraLocation(camera, new THREE.Vector3(settings.defaultCameraLocation.x, settings.defaultCameraLocation.y, settings.defaultCameraLocation.z));
		sun.position.x = camera.position.x + settings.sun.distance;
		count = 0;
	}
	else {
		gfx.setCameraLocation(camera, new THREE.Vector3(settings.defaultCameraLocation.x - (settings.cameraSpeed * count), settings.defaultCameraLocation.y, settings.defaultCameraLocation.z));
		gfx.setCameraDirection(camera, new THREE.Vector3(settings.defaultCameraLocation.x + (1000 * count), settings.defaultCameraLocation.y, settings.defaultCameraLocation.z));
	}
	
	let horizonDistance = settings.defaultCameraLocation.x - (settings.cameraSpeed * count) + settings.sun.distance;
	sun.position.x = horizonDistance;
	stars.forEach(function(star) {
		//star.position.x = horizonDistance;
	});
	count++;
};

function getCurve(){
    var curve = new THREE.CatmullRomCurve3( [
	      new THREE.Vector3( randomInt(-15, 15), 200, 0 ),
	      new THREE.Vector3( randomInt(-15, 15), 100, 0 ),
	      new THREE.Vector3( 0, 60, 0 ),
	      new THREE.Vector3( 0, 0, 0 ),
    ] );
    return curve;
}

function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function enableControls(controls, renderer, camera) {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.dampingFactor = 0.05;
	controls.zoomSpeed = 2;
	controls.enablePan = !utils.mobile();
	controls.minDistance = 10;
	controls.maxDistance = 500;
	controls.maxPolarAngle = Math.PI / 2;
	return controls;
}

function weightedRandom(max, bellFactor) { // bellFactor 1, 2, 3
    var num = 0;
    for (var i = 0; i < bellFactor; i++) {
        num += Math.random() * (max/bellFactor);
    }    
    return num;
}

function generateTexture() {

	var size = 512;

	// create canvas
	canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;

	// get context
	var context = canvas.getContext( '2d' );

	// draw gradient
	context.rect( 0, 0, size, size );
	var gradient = context.createLinearGradient( size/2, 0, size/2, size );
	gradient.addColorStop(.25, settings.sun.colors.top);
	gradient.addColorStop(.8, settings.sun.colors.bottom);
	context.fillStyle = gradient;
	context.fill();

	return canvas;
}

init();
