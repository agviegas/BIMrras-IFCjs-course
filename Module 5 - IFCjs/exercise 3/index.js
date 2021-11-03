import {IfcViewerAPI} from 'web-ifc-viewer';
import {Color} from 'three';
import {IFCSPACE, IFCOPENINGELEMENT} from 'web-ifc';

// Setup IFC

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({container, backgroundColor: new Color(255, 255, 255)});
viewer.clipper.active = true;
viewer.addAxes();
viewer.addGrid();

viewer.context.renderer.usePostproduction = true;

let tree;
const models = [];

async function loadIFCFromURL(URL) {

    await viewer.IFC.loader.ifcManager.useWebWorkers(true, "./files/IFCWorker.js");

    viewer.IFC.loader.ifcManager.setOnProgress((event) => {
        console.log(event.loaded, event.total);
    });

    await viewer.IFC.loader.ifcManager.applyWebIfcConfig({
        USE_FAST_BOOLS: false,
        COORDINATE_TO_ORIGIN: true
    });

    await viewer.IFC.loader.ifcManager.parser.setupOptionalCategories({
        [IFCSPACE]: false,
        [IFCOPENINGELEMENT]: false
    })

    const model = await viewer.IFC.loadIfcUrl(URL);
    if (model === null) return;
    models.push(model);
    tree = await viewer.IFC.getSpatialStructure(model.modelID);
    console.log(tree);
    createTreeMenu(tree);
}

// loadIFCFromURL('test.ifc');

// Setup GUI

const GUI = {
    input: document.getElementById("file-input"),
    open: document.getElementById("open-button"),
    props: document.getElementById("ifc-property-menu-root")
}

GUI.open.onclick = () => GUI.input.click();

GUI.input.onchange = async (changed) => {
    const file = changed.target.files[0];
    const ifcURL = URL.createObjectURL(file);

    loadIFCFromURL(ifcURL)
}


container.onmousemove = () => viewer.IFC.prePickIfcItem();

window.ondblclick = async () => {
    const found = await viewer.IFC.pickIfcItem(true);
    if (found === null) return;
    const properties = await viewer.IFC.getProperties(found.modelID, found.id, true);
    createPropertiesMenu(properties);
};

window.onkeydown = (event) => {
    if (event.code === 'Escape') {
        createPropertiesMenu({});
        viewer.IFC.unpickIfcItems();
    } else if (event.code === 'KeyC') {
        viewer.clipper.createPlane();
    } else if(event.code === 'Delete') {
        viewer.clipper.deletePlane();
        viewer.dimensions.delete()
    } else if(event.code === 'KeyD') {
        viewer.dimensions.active = true;
        viewer.dimensions.previewActive = true;
        viewer.IFC.unpickIfcItems();
        viewer.IFC.unPrepickIfcItems();
        container.onmousemove = () => {};
    } else if(event.code === 'KeyF') {
        viewer.dimensions.active = false;
        viewer.dimensions.previewActive = false;
        viewer.dimensions.create();
        container.onmousemove = () => viewer.IFC.prePickIfcItem();
    }
}

// Tree view
const toggler = document.getElementsByClassName("caret");
for (let i = 0; i < toggler.length; i++) {
    toggler[i].onclick = () => {
        toggler[i].parentElement.querySelector(".nested").classList.toggle("active");
        toggler[i].classList.toggle("caret-down");
    }
}

// Properties menu

function createPropertiesMenu(properties) {
    console.log(properties);

    removeAllChildren(GUI.props);

    const psets = properties.psets;
    const mats = properties.mats;
    const type = properties.type;

    delete properties.psets;
    delete properties.mats;
    delete properties.type;


    for (let key in properties) {
        createPropertyEntry(key, properties[key]);
    }

}

function createPropertyEntry(key, value) {
    const propContainer = document.createElement("div");
    propContainer.classList.add("ifc-property-item");

    if(value === null || value === undefined) value = "undefined";
    else if(value.value) value = value.value;

    const keyElement = document.createElement("div");
    keyElement.textContent = key;
    propContainer.appendChild(keyElement);

    const valueElement = document.createElement("div");
    valueElement.classList.add("ifc-property-value");
    valueElement.textContent = value;
    propContainer.appendChild(valueElement);

    GUI.props.appendChild(propContainer);
}

// Spatial tree menu

function createTreeMenu(ifcProject) {
    const root = document.getElementById("tree-root");
    removeAllChildren(root);
    const ifcProjectNode = createNestedChild(root, ifcProject);
    ifcProject.children.forEach(child => {
        constructTreeMenuNode(ifcProjectNode, child);
    })
}

function nodeToString(node) {
    return `${node.type} - ${node.expressID}`
}

function constructTreeMenuNode(parent, node) {
    const children = node.children;
    if (children.length === 0) {
        createSimpleChild(parent, node);
        return;
    }
    const nodeElement = createNestedChild(parent, node);
    children.forEach(child => {
        constructTreeMenuNode(nodeElement, child);
    })
}

function createNestedChild(parent, node) {
    const content = nodeToString(node);
    const root = document.createElement('li');
    createTitle(root, content);
    const childrenContainer = document.createElement('ul');
    childrenContainer.classList.add("nested");
    root.appendChild(childrenContainer);
    parent.appendChild(root);
    return childrenContainer;
}

function createTitle(parent, content) {
    const title = document.createElement("span");
    title.classList.add("caret");
    title.onclick = () => {
        title.parentElement.querySelector(".nested").classList.toggle("active");
        title.classList.toggle("caret-down");
    }
    title.textContent = content;
    parent.appendChild(title);
}

function createSimpleChild(parent, node) {
    const content = nodeToString(node);
    const childNode = document.createElement('li');
    childNode.classList.add('leaf-node');
    childNode.textContent = content;
    parent.appendChild(childNode);

    childNode.onmouseenter = () => {
        viewer.IFC.prepickIfcItemsByID(0, [node.expressID]);
    }

    childNode.onclick = async () => {
        viewer.IFC.pickIfcItemsByID(0, [node.expressID], true);
        const props = await viewer.IFC.getProperties(0, node.expressID, true, true);
        createPropertiesMenu(props);
    }
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}