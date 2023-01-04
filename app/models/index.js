const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.user = require("./user.model")(mongoose);
db.refreshToken = require("./refreshToken.model");
db.settingSystem = require("./settingSystem.model")(mongoose);

module.exports = db;
