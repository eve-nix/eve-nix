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

  const postSystems = async function( data ) {

    const format = function( datum ) {
      return `
(
  ${datum.system_id},
  "${datum.name}",
  "${datum.security_class}",
  ${datum.security_status}
)
`;
    }

    const dataText = Array.isArray(data) ?
      data.map(format) :
      format(data);

    const queryText = `
INSERT INTO System (
   Id,
   Name,
   SecurityClass,
   SecurityStatus
)
VALUES ${dataText}
`;

    return await query(queryText);
}
  const postStargates = async function( data ) {

    const format = function( datum ) {
      return `
(
  ${datum.stargate_id},
  ${datum.system_id},
  "${datum.name}"
)
`;
    }

    const dataText = Array.isArray(data) ?
      data.map(format) :
      format(data);

    const queryText = `
INSERT INTO Stargate (
   Id,
   SystemId,
   Name
)
VALUES ${dataText}
`;

    return await query(queryText);
}

  const postStations = async function( data ) {

    const format = function( datum ) {
      return `
(
  ${datum.station_id},
  ${datum.system_id},
  "${datum.name}"
)
`;
    }

    const dataText = Array.isArray(data) ?
      data.map(format) :
      format(data);

    const queryText = `
INSERT INTO Station (
   Id,
   SystemId,
   Name
)
VALUES ${dataText}
`;

    return await query(queryText);
}

  const postSystemChunks = async function*( data, size ) {
    for (let i = 0; i < data.length; i += size) {
      yield await postSystems(data.slice(i, i + size));
    }
  }

  const postStargateChunks = async function*( data, size ) {
    for (let i = 0; i < data.length; i += size) {
      yield await postStargates(data.slice(i, i + size));
    }
  }

  const postStationChunks = async function*( data, size ) {
    for (let i = 0; i < data.length; i += size) {
      yield await postStations(data.slice(i, i + size));
    }
  }

  that.getSystems = async function( {
    systemId,
    name,
  } ) {
    const WHERE = [];

    if (systemId) WHERE.push(`Id = ${systemId}`);
    if (name) WHERE.push(`Name = ${name}`);

    let queryText = `
      SELECT *
      FROM System
    `;

    if ( WHERE.length > 0 ) {
      queryText += `WHERE ${WHERE.join(',')}`;
    }

    return await query(queryText);
  }

  that.getStargates = async function( {
    stargateId,
    systemId,
    name,
  } ) {
    const WHERE = [];

    if (stargateId) WHERE.push(`Id = ${stargateId}`);
    if (systemId) WHERE.push(`Id = ${systemId}`);
    if (name) WHERE.push(`Name = ${name}`);

    let queryText = `
      SELECT *
      FROM Stargate
    `;

    if ( WHERE.length > 0 ) {
      queryText += `WHERE ${WHERE.join(',')}`;
    }

    return await query(queryText);
  }

  that.getStations = async function( {
    stationId,
    systemId,
    name,
  } ) {
    const WHERE = [];

    if (stationId) WHERE.push(`Id = ${stationId}`);
    if (systemId) WHERE.push(`Id = ${systemId}`);
    if (name) WHERE.push(`Name = ${name}`);

    let queryText = `
      SELECT *
      FROM Station 
    `;

    if ( WHERE.length > 0 ) {
      queryText += `WHERE ${WHERE.join(',')}`;
    }

    return await query(queryText);
  }

  that.postSystems = async function*( data ) {
    for await (let response of postSystemChunks( data, chunkSize )) {
      try {
        yield await response;
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.postStargates = async function*( data ) {
    for await (let response of postStargateChunks( data, chunkSize )) {
      try {
        yield await response;
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.postStations = async function*( data ) {
    for await (let response of postStationChunks( data, chunkSize )) {
      try {
        yield await response;
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.clearSystems = async function( ) {
    return await query('TRUNCATE TABLE System');
  }

  that.clearStargates = async function( ) {
    return await query('TRUNCATE TABLE Stargate');
  }

  that.clearStations = async function( ) {
    return await query('TRUNCATE TABLE Station');
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

