const esiClient = require('../clients/esiClient');
const dbClient = require('../clients/dbClient');

const esi = esiClient(); 
const db = dbClient( { chunkSize: 1 } );

async function main() {

  const clearTypesPrm = db.clearTypes();

  const types = esi.getTypes();

  for await (let typeId of types) {
    console.log(typeId);
    const typeInfo = await esi.getTypeInfo(typeId);
    if (typeInfo) {
      for await ( let resp of db.postTypes( [ typeInfo ] )) { }
    }
  }

  await clearTypesPrm;
}

main()
.catch(console.error)
.finally(db.close);

