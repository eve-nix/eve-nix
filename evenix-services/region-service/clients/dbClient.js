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

  const query = function( query, data ) {
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

      conn.query( query, data, ( err, result ) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  const postRegions = async function( data ) {

    const format = function( datum ) {
      return `
(
  ${datum.region_id},
  "${datum.name}",
  "${(datum.description && datum.description.replace(/["]/g, "'"))
  || null}"
)
`;
    }

    const dataText = Array.isArray(data) ?
      data.map(format) :
      format(data);

    const queryText = `
INSERT INTO Region (
   Id,
   Name,
   Description
)
VALUES ${dataText}
`;

    return await query(queryText);
}

  const postChunks = async function*( data, size ) {
    for (let i = 0; i < data.length; i += size) {
      yield await postRegions(data.slice(i, i + size));
    }
  }

  that.getRegions = async function( {
    regionId,
    description,
    name,
  } ) {
    const WHERE = [];

    if (regionId) WHERE.push(`Id = ${regionId}`);
    if (name) WHERE.push(`Name = ${name}`);
    if (description) WHERE.push(`Description = ${description}`);

    let queryText = `
      SELECT *
      FROM Region
    `;

    if ( WHERE.length > 0 ) {
      queryText += `WHERE ${WHERE.join(',')}`;
    }

    return await query(queryText);
  }

  that.postRegions = async function*( data ) {
    for await (let response of postChunks( data, chunkSize )) {
      try {
        yield await response;
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.clearRegions = async function( ) {
    return await query('TRUNCATE TABLE Region');
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

