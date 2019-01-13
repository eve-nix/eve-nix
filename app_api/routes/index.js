/*  Chris Clifford
 *  1/2019
 *
 *  index router for api
 */

const express = require( 'express' );
const router = express.Router();
const ctrlOrders = require( '../controllers/orders' );

/* POST: create new order ( or list in body ) */
router.post( '/orders', ctrlOrders.ordersCreate );

/* GET: read list of orders ( optional match ) */
router.get( '/orders/', ctrlOrders.ordersList );

/* GET: read specific order by order_id */
router.get( '/orders/:order_id', ctrlOrders.ordersReadOne );

/* PUT: update specific order by order_id */
router.put( '/orders/:order_id', ctrlOrders.ordersUpdateOne );

/* DELETE: delete order by order_id (or match query) */
router.delete( '/orders/:order_id?', ctrlOrders.ordersDelete );

module.exports = router;
