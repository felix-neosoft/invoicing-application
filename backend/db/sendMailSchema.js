const mongoose = require('mongoose')

const sendmailSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    sender_email:{
        type:String
    },
    sender_password:{
        type:String
    }

})

module.exports = mongoose.model("sendMailData",sendmailSchema)