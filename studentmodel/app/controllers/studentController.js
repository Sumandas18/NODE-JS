const StudentModel = require('../models/studentModel')
class StudentController{
    async createStudent(req,res){
        try {
            const {name, className, sec, roll} =req.body
            const data = new StudentModel({
                name,
                className,
                sec,
                roll
            })
            const student = await data.save()
            return res.status(201).json({
                success:true,
                menubar:'Student created successfully',
                data:student
            })
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }

    async getStudent(req,res){
        try {
            const data = await StudentModel.find()
            return res.status(201).json({
                success: true,
                message:'get student',
                total: data.length,
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: true,
                message: error.message
            })
        }
    }


    async findStudent(req,res){
        try {
            const id = req.params.id
            const data = await StudentModel.findById(id)
            return res.status(201).json({
                success: true,
                message:"find the student",
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: true,
                message: error.message
            })
        }
    }

    async updateStudent(req,res){
        try {
            const id = req.params.id
            if(!id){
                return res.status(400).json({
                    success: false,
                    message: 'student not found',
                })  
            }
            const data = await StudentModel.findByIdAndUpdate(id, req.body,{
                new: true
            })
            return res.status(201).json({
                succes: true,
                message: 'data updated',
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                success: true,
                message: error.message
            })
            
        }
    }
}
module.exports = new StudentController()