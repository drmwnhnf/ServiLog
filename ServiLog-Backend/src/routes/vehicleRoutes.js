const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authenticator = require('../middlewares/Authenticator');
const router = express.Router();

router.get('/id/:id', authenticator, vehicleController.getVehiclebyId);
router.get('/account/:accountId', authenticator, vehicleController.getVehiclesbyAccountId);
router.post('/', authenticator, vehicleController.createVehicle);
router.put('/:id', authenticator, vehicleController.updateVehicle);
router.delete('/:id', authenticator, vehicleController.deleteVehicle);

module.exports = router;