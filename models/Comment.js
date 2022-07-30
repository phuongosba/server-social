const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
  userId:{
    type: String,
    required: true
  },
  postId:{
    type: String,
    required: true
  },
  content: {
    type: String,
  },
  img:{
    type: String,
  }
  
  
},{ timestamps: true })

module.exports = model('Comment', commentSchema)