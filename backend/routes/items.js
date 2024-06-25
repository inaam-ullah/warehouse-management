const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const auth = require('../middleware/auth');

router.get('/', auth, ItemController.getAllItems);
router.get('/:id', auth, ItemController.getItemById);
router.post('/', auth, ItemController.createItem);
router.put('/:id', auth, ItemController.updateItem);
router.delete('/:id', auth, ItemController.deleteItem);

module.exports = router;
