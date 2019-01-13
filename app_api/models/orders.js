// Chris Clifford
// 1/2019
//
// Mongoose schema for order object.
//

const mongoose = require( 'mongoose' );

const orderSchema = new mongoose.Schema( {
  duration: { type: Number },
  is_buy_order: { type: Boolean, required: true },
  issued: { type: String },
  location_id: { type: Number },
  min_volume: { type: Number },
  order_id: { type: Number },
  price: { type: Number, required: true, min: 0 },
  range: { type: String },
  system_id: { type: String, required: true },
  type_id: { type: Number, required: true, index: true },
  volume_remain: { type: Number, required: true, min: 0 },
  volume_total: { type: Number, required: true, min: 0 }
} );

mongoose.model( 'Order', orderSchema, 'orders' );
