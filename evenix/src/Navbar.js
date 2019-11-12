import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './App.css';
import './Navbar.css';

import config from './src.config.json';

class ItemSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      types: []
    };
  }

  handleChange = (event) => {
    this.setState( { searchItem: event.target.value } );

    if (event.target.value < 1) {
      this.setState({
        types: []
      },
      () => { $('ItemSearchList').focus() } );
      return;
    }

    const query = `
    {
      itemTypeByName(
        name: "${event.target.value}",
        limit: ${(config.query && config.query.limit) || 10}
      ) { name, type_id }
    }`;

    const options = {
      method: 'POST',
      baseUrl: config.typesService.host,
      url: 'http://18.209.117.173:3002/api' || config.typesService.route,
      data: { query }
    };

    axios(options).then(response => {
      this.setState( {
        types: response.data.data.itemTypeByName || []
      });
    });
  }

  getOrders = async event => {
    const { type_id } = this.state.types.find( ele =>
      ele.name === this.state.searchItem
    );

    const query = `
    {
      order(
        typeId: "${type_id}"
      ) {
        duration,
        is_buy_order,
        issued,
        location_id,
        min_volume,
        order_id,
        price,
        range,
        system_id,
        type_id,
        volume_remain,
        volume_total
      }
    }`;

    const options = {
      method: 'POST',
      baseUrl: config.ordersService.host,
      url: 'http://18.209.117.173:3001/api' ||
        config.ordersService.route,
      data: { query }
    };

    await this.props.getOrders(type_id);
    const response = await axios(options);
    await this.props.onOrders(response.data.data.order);
  }

  render() {
    return(
      <div id="ItemSearch" className="Navbar-item Navbar-right">
        <div className="input-group">
        <input type="text"
               className="form-control"
               list="ItemSearchList"
               onChange={this.handleChange}></input>
        <datalist id="ItemSearchList">
          {
            this.state.types.map( (value, index) => {
              return <option key={index} value={value.name}>
                     </option>
            })
          }
        </datalist>
        <div className="input-group-append">
          <button type="button"
                  className="btn btn-secondary"
                  onClick={this.getOrders}>
            Orders
          </button>
        </div>
        </div>
      </div>
    );
  }

}

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <nav id="Navbar">
      <div>
        <a className="Navbar-item Navbar-left" href="/">
          <img className="logo" src="nix-logo.gif" alt="logo"/>
        </a>
      </div>
      <div>
        <ItemSearch
          onOrders={this.props.onOrders}
          getOrders={this.props.getOrders}/>
      </div>
      </nav>
    );
  }
}

export default Navbar;
