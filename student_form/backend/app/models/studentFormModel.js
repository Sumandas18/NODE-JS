

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentFormSchema= new Schema({
    Basic_Information:{
        First_Name :{type: String, required: true},
        Last_Name :{type: String, required: true},
        Email_Address :{type: String, required: true},
        Phone_Number:{type: Number, required: true},
        Date_of_Birth :{type: Date, required: true}
    },
    Address_Details:{
        Street_Address :{type: String, required: true},
        Apartment_Number :{type: Number},
        City :{type: String, required: true},
        State :{type: String, required: true},  
        Postal_Code :{type: Number, required: true}
    },
    Educational_Background:{
        Institution_Name :{type: String, required: true},
        Year_of_Graduation :{type: Number, required: true},
        Field_of_Study :{type: String, required: true},
        Percentage_or_CGPA :{type: Number, required: true}
    }
},{timestamps: true, versionkey: false})

const StudentFormModel= mongoose.model('studentForm', StudentFormSchema);
module.exports= StudentFormModel;