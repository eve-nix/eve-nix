import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import Navbar from './Navbar';
import Table from './Table';
import Info from './Info';
import Spinner from './Spinner';
import './App.css';

import config from './src.config.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsVisible: true,
      typeInfo: {},
      orders: [],
      systems: [],
      stations: []
    };
  }

  componentDidMount() {
    // Get system information and make system_id key for each
    // system.
    this.getSystems().then( data => {
      this.setState( {
        systems: data.reduce( (map, s) => {
          map[s.system_id] = 
            {
              name: s.name,
              security_status: s.security_status
            };
          return map;
        }, {})
      });
    });

    // Get station information and make station_id key for each
    // station.
    this.getStations().then( data => {
      this.setState( {
        stations: data.reduce( (map, s) => {
          map[s.station_id] = { name: s.name };
          return map;
        }, {})
      });
    });

  }

  // Load system information. This is called in
  // componentDidMount() so that we don't have to make a request
  // for each system_id in the table.
  getSystems = async () => {
    const query = `
    {
      system {
        system_id,
        security_status,
        name
      }
    }`;

    const options = {
      method: 'POST',
      baseUrl: config.systemsService.host,
      url: 'http://18.209.117.173:3004/api' ||
        config.systemsService.route,
      data: { query }
    };

    const response = await axios(options);
    if ( response.status === 200 ) {
      return response.data.data.system;
    } else {
      console.error('Response to systems service failed');
      console.error(response);
    }
  }

  // Request station information. This is called in
  // componentDidMount(), similar to getSystems().
  getStations = async () => {
    const query = `
    {
      station {
        station_id,
        name
      }
    }`;

    const options = {
      method: 'POST',
      baseUrl: config.systemsService.host,
      url: 'http://18.209.117.173:3004/api' ||
        config.systemsService.route,
      data: { query }
    };

    const response = await axios(options);
    if ( response.status === 200 ) {
      return response.data.data.station;
    } else {
      console.error('Response to stations service failed');
      console.error(response);
    }
  }

  getTypeInfo = async typeId => {
    const query = `
    {
      itemType(typeId: "${typeId}") {
        type_id,
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
        volume
      }
    }`;
    const options = {
      method: 'POST',
      baseUrl: config.typesService.host,
      url: 'http://18.209.117.173:3002/api' ||
        config.typesService.route,
      data: { query }
    };

    try {
      const response = await axios(options);
      return response.data.data.itemType[0];
    } catch (err) {
      console.log(options);
      console.error('Response to types service failed');
      console.error(err);
    }
  }

  onOrders = async orders => {
    await new Promise( (resolve, reject) => {
      this.setState( { tableIsVisible: true }, () => {
        resolve();
      });
    });

    return new Promise( (resolve, reject) => {
      this.setState( { orders }, () => {
        resolve();
      });
    });
  }

  getOrders = async typeId => {
    const typeInfo = await this.getTypeInfo(typeId);
    await new Promise( (resolve, reject) => {
      this.setState( { typeInfo }, () => {
        resolve();
      });
    });

    return new Promise( (resolve, reject) => {
      this.setState( { tableIsVisible: false },
        () => resolve());
    });
  }

  bodyContent = () => {
    const tableIsVisible = this.state.tableIsVisible;
    if (this.state.typeInfo && this.state.typeInfo.name) {
      return (
        <Container fluid id="body">
          <Info typeInfo={this.state.typeInfo}/>
          <div className="Table-container">
            {tableIsVisible ? (
              <Table orders={this.state.orders}
                     systems={this.state.systems}
                     stations={this.state.stations}/>
            ) : (
              <Spinner className="Spinner"/>
            )}
          </div>
        </Container>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar onOrders={this.onOrders}
                getOrders={this.getOrders}/>
        {this.bodyContent()}
      </div>
    );
  }
}

export default App;
