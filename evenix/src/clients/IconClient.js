import axios from 'axios';
import HttpClient from './HttpClient';

class IconClient extends HttpClient {
  constructor(config) {
    super(config);
  }

  async getIcon( type_id ) {
    const options = {
      method: 'GET',
      baseURL: this.host,
      url: this.route,
      params: { type_id }
    };

    const response = await axios(options);
    return this.handler(response);
  }
}

export default IconClient;

