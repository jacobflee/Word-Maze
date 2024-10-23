import { Model } from './modules/model/Model.js'
import { View } from './modules/view/View.js'
import { Presenter } from './modules/presenter/Presenter.js'


const model = new Model();
const view = new View();
new Presenter(model, view);