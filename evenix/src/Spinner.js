import React, { Component } from 'react';

import './Spinner.css';

import config from './src.config.json';

class Spinner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Spinner">
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Spinner;
