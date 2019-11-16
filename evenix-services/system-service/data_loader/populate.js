const esiClient = require('../clients/esiClient');
const dbClient = require('../clients/dbClient');

const postStations = async function( db, esi, stations ) {

  const postPrm = stations.map( async s => {
    const info = await esi.getStationInfo(s);
    for await (let r of db.postStations( [ info ] )) {}
  });

  return await Promise.all(postPrm);
}

const postStargates = async function( db, esi, stargates ) {

  const postPrm = stargates.map( async s => {
    const info = await esi.getStargateInfo(s);
    for await (let r of db.postStargates( [ info ] )) {}
  });

  return await Promise.all(postPrm);
}

const postSystemInfo = async function( db, systemInfo ) {
  for await ( let resp of db.postSystems( [ systemInfo ] ) ) {
    return resp;
  }
}

const handleSystems = async function( db, esi, systems ) {
  const stations = [];
  const stargates = [];
  const postSystemsInfoPrm = [];

  for await(let systemId of systems) {
    console.log(systemId);

    const systemInfo = await esi.getSystemInfo(systemId);
    if ( systemInfo && systemInfo.hasOwnProperty( 'stations' ) ) {
      for (let stationId of systemInfo.stations) {
        if (!stations.includes(stationId)) {
          stations.push(stationId);
        }
      }
    }
    if ( systemInfo && systemInfo.hasOwnProperty( 'stargates' ) ) {
      for (let stargateId of systemInfo.stargates) {
        if (!stargates.includes(stargateId)) {
          stargates.push(stargateId);
        }
      }
    }
    if ( systemInfo ) {
      postSystemsInfoPrm.push(postSystemInfo(db, systemInfo));
    }
    else {
      console.error(`Failed to get system info for system ${systemId}.`);
    }
  }

  for await (let resp of await postStations(db, esi, stations)) { }
  for await (let resp of await postStargates(db, esi, stargates)) { }
  await Promise.all(postSystemsInfoPrm);
}

async function main() {
  const esi = esiClient(); 
  const db = dbClient( { chunkSize: 1 } );

  await db.clearStations();
  await db.clearSystems();
  await db.clearStargates();

  const systems = esi.getSystems();

  await handleSystems(db, esi, systems);

  await db.close();
}

main()
.catch(console.error);

