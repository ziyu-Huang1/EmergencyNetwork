const mongoose = require('mongoose');
var dbs = require('../config/db');

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    online:{
      type: Boolean
    },
    status:{
      type: String,
      default: "undefined"
    },
    statusUpdateTime: {
      type: Date
    },
    socketID:{
      type: String
    },
    shelter: {
        type: String,
        default: ""
    },
    privilege: {
        type: String,
        default: "citizen"
    },
    accountStatus: {
      type: String,
      default: "active"
    }
});

  


UserSchema.statics.setSocketID = (user, socketID) => {

  if(global.measureMode){
    console.log("measureMode");
    return User.update({username: user}, {socketID:socketID});
  }
  else{

    return User.update({username: user}, {socketID:socketID})

  }
}

UserSchema.statics.getSocketID = (user) => {

  if(global.measureMode){
    console.log("measureMode");
    //return MeasurePerformanceUser.find({}).sort({online: -1,username: 1});
  }
  else{
    var userFound = User.find({username: user});
    return userFound;
  }
}

UserSchema.statics.getAllUsers = () => {

  if(global.measureMode){
    return MeasurePerformanceUser.find({}).sort({online: -1,username: 1});
  }
  else{
      return User.find({}).sort({online: -1,username: 1});
  }
}

UserSchema.statics.getAllActiveUsers = () => {

  if(global.measureMode){
    return MeasurePerformanceUser.find({accountStatus: "active"}).sort({online: -1,username: 1});
  }
  else{
      return User.find({accountStatus: "active"}).sort({online: -1,username: 1});
  }
}


// UserSchema.statics.findAllUsers = (pattern, sta) =>{
//   var res = User.find({});
//   console.log(pattern, sta);
//   if(pattern) {
//     res = User.find({username: {$regex: pattern}});
//   }
//   if(sta){
//     res = res.find({status: sta});
//   }
//   return res.sort({online: -1, username: 1});
// }



UserSchema.statics.getUser = (username) =>{
  return User.find({username: username});
}

var User = dbs.normalDB.model('User', UserSchema);
var MeasurePerformanceUser = dbs.testDB.model('User', UserSchema);
var APIUser = dbs.apiTestDB.model('User', UserSchema);


module.exports = {
  User: User,
  MeasurePerformanceUser : MeasurePerformanceUser,
  APIUser: APIUser
};