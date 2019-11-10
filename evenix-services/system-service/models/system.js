const dbClient = require('../clients/dbClient');
const { buildSchema } = require('graphql');

const db = dbClient();

const systemSchema = buildSchema(`
  type System {
    system_id: String,
    name: String,
    security_class: String,
    security_status: Float,
    stargates: [Stargate],
    stations: [Station]
  }

  type Station {
    station_id: String,
    name: String
  }

  type Stargate {
    stargate_id: String,
    name: String,
  }

  type Query {
    system(
      systemId: String,
      name: String ): [System]

    station(
      stationId: String,
      name: String): [Station]

    stargate(
      stargateId: String,
      name: String): [Stargate]
  }
`);

class System{
  constructor(system_id, {
    name,
    security_class,
    security_status,
    stargates,
    stations
  } ) {
    this.system_id = system_id,
    this.name = name,
    this.security_class = security_class,
    this.security_status = security_status,
    this.stargates = stargates,
    this.stations = stations
  }

  static parseSql ( o, stargates, stations ) {
    return new System( o.Id, {
        name: o.Name,
        security_class: o.SecurityClass,
        security_status: o.SecurityStatus,
        stargates,
        stations
    });
  }
}

class Station {
  constructor(station_id, {
    name
  }) {
    this.station_id = station_id;
    this.name = name;
  }

  static parseSql ( o ) {
    return new Station( o.Id, {
        name: o.Name,
    });
  }
}

class Stargate {
  constructor(stargate_id, {
    name
  }) {
    this.stargate_id = stargate_id;
    this.name = name;
  }

  static parseSql ( o ) {
    return new Stargate( o.Id, {
        name: o.Name,
    });
  }
}

const systemRoot = {
  system: async function( { systemId, name } ) {
    const systems = await db.getSystems( { systemId, name } );
    const stations = await db.getStations( { systemId } );
    const stargates = await db.getStargates( { systemId } );
    return systems.map(s =>
      System.parseSql(s, stations, stargates));
  },
  station: async function( { stationId, name } ) {
    const stations = await db.getStations( { stationId, name } );
    return stations.map(Station.parseSql);
  },
  stargate: async function( { stargateId, name } ) {
    const stargates = await db.getStargates( { stargateId, name } );
    return stargates.map(Stargate.parseSql);
  }
}

module.exports = { systemSchema, systemRoot };

