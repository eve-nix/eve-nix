import React, { Component } from 'react';
import Jumbotron from "react-bootstrap/Jumbotron";
import $ from 'jquery';

import './Info.css';

import config from './src.config.json';

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  renderTypeInfo = () => {
    const typeInfo = this.props.typeInfo;
    // if (typeInfo) {
      return (
        <div className="Info-container">
          <h1>{typeInfo.name}</h1>
          <p>{typeInfo.description}</p>
        </div>
      )
    // }
  }

  render() {
    return(
      <Jumbotron id="ItemInfo">
        {this.renderTypeInfo()}
      </Jumbotron>
    );
  }
}

export default Info;

