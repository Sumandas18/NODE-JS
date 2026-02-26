
// const PDFDocument = require('pdfkit');
const studentFromModel = require('../models/studentFormModel');

class StudentFormController {
    async index(req, res) {
        try {
            const data = await studentFromModel.find();
            res.render('list', {
                title: 'Student Form List',
                total: data.length,
                data: data
            })
            res.status(200).json({
                success: true,
                message: 'Data fetched successfully',
                data: data
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Unable to fetch data',
                error: error.message
            })
        }
    }


    async create(req, res) {
        try {
            const { Basic_Information, Address_Details, Educational_Background } = req.body;
            const student = new studentFromModel({
                Basic_Information,
                Address_Details,
                Educational_Background
            });
            const savedStudent = await student.save();
            res.status(201).json({
                success: true,
                message: 'Student created successfully',
                data: savedStudent
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Unable to create student',
                error: error.message
            })
        }
    }


    async findById(req, res) {
        try {
            const id = req.params.id;
            const student = await studentFromModel.findById(id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                })
            } 
            res.status(200).json({
                success: true,
                message: 'Student details',
                data: student
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Unable to fetch student details',
                error: error.message
            })
        }         

    }
    
}

module.exports = new StudentFormController();


