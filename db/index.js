const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    database: 'nodeauth',
  },
});

module.exports = knex;