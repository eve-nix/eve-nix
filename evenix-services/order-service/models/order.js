// TODO
const dbClient = require('../clients/dbClient');
const { buildSchema } = require('graphql');

const db = dbClient();

const orderSchema = buildSchema(`
  input OrderInput {
    duration: Int,
    is_buy_order: Boolean,
    issued: String,
    location_id: String,
    min_volume: Int,
    order_id: String,
    price: Float,
    range: String,
    system_id: String,
    type_id: String,
    volume_remain: Int,
    volume_total: Int 
  }

  type Order {
    order_id: String!,
    duration: Int,
    is_buy_order: Boolean,
    issued: String,
    location_id: String,
    min_volume: Int,
    price: Float,
    range: String,
    system_id: String,
    type_id: String,
    volume_remain: Int,
    volume_total: Int 
  }

  type Query {
    order(
      orderId: String,
      typeId: String,
      isBuyOrder: Boolean ): [Order]
  }

`);

class Order {
  constructor({
    duration,
    is_buy_order,
    issued,
    location_id,
    min_volume,
    order_id,
    price,
    range,
    system_id,
    type_id,
    volume_remain,
    volume_total
  } ) {
    this.duration = duration;
    this.is_buy_order = is_buy_order;
    this.issued = issued;
    this.location_id = location_id;
    this.min_volume = min_volume;
    this.order_id = order_id;
    this.price = price;
    this.range = range;
    this.system_id = system_id;
    this.type_id = type_id;
    this.volume_remain = volume_remain;
    this.volume_total = volume_total;
  }
}

const parseSql = function ( o ) {
  return new Order( {
      duration: o.Duration,
      is_buy_order: o.IsBuyOrder,
      issued: o.Issued,
      location_id: o.LocationId,
      min_volume: o.MinVolume,
      order_id: o.Id,
      price: o.Price,
      range: o.Range,
      system_id: o.SystemId,
      type_id: o.TypeId,
      volume_remain: o.VolumeRemain,
      volume_total: o.VolumeTotal
  });
}

const orderRoot = {
  order: async function( { orderId, typeId, isBuyOrder } ) {
    const orders = await db.getOrders( {
      orderId, typeId, isBuyOrder
    });
    return orders.map(parseSql);
  }
}

module.exports = { orderSchema, orderRoot };

