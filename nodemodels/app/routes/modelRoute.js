    const express = require('express');
const modelController = require('../controllers/modelController');
    const route = express.Router();

    route.post('/model/create', modelController.createModel);
    route.get('/model', modelController.getModel);
    route.get('/model/:id', modelController.findModel);
    route.put('/model/:id', modelController.updateModel);
    route.delete('/model/:id', modelController.deleteModel)





    module.exports = route