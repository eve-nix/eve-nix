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
                           (this.props.systems[o.system_id]
                           && this.props.systems[o.system_id].name)
                           || o.system_id
                         }</td>
                         <td>{o.price} <small>ISK</small></td>
                         <td>{o.is_buy_order ? "Buy" : "Sell"}</td>
                         <td>{o.volume_remain}/{o.volume_remain}</td>
                         <td>{
                           // Check that we have the station in state.
                           // If we don't show id.
                           (this.props.stations[o.location_id]
                           && this.props.stations[o.location_id].name)
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
