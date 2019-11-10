import React, { Component } from 'react';
import Navbar from './Navbar';
import Table from './Table';
import Info from './Info';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }

  onOrders = orders => {
    this.setState( { orders } );
  }

  render() {
    return (
      <div className="App">
        <Navbar onOrders={this.onOrders}/>
        <Info/>
        <Table orders={this.state.orders}/>
      </div>
    );
  }
}

export default App;
