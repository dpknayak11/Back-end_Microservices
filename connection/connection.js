const mongoose = require("mongoose");
require("dotenv").config();
// const dbconf = require("./db.json");
// let dbString = "mongodb://" + dbconf.dbcredentials.user;
// dbString = dbString + ":" + dbconf.dbcredentials.password;
// dbString = dbString + "@" + dbconf.dbcredentials.address;
// dbString = dbString + ":" + dbconf.dbcredentials.port;
// dbString = dbString + "/" + dbconf.dbcredentials.database;


let dbString = process.env.MONGODB_ATLES
// const dbString = "mongodb://localhost:27017/mydatabase"

console.log(dbString);
function connectDB() {
  try {
    mongoose.connect(dbString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("+ MongoDB is connected!! +");
  } catch (error) {
    console.error(error);
  }
}

module.exports = connectDB;
