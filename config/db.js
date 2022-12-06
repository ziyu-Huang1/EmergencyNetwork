const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const testdb = config.get('mongoTestURI');
const apiTestdb = config.get('mongoapiTestDBURI');

const normalDB = mongoose.createConnection(db, function(err){
});

const testDB = mongoose.createConnection(testdb,function(err){
});

const apiTestDB = mongoose.createConnection(apiTestdb, function(err){
});



module.exports = {
  normalDB: normalDB,
  testDB: testDB,
  apiTestDB: apiTestDB
};