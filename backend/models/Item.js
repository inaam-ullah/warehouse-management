const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', ItemSchema);
