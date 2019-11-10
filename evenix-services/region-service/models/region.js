const dbClient = require('../clients/dbClient');
const { buildSchema } = require('graphql');

const db = dbClient();

const regionSchema = buildSchema(`
  type RegionType {
    description: String,
    name: String,
    region_id: String,
  }

  type Query {
    region(
      regionId: String,
      name: String ): [RegionType]
  }
`);

class RegionType {
  constructor(region_id, {
    description,
    name,
  } ) {
    this.region_id = region_id;
    this.description = description;
    this.name = name;
  }
}

const parseSql = function ( o ) {
  return new RegionType( o.Id, {
      description: o.Description,
      name: o.Name
  });
}

const regionRoot = {
  region: async function( { regionId, name } ) {
    const regions = await db.getRegions( { regionId, name } );
    return regions.map(parseSql);
  }
}

module.exports = { regionSchema, regionRoot };

