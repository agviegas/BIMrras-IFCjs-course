import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Raycaster,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCSLAB } from "web-ifc";
import {IFCLoader} from "web-ifc-three/IFCLoader";

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

const ifcLoader = new IFCLoader();


//Sets up the IFC loading

  const input = document.getElementById("file-input");

  input.addEventListener("change",

    async (changed) => {
     
      const file = changed.target.files[0];
      const ifcURL = URL.createObjectURL(file);
      const ifcModel = await ifcLoader.loadAsync(ifcURL);
      scene.add(ifcModel);
      processIfc(ifcModel);
    },

    false
  );

  const raycaster = new Raycaster();

  async function processIfc(ifcModel) {

    // const slabs = await ifcLoader.ifcManager.getAllItemsOfType(modelID, IFCSLAB, false);
    // const slab = slabs[0];
    // const slabProperties = await ifcLoader.ifcManager.getItemProperties(modelID, slab, false);
    // console.log(slabProperties);

    // const slabPsets = await ifcLoader.ifcManager.getPropertySets(modelID, slab, true);
    // console.log(slabPsets);

    const tree = await ifcLoader.ifcManager.getSpatialStructure(0);
    console.log(tree);



    ifcLoader.ifcManager.getExpressId()

  }
