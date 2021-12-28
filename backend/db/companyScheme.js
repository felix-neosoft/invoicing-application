const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    company_name:{
        type:String
    },
    address:{
        type:String
    },
    company_logo_name:{
        type:String
    },
    company_logo_path:{
        type:String
    }

})

module.exports = mongoose.model('company',companySchema)