import { Model } from './modules/Model.js'
import { View } from './modules/View.js'
import { Controller } from './modules/Controller.js'


const model = new Model();
const view = new View();
new Controller(model, view);