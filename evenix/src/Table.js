import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import './Table.css';

import sortBothImg from './images/sort_both.png';
import sortDownImg from './images/sort_desc.png';
import sortUpImg from './images/sort_asc.png';

import config from './src.config.json';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      ordersSort: {
        isSorted: false,
        direction: false
      },
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

  sortByPrice = e => {
    if (!this.state.orders || this.state.orders.length === 0) {
      return;
    }
    
    const direction = !this.state.ordersSort.direction;

    const compare = (key, direction) => (a, b) =>
      direction
      ? parseFloat(a[key]) > parseFloat(b[key])
      : parseFloat(a[key]) < parseFloat(b[key]);

    const orders = this.state.orders;
    orders.sort(compare('price', direction));
    this.setState( { orders } );
    this.setState( {
      ordersSort: {
        isSorted: true,
        direction 
      }
    });
  }

  render() {
    return (
      <div className="Table">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">System</th>
              <th scope="col"
                  onClick={this.sortByPrice}
                  contentKey="price">
                    Price
                    { !this.state.ordersSort.isSorted 
                    ? <img src={sortBothImg}/>
                    : this.state.ordersSort.direction
                        ? <img src={sortDownImg}/>
                        : <img src={sortUpImg}/>
                    }
              </th>
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
