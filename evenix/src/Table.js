import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import './Table.css';

import config from './src.config.json';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      paginatedOrders: [],
      currPage: [],
      systems: {},
      stations: {}
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

  componentWillReceiveProps(props) {
    if (props.orders !== this.state.orders) {
      this.updateTable(props.orders);
    }
  }


  getPages = (data, pageSize) => {
    const retData = [];
    const chunk = pageSize || 10;
    for (let i = 0; i < data.length; i += chunk) {
      retData.push(data.slice(i, i+chunk));
    }
    return retData;
  }

  updateTable = data => {
    this.setState( {
      orders: data,
      paginatedOrders: this.getPages(data)
    });
  }

  sortBy = e => {
    // TODO
    console.log(e.target);
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
      console.error('Response to systems service failed');
      console.error(response);
    }

  }

  render() {
    return (
      <div className="Table">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" onClick={this.sortBy}>System</th>
              <th scope="col">Price</th>
              <th scope="col">Type</th>
              <th scope="col">Volume Remain/Total</th>
              <th scope="col">Location</th>
            </tr>
          </thead>
          <tbody>
            { this.state.orders.map(o => {
                return <tr key={o.order_id}>
                         <td>{
                           // Check that we have the system in state.
                           // If we don't show id.
                           (this.state.systems[o.system_id]
                           && this.state.systems[o.system_id].name)
                           || o.system_id
                         }</td>
                         <td>{o.price} <small>ISK</small></td>
                         <td>{o.is_buy_order ? "Buy" : "Sell"}</td>
                         <td>{o.volume_remain}/{o.volume_remain}</td>
                         <td>{
                           // Check that we have the station in state.
                           // If we don't show id.
                           (this.state.stations[o.location_id]
                           && this.state.stations[o.location_id].name)
                           || o.location_id
                         }
                         </td>
                       </tr>
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
