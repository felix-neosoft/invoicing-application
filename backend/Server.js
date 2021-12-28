const express = require('express')
const cors = require('cors')
const PORT = 8800
const app = express()

//unblock cors policy for acessiong server from React js
app.use(cors())

//convert string to json data
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//access data folder in node js
app.use(express.static('data'));

//load routes
const Router = require('./routes/UserRouter')
app.use('/api',Router)



//Start Server
app.listen(PORT,err =>{
    if(err) throw err
    console.log("Server Started at PORT:8800")
})
