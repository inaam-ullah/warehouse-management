const Item = require('../models/Item');
const Location = require('../models/Location');

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLocation = async (req, res) => {
  const { name, address } = req.body;
  try {
    const newLocation = new Location({ name, address });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  const { name, address } = req.body;
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, address },
      { new: true }
    );
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const itemsWithLocation = await Item.find({ location_id: req.params.id });
    if (itemsWithLocation.length > 0) {
      return res
        .status(400)
        .json({ message: 'Cannot delete location associated with items' });
    }

    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
