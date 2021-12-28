const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    pid:{
        type:Number,
        required:true
    },
    receiver_email:{
        type:String,
        required:true
    },
    receiver_name:{
        type:String,
        required:true
    },
    receiver_address:{
        type:String,
        required:true
    },
    invoice_date:{
        type:String
    },
    due_date:{
        type:String
    },
    status:{
        type:String
    },
    pdfname:{
        type:String
    },
    pdfpath:{
        type:String
    },
    products:{
        type:String
    }


})

module.exports = mongoose.model("invoiceData",invoiceSchema)