const express = require('express')
const mongoose = require('mongoose')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')
const multer = require('multer')
const generatepdf = require('../generatePDF/generatepdf')
const fs=require('fs')
const sendmail = require('../sendToMail/sendmail')



//jwt token secret key
const jwtSecretKey = 'LbjSZRBvUhE8XCAw'

//MongoDB Connection
const db = "mongodb://localhost:27017/invoice_app"
const connectDB = async() => {
    try{
        await mongoose.connect(db,{useNewUrlParser:true})
        console.log("Database Connected")
    }
    catch(err){
        console.log(err.message)
    }
}
connectDB()

// Database Schema Imports
const userModel = require('../db/userSchema')
const companyModel = require('../db/companyScheme')
const invoiceModel = require('../db/invoiceSchema')
const sendmailModel = require('../db/sendMailSchema')

//JWT Authentication
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null){
        res.json({"err":1,"msg":"Token is empty"})
    }
    else{
        jwt.verify(token,jwtSecretKey,(err,data)=>{
            if(err) { res.json({"err":1,"msg":"Token does not match"}) }
            else{ next() }
        })
    }
}

// directory to save company logos
const logoDir = './data/logo'

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,logoDir)
    },
    filename: (req,file,cb) =>{
        const filename = file.originalname.toLowerCase().split(' ').join('-')
        cb(null,uuidv4()+'-'+filename)
    }
})

const upload = multer({
    storage: storage,
    fileFilter:(req,file,cb) =>{
        if(file.originalname.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/)) {
            cb(null,true)
        } else {
            cb(null,false)
            return cb(new Error('Only SVG format is allowed'))
        }
    }
})



//Routing

Router.post('/login',(req,res)=>{
    userModel.findOne({$or:[{email:req.body.email,password:req.body.password},{username:req.body.email,password:req.body.password}]},(err,data)=>{
        if(err) throw err
        if(data!==null){
            let payload = {uid:req.body.email}
            const token = jwt.sign(payload,jwtSecretKey,{expiresIn:3600000})
            res.json({"err":0,"msg":"Login Successfully","token":token})
        } else res.json({"err":1,"msg":"Login Failed"})
    })
})

Router.post('/register',(req,res)=>{
    let ins = new userModel({first_name:req.body.fname,last_name:req.body.lname,username:req.body.username,email:req.body.email,password:req.body.password})
    ins.save(err =>{
        if(err) res.json({"err":1,"msg":"User Already Exists"})
        else res.json({"err":0,"msg":"Registered Successfully"})
    })
})

Router.post('/company-details',upload.single('logo'),(req,res) =>{
    const url = req.protocol + '://' + req.get('host') + '/logo/' + req.file.filename
    companyModel.findOne({email:req.body.email},(err,data)=>{
        if(err) throw err
        if(data!==null){
            fs.unlink(`./data/logo/${data.company_logo_name}`,err =>{
                if(err) throw err
            })
        }
    })
    companyModel.deleteOne({email:req.body.email},err =>{
        if(err) throw err
    })
    
    let ins = new companyModel({email:req.body.email,company_name:req.body.cname,address:req.body.address,company_logo_name:req.file.filename,company_logo_path:url})
    ins.save(err =>{
        if(err) res.json({"err":1,"msg":"Company details not stores"})
        else res.json({"err":0,"msg":"Company Details Stored"})
    })
})

Router.post('/fetch-company-details',(req,res)=>{
    companyModel.findOne({email:req.body.email},(err,data)=>{
        if(err) throw err
        if(data===null) res.json({"err":1})
        else res.json({"err":0,"data":data})
    })
})

Router.get('/authenticate-user',authenticateToken,(req,res)=>{
    res.json({"err":0,"msg":"token match"})
})

Router.post('/fetch-user',(req,res)=>{
    userModel.findOne({email:req.body.email},(err,data)=>{
        if(err) throw err
        if(data===null) res.json({"err":1})
        else res.json({"err":0,"data":data})
    })
})

Router.post('/add-invoice-details',(req,res)=>{
    const pdfname = `${uuidv4()}.pdf`
    const pdfpath = req.protocol + '://' + req.get('host') + '/pdf/' + pdfname
    invoiceModel.find({email:req.body.email},(err,data)=>{
        if(err) throw err
        const pid = data.length +1
        let ins = new invoiceModel({email:req.body.email,pid:pid,receiver_email:req.body.receiver_email,receiver_name:req.body.receiver_name,receiver_address:req.body.receiver_address,invoice_date:req.body.invoice_date,due_date:req.body.due_date,status:req.body.status,pdfname:pdfname,pdfpath:pdfpath,products:JSON.stringify(req.body.products)})
        ins.save(err =>{
            if(err) res.json({"err":1,"msg":"Invoice Bill not added"})
            else {
                //generating pdf
                let invoiceData = {"email":req.body.email,"pid":pid,"receiver_email":req.body.receiver_email,"receiver_name":req.body.receiver_name,"receiver_address":req.body.receiver_address,"invoice_date":req.body.invoice_date,"due_date":req.body.due_date,"status":req.body.status}
                let productData = req.body.products
                let userData = []
                let companyData = []
                userModel.findOne({email:req.body.email},(err,udata)=>{
                    if(err) throw err
                    userData = udata
                    companyModel.findOne({email:req.body.email},(err,cdata)=>{
                        if(err) throw err
                        companyData = cdata
                        console.log(userData,companyData,invoiceData,productData)
                        generatepdf(userData,companyData,invoiceData,productData,pdfname)
                        sendmailModel.findOne({email:req.body.email},(err,data)=>{
                            if(err) throw res.json({"err":1,"msg":"Mail failed to send"})
                            sendmail(data.sender_email,data.sender_password,req.body.receiver_email,pdfname)

                        })
                    })
                })
                res.json({"err":0,"msg":"Invoice Bill Added"})
            }
        })
    })
})

Router.post('/fetch-invoice-details',(req,res)=>{
    invoiceModel.find({email:req.body.email},(err,data)=>{
        if(err) throw err
        res.json({"err":0,"data":data})
    })
})

Router.post('/delete-invoice-details',(req,res)=>{
    invoiceModel.deleteOne({email:req.body.email,pid:req.body.pid},err=>{
        if(err) throw err
        res.json({"err":0,"msg":"Invoice Deleted"})
    })
})

Router.post('/change-invoice-status',(req,res)=>{

    invoiceModel.updateOne({email:req.body.email,pid:req.body.pid},{$set:{status:req.body.status}},err=>{
        if(err) throw err
        res.json({"err":0,"msg":"Invoice Updated"})
    })
})

Router.get('/delete-file',(req,res) =>{
    fs.unlink('./data/logo/51c409c0-e2ac-482a-8fc2-2a6e8cdd30dd-lion-gee88a6305_640.png',err =>{
        if(err) throw err
        res.send("deleted")
    })
    
})

Router.post('/sender-mail-details',(req,res)=>{
    sendmailModel.findOne({email:req.body.email},(err,data)=>{
        if(err) throw err
        else if(data===null){
            let ins = new sendmailModel({email:req.body.email,sender_email:req.body.sender_email,sender_password:req.body.sender_password})
            ins.save(err =>{
                if(err) throw err
                else res.json({"err":0,"msg":"Sender Details Stored"})
            })
        }
        else{
            sendmailModel.updateOne({email:req.body.email},{$set:{email:req.body.email,sender_email:req.body.sender_email,sender_password:req.body.sender_password}},(err)=>{
                if(err) throw err
                res.json({"err":0,"msg":"Sender Details Updated"})
            })
            
        }
    })
    
})

module.exports = Router