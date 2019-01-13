// Chris Clifford
// 1/2019
//
// controller for orders
//

const mongoose = require( 'mongoose' );
const Order = mongoose.model( 'Order' );
const assert = require( 'assert' );
const async = require( 'async' );

const sendResp = function( res, status, content ) {
  res.status( status );
  res.json( content );
}


/* Add new order to db, return newly created order */
/* 1 Possible Error */
/* 1. Mongoose returns some kind of error */
module.exports.ordersCreate = function ( req, res ) {

  if ( Object.keys( req.body ).length == 1 ) {
    Order.insertMany( req.body.orders, ( err, orders ) => {
      if ( err ) {
        sendResp( res, 400, err );
      }
      else {
        sendResp( res, 201, req.body.orders );
      }
    } );
 }
  else {
    Order.create( {
      duration: req.body.duration,
      is_buy_order: req.body.is_buy_order,
      issued: req.body.issued,
      location_id: req.body.location_id,
      min_volume: req.body.min_volume,
      order_id: req.body.order_id,
      price: req.body.price,
      range: req.body.range,
      system_id: req.body.system_id,
      type_id: req.body.type_id, 
      volume_remain: req.body.volume_remain,
      volume_total: req.body.volume_total
    }, ( err, order ) => {

      if ( err ) {
        console.log( '400 err: ' + res.body );
        sendResp( res, 400, err );
      }
      else {
        sendResp( res, 201, order );
      }

    } );
  }
};

/* Return orders matching a specific query ( key-value pairing ) */
/* If query is empty, return all orders */
/* 1 Possible Error */
/* 1. Mongoose does not find matching order_id */
/* 2. Mongoose returns some kind of error */
module.exports.ordersList = function( req, res ) {

  /* Catch 1 */
  if ( Object.keys( req.query ).length === 0 && req.query.constructor === Object ) {
    Order
      .find()
      .exec( ( err, orders ) => {

        /* Catch 2 */
        if (err) {
          sendResp( res, 404, err );
        }
        else {
          sendResp( res, 200, orders );
        }
      } );
  }
  else {
    Order
      .find( req.query )
      .exec( ( err, orders ) => {

        /* Catch 2 */
        if ( err ) {
          sendResp( res, 404, err );
        }
        else {
          sendResp( res, 200, orders );
        }
      } );
  }
};

/* Return a single order that matches a given order_id */
/* 3 Possible Errors */
/* 1. Request does not contain order_id parameter */
/* 2. Mongoose does not find matching order_id */
/* 3. Mongoose returns some kind of error */
module.exports.ordersReadOne = function( req, res ) {

  /* Catch 1 */
  if ( req.params && req.params.order_id ) {

    Order
      .findById( req.params.order_id )
      .exec( ( err, order ) => {

        /* Catch 2 */
        if (!order) {
          sendResp( res, 404, {
            'message': 'Order not found.'
          } );
        }

        /* Catch 3 */
        else if (err) {
          sendResp( res, 404, err );
        }
        else {
          sendResp( res, 200, order );
        }
      } );

  } 
  else {
    sendResp( res, 400, {
      'message': 'No order_id parameter in request.'
    } );
  }
};


/* Update a single order, matched by id */
/* 4 Possible Errors */
/* 1. Request does not contain order_id parameter */
/* 2. Request does not have body */
/* 3. Mongoose does not find matching order_id */
/* 4. Mongoose returns some kind of error */
module.exports.ordersUpdateOne = function( req, res ) {

  /* Catch 1 */
  if ( !req.params.order_id ) {
    sendResp( res, 404, {
      'message': 'No order_id parameter in request.'
    } );
  }

  /* Catch 2 */
  else if ( !req.body ) {
    sendResp( res, 404, {
      'message': 'No body in request.'
    } );
  }
  else {
    Order
      .findById( req.params.order_id )
      .exec( ( err, order ) => {

        /* Catch 3 */
        if ( !order ) { 
          sendResp( res, 404, {
            'message': 'Order not found.'
          } );
        }

        /* Catch 4 */
        else if ( err ) {
          sendResp( res, 400, err );
        }

        else {
          order.type_id = req.body.type_id;
          order.sec = req.body.sec;
          order.system_id = req.body.system_id;
          order.price = req.body.price;
          order.volume_remain = req.body.volume_remain;
          order.is_buy_order = req.body.is_buy_order;

          order.save( ( err, order ) => {
            if ( err ) {
              sendResp( res, 404, err );
            }
            else {
              sendResp( res, 200, order );
            }
          } );
        }
      } );
  }
};

/* Delete a single order, matched by order_id */
/* 4 Possible Errors */
/* 1. Request does not contain order_id parameter and doesn't have query */
/* 2. Mongoose does not find matching order_id */
/* 3. Mongoose does not find match query */
/* 4. Mongoose returns some kind of error */
module.exports.ordersDelete = function( req, res ) {

  /* Catch 1 */
  if ( !req.params.order_id && !req.query ) {
    sendResp( res, 404, {
      'message': 'No order_id parameter in request, or no query to match.'
    } );
  }
  else if ( !req.query ) {
    Order
      .findByIdAndRemove( req.params.order_id )
      .exec( ( err, order ) => {

        /* Catch 2 */
        if ( !order ) {
          sendResp( res, 404, {
            'message': 'Order not found.'
          } );
        }

        /* Catch 4 */
        else if ( err ) {
          sendResp( res, 400, err );
        }
        else {
          sendResp( res, 204, null );
        }
      } );
  }
  else {
    Order
      .find( req.query )
      .remove()
      .exec( ( err, orders ) => {

        /* Catch 3 */
        if ( !orders ) {
          sendResp( res, 404, {
            'message': 'Order not found.'
          } );
        }

        /* Catch 4 */
        else if ( err ) {
          sendResp( res, 400, err );
        }
        else {
          sendResp( res, 204, null );
        }

      } );
  }
};
