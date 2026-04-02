const mongoose = require('mongoose');
const schema = mongoose.Schema;

const authorSchema = new schema({
    author_name: {
        type: String,
        required: true
    },
    author_bio:{
        type: String,
        required: true
    },
    author_email:{
        type: String,
        required: true,
        unique: true
    },
    author_password:{
        type: String,
        required: true
    }
})

const authorModel = mongoose.model('author',authorSchema);
module.exports = authorModel;