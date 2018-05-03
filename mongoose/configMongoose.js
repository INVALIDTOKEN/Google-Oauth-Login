const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/";
const dbName = "votingApp";
mongoose.connect(url+dbName);


module.exports = mongoose;














