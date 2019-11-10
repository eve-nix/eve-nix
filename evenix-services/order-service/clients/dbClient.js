const mysql = require('mysql');
const moment = require('moment');
const sqlInfo = require('../config/sql.secret.json');

module.exports = function ( spec ) {
  const that = {};

  let client;

  const conn = mysql.createConnection(sqlInfo);
  const chunkSize = ( spec && spec.chunkSize ) || 1;

  const connect = function() {
    return new Promise( ( resolve, reject ) => {
      conn.connect( async err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  const query = function( query ) {
    return new Promise( async ( resolve, reject ) => {

      if ( conn.state !== 'connected' &&
           conn.state !== 'authenticated') {
        await connect();
      }

      if ( conn.state !== 'connected' &&
           conn.state !== 'authenticated') {
        return new Promise( ( resolve, reject ) => {
          reject(conn.state);
        });
      }

      conn.query( query, ( err, result ) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  const postOrders = async function( data ) {
  
    const format = function( datum ) {
      return `
(
  ${datum.order_id},
  ${datum.duration},
  ${datum.is_buy_order},
  "${moment(datum.issued).format('YYYY-MM-DD HH:mm:ss')}",
  ${datum.min_volume},
  ${datum.price},
  "${datum.range}",
  "${datum.location_id}",
  ${datum.system_id},
  ${datum.type_id},
  ${datum.volume_remain},
  ${datum.volume_total}
)
`;
    }

    const dataText = Array.isArray(data) ?
      data.map(format) :
      format(data);

    const queryText = `
INSERT INTO ItemOrder(
  Id,
  Duration,
  IsBuyOrder,
  Issued,
  MinVolume,
  Price,
  OrderRange,
  LocationId,
  SystemId,
  TypeId,
  VolumeRemain,
  VolumeTotal
)
VALUES ${dataText}
`;

    return await query(queryText);
}

  const postChunks = async function*( data, size ) {
    for (let i = 0; i < data.length; i += size) {
      yield await postOrders(data.slice(i, i + size));
    }
  }

  that.getOrders = async function( {
    orderId, typeId, isBuyOrder
  } ) {
    const WHERE = [];

    if (orderId) WHERE.push(`Id = ${orderId}`);
    if (typeId) WHERE.push(`TypeId = ${typeId}`);
    if (isBuyOrder) WHERE.push(`IsBuyOrder = ${isBuyOrder},`);

    let queryText = `
      SELECT *
      FROM ItemOrder
    `;

    if ( WHERE.length > 0 ) {
      queryText += `WHERE ${WHERE.join(',')}`;
    }

    return await query(queryText);
  }

  that.postOrders = async function*( data ) {
    for await (let response of postChunks( data, chunkSize )) {
      try {
        yield await response;
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.clearOrders = async function( ) {
    return await query('TRUNCATE TABLE ItemOrder');
  }

  that.close = async function( ) {
    return new Promise( ( resolve, reject ) => {
      conn.end( err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  return that;
}

