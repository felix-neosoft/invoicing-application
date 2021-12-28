import React,{useState, useRef} from 'react'
import {Avatar, Button, CssBaseline, TextField, Link, Paper, Box, Grid, Typography} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { addUser } from '../config/NodeServices';
import { useNavigate } from 'react-router-dom';



//mui-material themes
const layoutTheme = createTheme({})


//RegEx for Validation
const RegForEmail = RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$');
const RegForName = RegExp('^[a-zA-Z]{3,15}$')
const RegForPassword = RegExp('^[a-zA-Z0-9@*!&%$]{8,15}$')
const RegForUsername = RegExp('^[a-zA-Z0-9_]{5,15}$')

function Register(props) {
    //State Variables
    const [values,setValues] = useState({fname:'',lname:'',username:'',email:'',password:'',cpassword:''})
    const [errors,setErrors] = useState({fname:'',lname:'',username:'',email:'',password:'',cpassword:''})

    //useRef Assigning
    const fnameRef = useRef(null)
    const lnameRef = useRef(null)
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const cpasswordRef = useRef(null)

    //to change components in App.js
    let navigate = useNavigate();


    //handler function to perform validation
    const handler = e =>{
        let name = e.target.name
        switch(name){
            case 'fname':
                setErrors({...errors,fname:RegForName.test(fnameRef.current.value)?'':'Please Enter First Name'})
                setValues({...values,fname:fnameRef.current.value})
                break
            case 'lname':
                setErrors({...errors,lname:RegForName.test(lnameRef.current.value)?'':'Please Enter Last Name'})
                setValues({...values,lname:lnameRef.current.value})
                break
            case 'username':
                setErrors({...errors,username:RegForUsername.test(usernameRef.current.value)?'':'Please Enter Username in Alphanumeric format'})
                setValues({...values,username:usernameRef.current.value})
                break        
            case 'email':
                setErrors({...errors,email:RegForEmail.test(emailRef.current.value)?'':'Please Enter Email in correct format'})
                setValues({...values,email:emailRef.current.value})
                break
            case 'password':
                setErrors({...errors,password:RegForPassword.test(passwordRef.current.value)?'':'Please Enter Password in Alphanumeric and Symbols'})
                setValues({...values,password:passwordRef.current.value})
                break 
            case 'cpassword':
                setErrors({...errors,cpassword:values.password===cpasswordRef.current.value?'':'Password and Confirm Password must be match'})
                setValues({...values,cpassword:cpasswordRef.current.value})
                break
            default:           
        }
    }

    //formSubmit function to submit values to server
    const formSubmit = () =>{   
        if(values.fname!=='' && values.email!=='' && values.lname!=='' && values.username!=='' && values.password!=='' && values.cpassword!==''){
            if(errors.fname==='' && errors.email==='' && errors.lname==='' && errors.username==='' && errors.password==='' && errors.cpassword===''){
                addUser(values).then(res =>{
                    alert(res.data.msg)
                    if(res.data.err===0){
                        navigate('/')
                    }else navigate('/register')
                })
            }else { alert("404! Validation Error!")}
        }else { alert("404! Input Fields must not be blank") }
    }


    return (
        <ThemeProvider theme={layoutTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} sx={{ backgroundImage: 'url(images/gui/index_wallpaper.jpg)', backgroundRepeat: 'no-repeat',backgroundColor: (t) =>t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900], backgroundSize: 'cover', backgroundPosition: 'center'}} >
                    <Box sx={{display:"inline-flex", ml:5, mt:5}}>
                       <img alt="logo" src="images/gui/logo.svg" width="50" />
                       <Typography sx={{mt:1, fontSize:40}} variant="body1">OctraCal</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={20} square>
                    <Box sx={{ my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <AccountCircleIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">User Registration</Typography>
                        <Box component="form" noValidate  sx={{ mt: 1 }}>
                            <TextField fullWidth sx={{my:1}} label="First Name" name="fname" inputRef={fnameRef} variant="outlined" error={errors.fname!==''?true:false} onChange={e => handler(e)} helperText={errors.fname} />
                            <TextField fullWidth sx={{my:1}} label="Last Name" name="lname" inputRef={lnameRef} variant="outlined" error={errors.lname!==''?true:false} onChange={e => handler(e)} helperText={errors.lname} />
                            <TextField fullWidth sx={{my:1}} label="Username" name="username" inputRef={usernameRef} variant="outlined" error={errors.username!==''?true:false} onChange={e => handler(e)} helperText={errors.username} />
                            <TextField fullWidth sx={{my:1}} label="Email" name="email" inputRef={emailRef} variant="outlined" error={errors.email!==''?true:false} onChange={e => handler(e)} helperText={errors.email} />
                            <TextField fullWidth sx={{my:1}} label="Password" name="password" inputRef={passwordRef} variant="outlined" error={errors.password!==''?true:false} onChange={e => handler(e)} helperText={errors.password} />
                            <TextField fullWidth sx={{my:1}} label="Confirm Password" name="cpassword" inputRef={cpasswordRef} variant="outlined" error={errors.cpassword!==''?true:false} onChange={e => handler(e)} helperText={errors.cpassword} />
                            <Button onClick={formSubmit} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign Up </Button>
                            <Grid container>
                                <Grid item xs></Grid>
                                <Grid item>
                                    <Link href="/" variant="body2"> {"Already have a Account? Sign In"} </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default Register
