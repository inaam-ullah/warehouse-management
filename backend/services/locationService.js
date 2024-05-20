const Location = require('../models/Location');
const Item = require('../models/Item');

const getAllLocations = async () => {
  return await Location.find();
};

const getLocationById = async (id) => {
  return await Location.findById(id);
};

const createLocation = async (locationData) => {
  const newLocation = new Location(locationData);
  return await newLocation.save();
};

const updateLocation = async (id, locationData) => {
  return await Location.findByIdAndUpdate(id, locationData, { new: true });
};

const deleteLocation = async (id) => {
  const itemsWithLocation = await Item.find({ location_id: id });
  if (itemsWithLocation.length > 0) {
    throw new Error('Cannot delete location associated with items');
  }
  return await Location.findByIdAndDelete(id);
};

module.exports = { getAllLocations, getLocationById, createLocation, updateLocation, deleteLocation };
