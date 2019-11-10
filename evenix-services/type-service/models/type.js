const dbClient = require('../clients/dbClient');
const { buildSchema } = require('graphql');

const db = dbClient();

const typeSchema = buildSchema(`
  type ItemType {
    type_id: String,
    capacity: Int,
    description: String,
    group_id: String,
    icon_id: String,
    mass: Float,
    name: String,
    packaged_volume: Float,
    portion_size: Int,
    published: Boolean,
    radius: Float,
    volume: Float
  }

  type Query {
    itemType(
      typeId: String,
      name: String ): [ItemType]

    itemTypeByName(
      name: String,
      limit: Int ): [ItemType]
  }
`);

class ItemType {
  constructor(type_id, {
    capacity,
    description,
    group_id,
    icon_id,
    mass,
    name,
    packaged_volume,
    portion_size,
    published,
    radius,
    volume,
  } ) {
    this.type_id = type_id;
    this.capacity = capacity;
    this.description = description;
    this.group_id = group_id;
    this.icon_id = icon_id;
    this.mass = mass;
    this.name = name;
    this.packaged_volume = packaged_volume;
    this.portion_size = portion_size;
    this.published = published;
    this.radius = radius;
    this.volume = volume;
  }
}

const parseSql = function ( o ) {
  return new ItemType( o.Id, {
      capacity: o.Capacity,
      description: o.Description,
      group_id: o.GroupId,
      icon_id: o.IconId,
      mass: o.Mass,
      name: o.Name,
      packaged_volume: o.PackagedVolume,
      portion_size: o.PortionSize,
      published: o.Published,
      radius: o.Radius,
      volume: o.Volume
  });
}

const typeRoot = {
  itemType: async function( { typeId, name } ) {
    const types = await db.getTypes( { typeId, name } );
    return types.map(parseSql);
  },
  itemTypeByName: async function( { name, limit } ) {
    const types = await db.getTypesNameStartsWith( {
      name,
      limit
    } );

    return types.map(parseSql);
  }
}

module.exports = { typeSchema, typeRoot };

