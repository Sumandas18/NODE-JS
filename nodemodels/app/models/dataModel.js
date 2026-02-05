const mongoose = require("mongoose");
const schema = mongoose.Schema

const modelSchema = new schema({
    name: {type: String},
    username: {type:String},
    email: {type:String}
})
const dataModel = mongoose.model("Model",modelSchema)
module.exports = dataModel;