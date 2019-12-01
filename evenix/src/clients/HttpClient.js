class HttpClient {
  constructor({ host, route }) {
    this.host = host;
    this.route = route;
  }

  handler(resp) {
    return new Promise( (resolve, reject) => {
      if (resp.status === 200) {
        resolve(resp.data);
      } else {
        reject(resp.statusText);
      }
    });
  }
}

export default HttpClient;

