const router = require('express').Router();
const controller = require('../../controller/products');
const schema = require('../../validation/products');
const { reqValidator } = require('../../middleware');

router.get('/', controller.getProduct);
router.get('/category/:categoryName', reqValidator(schema.productByCategory, 'params'), controller.getProduct);

module.exports = router;
