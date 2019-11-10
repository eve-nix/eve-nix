const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');

const config = require('./config/app.config.json');

const { regionSchema, regionRoot } = require('./models/region');

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

app.use(
  '/api',
  graphqlHTTP( {
    schema: regionSchema,
    rootValue: regionRoot,
    introspection: true,
    graphiql: (config.env === 'dev') || process.env.DEV || false
  })
);

const port = config.port || process.env.PORT || 3000;
app.listen(port);
console.log( 'Listening on port ' + port );

