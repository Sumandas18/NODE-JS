const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true,
        default: "employee"
    },
});

const authModel = mongoose.model('role_based_user', authSchema);

module.exports = authModel;