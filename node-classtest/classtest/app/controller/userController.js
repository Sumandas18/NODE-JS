const fs = require('fs');
const usersData = JSON.parse(fs.readFileSync('userdata.json', 'utf-8'))

class userController{
    async index(req,res){
        try{
            res.render('user',{
                usersData
                
            })
        }catch(err){
            console.log(err);
            
        }
    }
}

module.exports = new userController()