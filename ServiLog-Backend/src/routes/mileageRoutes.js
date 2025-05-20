const express = require('express');
const mileageController = require('../controllers/mileageController');
const authenticator = require('../middlewares/authenticator');
const router = express.Router();

router.get('/id/:id', authenticator, mileageController.getMileagebyId);
router.get('/vehicle/:vehicleId', authenticator, mileageController.getMileagesbyVehicleId);
router.post('/', authenticator, mileageController.createMileage);
router.put('/:id', authenticator, mileageController.updateMileage);
router.delete('/:id', authenticator, mileageController.deleteMileage);

module.exports = router;