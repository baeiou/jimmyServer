var config = {
  client: 'mssql',
  connection: {
    user: 'sa',
    password: '111111',
    server: '127.0.0.1\\SQL3',
    database: 'fe_base5',
    options: {
      tdsVersion: '7_1'
    }
  }
};
var config2 = {
  client: 'mssql',
  connection: {
    user: 'sa',
    password: 'fe123',
    server: '10.62.17.71',
    database: 'fe_base5',
    options: {
      tdsVersion: '7_1'
    }
  }
};
var config3 = {
  client: 'mssql',
  connection: {
    user: 'sa',
    password: 'R2sql2008',
    server: '10.62.1.25',
    database: 'fe_base5',
    options: {
      tdsVersion: '7_1'
    }
  }
};
var config4 = {
  client: 'mssql',
  connection: {
    user: 'sa',
    password: '111111',
    server: '127.0.0.1\\SQL4',
    database: 'fe_base5',
    options: {
      tdsVersion: '7_1'
    }
  }
};
var config5 = {
  client: 'mssql',
  connection: {
    user: 'sa',
    password: 'R2sql2008',
    server: '10.62.1.25',
    database: 'fe_base5',
    options: {
      tdsVersion: '7_1'
    }
  }
};
var config6 = {
  client: 'mssql',
  connection: {
    user: 'sa',
    password: '111111',
    server: '127.0.0.1\\SQL4',
    database: 'fe_base5',
    options: {
      tdsVersion: '7_1'
    }
  }
};
var knex = require('knex')(config2);
module.exports =knex;
