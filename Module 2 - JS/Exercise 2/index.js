// Numbers

const age = 27;
const height = 1.8;
const weight = 68;
const bodyMassIndex = weight / height ^ 2;
const pi = Math.PI;

// Strings

const name = "Antonio";
const surname = 'Gonzalez';

const bio = ` I was born
in Sevilla in 1994 and
I like BIM and open source.
I am ${age} years old.
`

// Booleans

const tortillaWithOnions = true;

// Undefined

let otherInfo;
let otherComments = undefined;

// Arrays

let hobbies = ["jazz", "chess", "running", "cinema", "videogames"];
let randomArray = [3.14, hobbies, "apple", false];

console.log(hobbies[0]);
console.log(hobbies.length);

// Objects

let ages = {
    teresa: 20,
    maria: 23,
    rafa: 58 
}

console.log(ages.maria);
console.log(ages['teresa']);

let randomObject = {
    Teresa: {
        likesSwimming: true,
        age: 20
    },
    23: ["Welcome", "to", "JavaScript"]
}

// Functions

function greet() {
    console.log("Hi there!");
} 

greet();

(function greetImmediately() {
    console.log("Hi there!");
})();

function greetPerson(name) {
    console.log("Hi " + name + "!");
    console.log(`Hi ${name}!`);
}

const sayAge = (age) => {
    console.log(`I see, so you are ${age} years old.`);
}

// Object destructuring

function getFruits() {
    return {apples: 23, oranges: 14}
}
const someFruits = getFruits();
const {apples, oranges} = getFruits();

// Conditionals

if(ages.maria > ages.teresa) {
    console.log("Maria is older than Teresa");
} else {
    console.log("Teresa is older than Maria");
}

const message = ages.maria > ages.teresa ? "Maria is older than Teresa" : "Teresa is older than Maria";
console.log(message);

const result = otherInfo || ages.maria;

// Bucles

for(let i = 0; i < hobbies.length; i++) {
    console.log(hobbies[i]);
}

let i = 0;
while(i < hobbies.length) {
    console.log(hobbies[i]);
    i++;
}

for (let hobby of hobbies) {
    console.log(hobby);
}

for(let name in ages) {
    console.log(`${name} is ${ages.name} years old`);
}

hobbies.forEach(function(hobby) {
    console.log(hobby);
})

hobbies.forEach((hobby) => {
    console.log(hobby);
})

hobbies.forEach(hobby => console.log(hobby));

const filtered = hobbies.filter(hobby => hobby.includes("c"));
console.log(filtered);

// Rest operator

function logAll(...args) {
    args.forEach(arg => console.log(arg));
}

logAll("Hi", "there", 23, {apples: 23, oranges: 14});

// Spread operator

const fruits = {apples: 23, oranges: 12};
const fruitsCopy = {...fruits};

const numbers = [1, 34, 12, 56];
const numbersCopy = [...numbers];

logAll(...numbers);

// Errores

try {
    if(ages.maria > ages.teresa) {
        throw new Error("Maria is older than Teresa, and that is not possible!");
    }
} catch (error) {
    console.log(error);
}

// Tipos de valor vs tipos de referencia

const numberInStack = 0;
const numberInHeap = {value: 0};

function addOne(number) {
    if(typeof number === "number") {
        number++;
    } else {
        number.value++;
    }
}

addOne(numberInStack);
addOne(numberInHeap);

console.log("stack: ", numberInStack);
console.log("heap: ", numberInHeap);

// Dinamismo

let thisIsDynamism = 2;
thisIsDynamism = "Hi!";
thisIsDynamism = {value: 4, hobbies: ["swimming", "music"]};

// Funciones como objetos

const greeterObject = () => console.log("Hi!");

function useGreeterObject(object) {
    object();
}

useGreeterObject(greeterObject);

// Clases

class Shape {
    vertices = [];

    constructor(name) {
        this.name = name;
    }

    addVertex(x, y, z) {
        this.vertices.push([x, y, z]);
    }

    getVertex(index) {
        return this.vertices[index];
    }
}

const firstShape = new Shape('First Shape');
firstShape.addVertex(0, 0, 0);
console.log(firstShape);

// Herencia
class Circle extends Shape {
    radius;

    constructor(name, radius) {
        super(name);
        this.radius = radius;
    }

    getRadius() {
        return this ? this.radius : null;
    }

    getRadiusArrow = () => {
        return this ? this.radius : null;
    }
}

const firstCircle = new Circle('First Circle', 2);
console.log(firstCircle);


// Ojo con THIS

const badRadiusGetter = firstCircle.getRadius;
console.log("Bad radius: ", badRadiusGetter());

const goodRadiusGetter = () => firstCircle.getRadius();
console.log("Good radius: ", goodRadiusGetter());

const notSoWellRadiusGetter = firstCircle.getRadiusArrow;
console.log("Not so good radius: ", notSoWellRadiusGetter());

// Leer el DOM

const foundDomElements = document.getElementsByTagName('h1');
const foundDomElementsAsArray = Array.from(foundDomElements);
const title = foundDomElementsAsArray[0];
console.log(title);

// Editar el dom

title.style.color = '#f00';

// Crear elementos del dom

const subtitle = document.createElement('h2');
subtitle.textContent = 'Hi there from JavaScript!';
title.parentNode.appendChild(subtitle);

// Eventos del dom

title.addEventListener('click', () => title.style.color = '#000');

title.onmouseenter = () => subtitle.style.color = '#f00';
title.onmouseleave = () => subtitle.style.color = '#000';