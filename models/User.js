const mongoose = require("mongoose");

const schema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
});

module.exports = mongoose.model("User", schema);
