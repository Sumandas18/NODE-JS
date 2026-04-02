const mongoose = require('mongoose');
const schema = mongoose.Schema;

const blogSchema = new schema({
    blog_title: {
        type: String,
        required: true
    },
    blog_content:{
        type: String,
        required: true
    },
    blog_image:{
        type: String,
        default: 'https://www.chitkara.edu.in/blogs/wp-content/uploads/2023/09/Blogging-in-Digital-Marketing.jpg'
    },
    author_id:{
        type: schema.Types.ObjectId,
        ref: 'author',
        required: true
    }
}, {timestamps: true})
const blogModel = mongoose.model('blog',blogSchema);
module.exports = blogModel;