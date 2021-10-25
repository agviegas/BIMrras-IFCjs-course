import { Vector2, Raycaster, Scene, PerspectiveCamera, AmbientLight, DirectionalLight, WebGLRenderer, GridHelper, AxesHelper, Mesh, BoxBufferGeometry, BoxGeometry, MeshStandardMaterial } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui';
import gsap from 'gsap'

//Creates the Three.js scene
const scene = new Scene();

//Object to store the size of the viewport
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Creates grids and axes in the scene
const grid = new GridHelper(50, 30);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

//Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  (size.width = window.innerWidth), (size.height = window.innerHeight);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

// Objects


const cubeGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshStandardMaterial({color: 0xff0000});
const cube = new Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Dat gui

const gui = new dat.GUI()

gui.add(cube.position, 'x', -3, 3, 0.5).name('cube position');

gui.add(cube, 'visible').name('cube visibility');

const colorParam = {
    color: 0xff0000
}

gui.addColor(colorParam, 'color').onChange(() => {
    cubeMaterial.color.set(colorParam.color);
})

// Folders
gui.addFolder('Material').add(cubeMaterial, 'wireframe').name('Wireframe');


// Ray casting

const raycaster = new Raycaster();
const mouse = new Vector2();

window.onmousemove = ( event ) => {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set( 0x0000ff );

	}

}

// Animations

gsap.to(cube.position, {x: 2, duration: 1, delay: 1});

