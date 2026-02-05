const dataModel = require("../models/dataModel");
const DataModel = require("../models/dataModel");

class ModelController {
  async createModel(req, res) {
    try {
      const { name, username, email } = req.body;
      const modelData = new DataModel({
        name,
        username,
        email,
      });
      const model = await modelData.save();
      return res.status(201).json({
        success: true,
        message: "Data created",
        data: model,
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: error.message,
      });
    }
  }

  async getModel(req, res) {
    try {
      const modelData = await DataModel.find();
      return res.status(201).json({
        success: true,
        message: "model get",
        total: modelData.length,
        data: modelData,
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: error.message,
      });
    }
  }

  async findModel(req, res) {
    try {
      const id = req.params.id;
      const modelData = await DataModel.findById(id);
      return res.status(201).json({
        success: true,
        message: "model find",
        data: modelData,
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: error.message,
      });
    }
  }


  // async updateModel(req, res){
  //   try {
  //     const id = req.params.id
  //     if(!id){
  //       return res.status(400).json({
  //         success: false,
  //         message: 'model not found',
  //       })
  //       const modelData = await DataModel.findByIdAndUpdate(id, req.body,{
  //         new : true
  //       })
  //       return res.status(201).json({
  //         success: true,
  //         message: 'model updated',
  //         data: modelData
  //       })
  //     }
  //   } catch (error) {
  //       return res.status(500).json({
  //       success: true,
  //       message: error.message,
  //     });
  //   }
  // }

  async updateModel(req, res) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "model not found",
      });
    }

    const modelData = await DataModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "model updated",
      data: modelData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


async deleteModel(req,res){
  try {
    const id = req.params.id
    await DataModel.findByIdAndDelete(id)
    return res.status(201).json({
      success: true,
      message: "model deleted"
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}
}

module.exports = new ModelController();
