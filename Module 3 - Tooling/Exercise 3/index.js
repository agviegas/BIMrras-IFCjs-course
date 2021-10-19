import {geometryTypes} from "./geometry-types";
import {IfcAPI} from "web-ifc/web-ifc-api";

// Crea instancia de la API de IFC.js
const ifcapi = new IfcAPI();

// Consige referencias a los elementos graficos de la app
const button = document.getElementById("file-opener-button");
const leftContainer = document.getElementById("left-container");
const saveButton = document.getElementById("save-button");
const json = document.getElementById("json");
const input = document.getElementById("file-input");

// Configura el cargado de archivos desde el PC
button.addEventListener('click', () => input.click());
input.addEventListener(
    "change",
    (changed) => {
        const reader = new FileReader();
        reader.onload = () => LoadFile(reader.result);
        reader.readAsText(changed.target.files[0]);
    },
    false
);

// Carga el archivo IFC y lo convierte en JSON
async function LoadFile(ifcAsText) {
    // Muestra el texto IFC en el menu, sustituyendo saltos de linea por <br> (salto de linea en HTML)
    leftContainer.innerHTML = ifcAsText.replace(/(?:\r\n|\r|\n)/g, '<br>');

    // Abre el modelo IFC con IFC.js
    const modelID = await OpenIfc(ifcAsText);

    // Consigue todos los objetos IFC
    const allItems = GetAllItems(modelID);

    // Convierte el resultado a un JSON y lo muestra en el menu
    const result = JSON.stringify(allItems, undefined, 2);
    json.textContent  = result;

    // Crea un archivo con el JSON y lo guarda
    const blob = new Blob([result], {type: "application/json"});
    saveButton.href  = URL.createObjectURL(blob);
    saveButton.download = "data.json";
    saveButton.click();

    // Cierra la API de IFC.js
    ifcapi.CloseModel(modelID);
}

// Inicializa la API de IFC.js y abre el modelo
async function OpenIfc(ifcAsText) {
    await ifcapi.Init();
    return ifcapi.OpenModel(ifcAsText);
}

// Consigue todos los items del IFC
function GetAllItems(modelID, excludeGeometry = true) {
    const allItems = {};
    const lines = ifcapi.GetAllLines(modelID);
    getAllItemsFromLines(modelID, lines, allItems, excludeGeometry);
    return allItems;
}

// Consigue las propiedades de todos los items del IFC
function getAllItemsFromLines(modelID, lines, allItems, excludeGeometry) {
    for (let i = 1; i <= lines.size(); i++) {
        try {
            saveProperties(modelID, lines, allItems, excludeGeometry, i);
        } catch (e) {
            console.log(e);
        }
    }
}

// Guarda las propiedades de un item del IFC
function saveProperties(modelID, lines, allItems, excludeGeometry, index) {
    const itemID = lines.get(index);
    const props = ifcapi.GetLine(modelID, itemID);
    props.type = props.__proto__.constructor.name;
    if (!excludeGeometry || !geometryTypes.has(props.type)) {
        allItems[itemID] = props;
    }
}