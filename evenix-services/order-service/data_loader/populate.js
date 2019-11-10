const express = require('express');
const router = express.Router();
const axios = require('axios');

const esiClient = require('../clients/esiClient');
const dbClient = require('../clients/dbClient');

const esi = esiClient(); 
const db = dbClient( { chunkSize: 1 } );

async function main() {

  const regionsPrm = esi.getRegions();
  const clearOrdersPrm = db.clearOrders();

  const [ regions, clearOrders ] =
    await Promise.all( [ regionsPrm, clearOrdersPrm ] );

  for await (let region of regions) {
    console.log(region);

    const regionOrders = esi.getRegionOrders(region);

    for await (let orders of regionOrders) {
      
      try {
        const response = db.postOrders( orders );
        for await (let resp of response) {
        }
      } catch (err) {
        console.error(err);
      }

    }
  }

}

main()
.catch(console.error)
.finally(db.close);

