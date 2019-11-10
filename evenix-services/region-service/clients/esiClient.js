const axios = require('axios');

module.exports = function( spec ) {
  const that = {};

  const baseURL = 'https://esi.evetech.net/latest/';
  const datasource = (spec && spec.datasource) || 'tranquility';
  const responseType = 'json';
  const method = 'GET';

  const responseHandler = async function (response) {
    if (response.status === 200) {
      return response.data;
    }
    else {
      return new Promise( (resolve, reject) => {
        reject(response.err);
      });
    }
  }

  that.getRegions = async function*() {
    const options = {
      url: '/universe/regions/',
      baseURL,
      method,
      params: { datasource },
      responseType
    };
    const response = await axios(options);
    const headers = response.headers;

    if (headers['x-pages'] &&
        headers['x-pages'] > 1) {
      // Multiple pages
      const numbPages = parseInt(headers['x-pages']);

      for (let i = 1; i <= numbPages; i++) {
        const o = Object.create(options);
        o.params.page = i;
        const resp = await axios(o);
        for (let typeId of resp.data) {
          yield typeId;
        }
      }
    } else {
      // Only a single page
      try {
        for (let typeId of response.data) {
          yield typeId;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.getRegionInfo = async function(regionId) {
    const options = {
      url: `/universe/regions/${regionId}`,
      baseURL,
      method,
      params: { datasource },
      responseType
    };
    try {
      const response = await axios(options);
      return responseHandler(response);
    } catch (err) {
      console.error(err);
    }
  }

  return that;
}

