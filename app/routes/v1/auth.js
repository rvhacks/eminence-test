const router = require('express').Router();
const controller = require('../../controller/auth');
const { verifyAuthToken, reqValidator } = require('../../middleware');
const schema = require('../../validation/auth');

router.post('/register', reqValidator(schema.register), controller.isUserExist, controller.register);
router.post('/login', reqValidator(schema.login), controller.login);
router.post('/logout', verifyAuthToken, controller.logout);

module.exports = router;
