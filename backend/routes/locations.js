const express = require('express');

const router = express.Router();
const LocationController = require('../controllers/LocationController');
const auth = require('../middleware/auth');

router.get('/', auth, LocationController.getAllLocations);
router.get('/:id', auth, LocationController.getLocationById);
router.post('/', auth, LocationController.createLocation);
router.put('/:id', auth, LocationController.updateLocation);
router.delete('/:id', auth, LocationController.deleteLocation);

module.exports = router;
