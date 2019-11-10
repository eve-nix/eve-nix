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

  that.getSystems = async function*() {
    const options = {
      url: '/universe/systems/',
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
        for (let systemId of resp.data) {
          yield systemId;
        }
      }
    } else {
      // Only a single page
      try {
        for (let systemId of response.data) {
          yield systemId;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  that.getSystemInfo = async function(systemId) {
    const options = {
      url: `/universe/systems/${systemId}`,
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

  that.getStargateInfo = async function(stargateId) {
    const options = {
      url: `/universe/stargates/${stargateId}`,
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

  that.getStationInfo = async function(stationId) {
    const options = {
      url: `/universe/stations/${stationId}`,
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

