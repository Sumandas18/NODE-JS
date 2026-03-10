
const mongoose = require('mongoose');
const schema = mongoose.Schema

const empSalarySchema = new schema({
    emp_name:{
        type: String,
        required: true 
    },
    basic_salary:{
        type: Number,
        required: true
    },
    bonus:{
        type: Number,
        required: true
    },
    deduction:{
        type: Number,
        required: true
    },
    month:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employeeRole'
    }
    
},{timestamps: true})

const empSalaryModel = mongoose.model('empSalary', empSalarySchema)
module.exports = empSalaryModel