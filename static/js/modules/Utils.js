export const utils = (() => {
    /*................MATH................*/

    function easeOutExponential(t) {
        return 1 - (1 - t) * Math.pow(0.01, t)
    }

    function smoothStep(t) {
        return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3)
    }


    /*................ITERATOR................*/

    function* zip(...arrays) {
        const length = Math.min(...arrays.map(x => x.length));
        for (let i = 0; i < length; i++) {
            yield [...arrays.map(array => array[i]), i]
        }
    }

    function* pluck(object, indices) {
        for (const i of indices) {
            yield object[i]
        }
    }


    /*................DOM................*/

    // function addEventListeners(elements, events, handler) {
    //     elements = elements.forEach ? elements : [elements];
    //     events = events.forEach ? events : [events];
    //     elements.forEach((element) => {
    //         events.forEach((event) => {
    //             element.addEventListener(event, handler);
    //         });
    //     });
    // }

    function addEventListeners(elements, ...eventsHandlerPairs) {
        elements = elements.forEach ? elements : [elements];
        elements.forEach((element) => {
            eventsHandlerPairs.forEach(([events, handler]) => {
                events = events.forEach ? events : [events];
                events.forEach((event) => {
                    element.addEventListener(event, handler);
                });
            });
        });
    }

   function createDataSetObject(query, attribute) {
        return Object.fromEntries(
            Array.from(
                document.querySelectorAll(query),
                (element) => [element.dataset[attribute], element]
            )
        )
    }


    /*................OBJECT................*/

    function createObject(length, key, value) {
        return Object.fromEntries(
            Array.from(
                { length },
                (_, i) => [key(i), value(i)]
            )
        )
    }


    /*................STRING................*/

    function secondsToMSS(seconds) {
        const formattedMinutes = String(Math.floor(seconds / 60)).padStart(1, '0');
        const formattedSeconds = String(seconds % 60).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`
    }


    return {
        math: { easeOutExponential, smoothStep },
        iterator: { zip, pluck },
        dom: { addEventListeners, createDataSetObject },
        object: { createObject },
        string: { secondsToMSS },
    }
})();

/*
Review this code for opportunities to use modern JavaScript APIs and patterns. Focus on finding places where multi-line operations could be replaced with built-in methods, or where older patterns could be replaced with more modern equivalents. I'm especially interested in finding places where verbose code could be replaced with newer, cleaner APIs while maintaining the same functionality.

// ARRAY STUFF
// Converting array-likes to arrays
Array.prototype.slice.call(arguments)  
[...arguments]

// Or better yet, just use rest params
function old(a, b) {
    const args = Array.prototype.slice.call(arguments, 2);
}
function modern(...rest) { }

// Combining arrays
const arr3 = arr1.concat(arr2)
const arr3 = [...arr1, ...arr2]

// Empty an array
arr.length = 0
arr.splice(0)
arr = []                   // if you can reassign
arr.replaceAll()          // newest approach

// Finding array max/min
Math.max.apply(Math, numbers)
Math.max(...numbers)

// OBJECT STUFF
// Copying properties
Object.assign({}, obj)
{ ...obj }

// Deep clone
JSON.parse(JSON.stringify(obj))   // with limitations
structuredClone(obj)              // modern way

// Get object values
Object.keys(obj).map(k => obj[k])
Object.values(obj)

// Get entries and transform
Object.keys(obj).map(k => [k, obj[k]])
Object.entries(obj)

// Merge objects
const merged = Object.assign({}, obj1, obj2)
const merged = { ...obj1, ...obj2 }

// DOM STUFF
// Creating elements with attributes
const div = document.createElement('div')
div.className = 'foo'
div.innerHTML = 'content'
// vs
const div = Object.assign(document.createElement('div'), {
    className: 'foo',
    innerHTML: 'content'
})

// Data attributes
el.setAttribute('data-id', id)
el.dataset.id = id

// Class manipulation
el.className += ' newClass'
el.classList.add('newClass')

// Multiple classes
el.classList.add('foo', 'bar', 'baz')

// Toggle class
el.classList.toggle('active')

// Replace all children
parent.innerHTML = ''
parent.append(...newChildren)
// vs
parent.replaceChildren(...newChildren)

// Create & append multiple elements
const fragment = document.createDocumentFragment()
elements.forEach(el => fragment.appendChild(el))
parent.appendChild(fragment)
// vs
parent.append(...elements)

// STRING STUFF
// String repeating
new Array(3 + 1).join('-')  
'-'.repeat(3)

// Padding
while (str.length < 3) str = '0' + str
str.padStart(3, '0')

// Template strings instead of concatenation
const msg = 'Hello ' + name + ', you are ' + age
const msg = `Hello ${name}, you are ${age}`

// MISC
// Check if object is empty
Object.keys(obj).length === 0
Object.is(obj, {})

// Random number in range
Math.floor(Math.random() * (max - min + 1)) + min
// Using newer crypto API for better randomness
crypto.getRandomValues(new Uint32Array(1))[0] / 2**32 * (max - min + 1) + min

// Type checking
typeof variable === 'string'
Object.prototype.toString.call(variable) === '[object String]'
// vs for arrays specifically:
Array.isArray(variable)

// Parsing numbers
parseInt(string, 10)
Number(string)          // faster
+string                 // even faster but less clear

// Default values
const val = arg || 'default'      // careful with falsy values
const val = arg ?? 'default'      // null/undefined only

// Checking null/undefined
if (val === null || val === undefined)
if (val == null)                  // `null == undefined` is true
if (val === null ?? undefined)    // modern explicit way
*/