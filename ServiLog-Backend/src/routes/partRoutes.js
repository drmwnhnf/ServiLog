const express = require('express');
const partController = require('../controllers/partController');
const authenticator = require('../middlewares/Authenticator');
const router = express.Router();

router.get('/id/:id', authenticator, partController.getPartbyId);
router.get('/vehicle/:vehicleId', authenticator, partController.getPartsbyVehicleId);
router.post('/', authenticator, partController.createPart);
router.post('/maintain/:id', authenticator, partController.maintainPart);
router.put('/:id', authenticator, partController.updatePart);
router.delete('/:id', authenticator, partController.deletePart);

module.exports = router;