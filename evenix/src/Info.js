import React, { Component } from 'react';
import $ from 'jquery';

import config from './src.config.json';

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return(
      <div id="ItemInfo" >
      </div>
    );
  }
}

export default Info;

