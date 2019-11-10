const express = require('express');
const router = express.Router();
const axios = require('axios');

const esiClient = require('../clients/esiClient');
const dbClient = require('../clients/dbClient');

const esi = esiClient(); 
const db = dbClient( { chunkSize: 1 } );

async function main() {

  const clearRegionsPrm = db.clearRegions();
  const regions = esi.getRegions();

  await clearRegionsPrm;
  for await (let regionId of regions) {
    console.log(regionId);
    const regionInfo = await esi.getRegionInfo(regionId);
    if (regionInfo) {
      for await ( let resp of db.postRegions( [ regionInfo ] )) { }
    }
  }
}

main()
.catch(console.error)
.finally(db.close);

