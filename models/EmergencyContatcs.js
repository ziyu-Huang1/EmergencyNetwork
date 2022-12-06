const mongoose = require('mongoose');
var dbs = require('../config/db');

const ContactSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    contact1: {
      type: String,
      default: "undefined"
    },
    contact2: {
      type: String,
      default: "undefined"
    },
    contact3: {
      type: String,
      default: "undefined"
    }
   
});


var Contacts = dbs.normalDB.model('EmergencyContact', ContactSchema);
var APIContacts = dbs.apiTestDB.model('EmergencyContact', ContactSchema);
var UnitContacts = dbs.testDB.model('EmergencyContact', ContactSchema);


module.exports = {
  EmergencyContacts: Contacts,
  APImergencyContacts : APIContacts,
  UnitEmergencyContacts: UnitContacts};