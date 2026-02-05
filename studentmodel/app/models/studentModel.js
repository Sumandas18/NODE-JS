const mongoose = require('mongoose')
const schema= mongoose.Schema

const studentSchema= new schema({
    name:{type: String},
    className:{type: Number},
    sec:{type: String},
    roll:{type: Number},
})

const studentModel = mongoose.model('Student', studentSchema)
module.exports = studentModel