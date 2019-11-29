const express = require('express');
const cors = require('cors');

const config = require('./config/app.config.json');

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (config.whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

if ( !(config.env === 'dev') && !process.env.DEV) {
  app.use(cors(corsOptions));
}

app.get('/type', (req, res) => {
  if (req.query.type_id) {
    const icon = config.provider.replace('?', req.query.type_id);
    res.send({ icon });
  } else {
    next('Requests must include a type_id query parameter.');
  }
});

const port = config.port || process.env.PORT || 3000;

app.listen(port);
console.log( 'Listening on port ' + port );

