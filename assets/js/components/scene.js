module.exports = function() {
	
	var renderer, scene, camera, controls, floor;
	var raycaster = new THREE.Raycaster();
	var black = new THREE.Color('black');
	var white = new THREE.Color('white');
	var pink = new THREE.Color('#EE1181');
	var green = new THREE.Color(0x00ff00);
	var blackMaterial = new THREE.MeshBasicMaterial({ color: black });
	var greenMaterial = new THREE.MeshBasicMaterial({ color: green });
	var arrows = [];
	var mouse = new THREE.Vector2();
	var stats = new Stats();
	var wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x08CDFA });
	var adding = false;
	var arrowHelper;
	var previousArrowPoint;
	var count = 0;
	
	return {
		
		settings: {
			defaultCameraLocation: {
				x: 0,
				y: 5,
				z: 0
			},
			cameraSpeed: .215,
			messageDuration: 2000,
			arrowHeadSize: 1.5,
			colors: {
				worldColor: black,
				gridColor: pink,
				arrowColor: white
			}
		},
		
		init: function() {

			let self = this;
			self.loadFont();
		},
		
		begin: function() {
			
			let self = this;
			
			scene = gfx.setUpScene(scene);
			renderer = gfx.setUpRenderer(renderer);
			camera = gfx.setUpCamera(camera);
			floor = gfx.addFloor(scene, this.settings.colors.worldColor, this.settings.colors.gridColor);
			//gfx.enableStats(stats);
			//controls = gfx.enableControls(controls, renderer, camera);
			gfx.resizeRendererOnWindowResize(renderer, camera);
			gfx.setUpLights(scene);
			gfx.setCameraLocation(camera, self.settings.defaultCameraLocation);
			self.setUpButtons();
			
			var animate = function() {

				requestAnimationFrame(animate);
				renderer.render(scene, camera);
				//controls.update();
				stats.update();
				gfx.setCameraLocation(camera, new THREE.Vector3(self.settings.defaultCameraLocation.x - (self.settings.cameraSpeed * count), self.settings.defaultCameraLocation.y, self.settings.defaultCameraLocation.z));
				gfx.setCameraDirection(camera, new THREE.Vector3(self.settings.defaultCameraLocation.x + (1000 * count), self.settings.defaultCameraLocation.y, self.settings.defaultCameraLocation.z));
				//geometry.verticesNeedUpdate = true;
				count++;
			};
			
			animate(); 
		},
		
		loadFont: function() {
			
			let self = this;
			let loader = new THREE.FontLoader();
			let fontPath = '';
			fontPath = 'assets/vendors/js/three.js/examples/fonts/helvetiker_regular.typeface.json';

			loader.load(fontPath, function(font) { // success event
				
				if (gfx.appSettings.errorLogging) console.log('Fonts loaded successfully.');
				gfx.appSettings.font.fontStyle.font = font;
				
				self.begin();
				if (gfx.appSettings.axesHelper.activateAxesHelper) gfx.labelAxes(scene);
			},
			function(event) { // in progress event.
				if (gfx.appSettings.errorLogging) console.log('Attempting to load font JSON now...');
			},
			function(event) { // error event
				
				if (gfx.appSettings.errorLogging) console.log('Error loading fonts. Webserver required due to CORS policy.');
				gfx.appSettings.font.enable = false;
				self.begin();
			});
		},
		
		setUpButtons: function() {
			
			let self = this;
			let message = document.getElementById('message');
			
			let esc = 27;
			let A = 65;
			
			document.addEventListener('keydown', function(event) {
				
				if (event.keyCode === A) {
					adding = true;
					controls.enabled = false;
				}
			});
			
			document.addEventListener('keyup', function(event) {

				if (event.keyCode === A) {
					adding = false;
					controls.enabled = true;
				}
			});
			
			let onMouseMove = function(event) {

				mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
			};
			window.addEventListener('mousemove', onMouseMove, false);
			
			document.querySelector('canvas').addEventListener('click', function(event) {
				
				if (adding) {
					self.addArrow(event);
				}
			});
		}
	}
}