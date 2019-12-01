import React, { Component } from 'react';
import Jumbotron from "react-bootstrap/Jumbotron";
import $ from 'jquery';

import './Info.css';
import IconClient from './clients/IconClient';

import config from './src.config.json';

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconSrc: ''
    };
  }

  componentWillReceiveProps(props) {
    const iconClient = new IconClient(config.iconService);

    iconClient.getIcon(props.typeInfo.type_id)
      .then(data => this.setState({ iconSrc: data.icon }))
      .catch(console.error);
  }

  renderTypeInfo = () => {
    const typeInfo = this.props.typeInfo;
    const iconSrc = this.state.iconSrc;
    // if (typeInfo) {
      return (
        <div className="Info-container">
          <div className="container ItemHeader-container">
            <img src={iconSrc} className="ItemHeaderIcon"/>
            <h1>{typeInfo.name}</h1>
          </div>
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

