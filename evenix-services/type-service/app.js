const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');

const config = require('./config/app.config.json');

const { typeSchema, typeRoot } = require('./models/type');

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
app.use(cors(corsOptions));

app.use(
  '/api',
  graphqlHTTP( {
    schema: typeSchema,
    rootValue: typeRoot,
    introspection: true,
    graphiql: (config.env === 'dev') || process.env.DEV || false
  })
);

const port = config.port || process.env.PORT || 3000;
app.listen(port);
console.log( 'Listening on port ' + port );

