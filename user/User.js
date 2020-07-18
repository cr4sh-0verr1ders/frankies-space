const mongoose = require("mongoose");
// Defines User Schema
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

mongoose.model('User', UserSchema); // Defines model
module.exports = mongoose.model('User'); // Retrieves and exports.
