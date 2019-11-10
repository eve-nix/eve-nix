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

  const postTypes = async function( data ) {

    const format = function( datum ) {
      return `
(
  ${datum.type_id},
  ${datum.capacity},
  "${datum.description.replace(/["]/g, "'")}",
  "${datum.group_id}",
  "${datum.icon_id}",
  ${datum.mass},
  "${datum.name.replace(/["]/g, "'")}",
  ${datum.packaged_volume},
  ${datum.portion_size},
  ${datum.published},
  ${datum.radius},
  ${datum.volume}
)
`;
    }

    const dataText = Array.isArray(data) ?
      data.map(format) :
      format(data);

    const queryText = `
INSERT INTO ItemType (
   Id,
   Capacity,
   Description,
   GroupId,
   IconId,
   Mass,
   Name,
   PackagedVolume,
   PortionSize,
   Published,
   Radius,
   Volume
)
VALUES ${dataText}
`;

    return await query(queryText);
}

  const postChunks = async function*( data, size ) {
    for (let i = 0; i < data.length; i += size) {
      yield await postTypes(data.slice(i, i + size));
    }
  }

  that.getTypesNameStartsWith = async function( {
    name,
    limit
  } ) {
    const queryText = `
      SELECT *
      FROM ItemType
      WHERE name LIKE "${name}%"
      LIMIT ${limit}
    `;

    return await query(queryText);
  }

  that.getTypes = async function( {
    typeId,
    capacity,
    description,
    groupId,
    iconId,
    mass,
    name,
    packagedVolume,
    portionSize,
    published,
    radius,
    volume
  } ) {
    const WHERE = [];

    if (typeId) WHERE.push(`Id = ${typeId}`);
    if (capacity) WHERE.push(`Capacity = ${capacity}`);
    if (description) WHERE.push(`Description = ${description}`);
    if (groupId) WHERE.push(`GroupId = ${groupId}`);
    if (iconId) WHERE.push(`IconId = ${iconId}`);
    if (mass) WHERE.push(`Mass = ${mass}`);
    if (name) WHERE.push(`Name = ${name}`);
    if (packagedVolume)
      WHERE.push(`PackagedVolume = ${packagedVolume}`);
    if (portionSize) WHERE.push(`PortionSize = ${portionSize}`);
    if (published) WHERE.push(`Published = ${published}`);
    if (radius) WHERE.push(`Radius = ${radius}`);
    if (volume) WHERE.push(`Volume = ${volume}`);

    let queryText = `
      SELECT *
      FROM ItemType
    `;

    if ( WHERE.length > 0 ) {
      queryText += `WHERE ${WHERE.join(',')}`;
    }

    return await query(queryText);
  }

  that.postTypes = async function*( data ) {
    for await (let response of postChunks( data, chunkSize )) {
      try {
        yield await response;
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.clearTypes = async function( ) {
    return await query('TRUNCATE TABLE ItemType');
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

