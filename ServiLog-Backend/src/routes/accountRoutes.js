const express = require('express');
const accountController = require('../controllers/accountController');
const authenticator = require('../middlewares/authenticator');
const router = express.Router();

router.post('/login', accountController.login);
router.post('/register', accountController.register);
router.post('/verify/:id', accountController.verifyAccount);
router.get('/:id', authenticator, accountController.getAccountbyId);
router.put('/:id', authenticator, accountController.updateAccount);
router.delete('/:id', authenticator, accountController.deleteAccount);

module.exports = router;