import React,{useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {Avatar, Button, CssBaseline, TextField, Link, Paper, Box, Grid, Typography} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../config/NodeServices';
import { userLogin } from '../redux/userReducer'


//mui-material themes
const layoutTheme = createTheme({})

//RegEx for Validation
const RegForEmail = RegExp('^[a-zA-Z0-9@._-]{5,30}$');
const RegForPassword = RegExp('^[a-zA-Z0-9@*!&%$]{8,15}$')

function Login(props) {

    //redux dispatcher
    const dispatch = useDispatch()

    //redux states variables
    const status = useSelector(state => state.user.status)

    //to change components in App.js
    let navigate = useNavigate();

    //check whether user is already logged in or not
    useEffect(()=>{
        console.log(status)
        if(status==='LOGGED_IN'){
            navigate('/dashboard')
        }
    },[])


    //State Variables
    const [values,setValues] = useState({email:'',password:''})
    const [errors,setErrors] = useState({email:'',password:''})

    //useRef Assigning
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    //handler function to perform validation
    const handler = e =>{
        let name = e.target.name
        switch(name){
            case 'email':
                setErrors({...errors,email:RegForEmail.test(emailRef.current.value)?'':'Please Enter Email in correct format'})
                setValues({...values,email:emailRef.current.value})
                break
            case 'password':
                setErrors({...errors,password:RegForPassword.test(passwordRef.current.value)?'':'Please Enter Password in Alphanumeric and Symbols'})
                setValues({...values,password:passwordRef.current.value})
                break 
            default:      
        }
    }

    //formSubmit function to submit values to server
    const formSubmit = () =>{    
        if(values.email!=='' && values.password!==''){
            if(errors.email==='' && errors.password===''){
            login(values).then(res =>{
                if(res.data.err===0){
                    dispatch(userLogin('LOGGED_IN',res.data.token))
                    alert(res.data.msg)
                    navigate('/dashboard')
                }else alert(res.data.msg)
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
                    <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LoginIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">Login</Typography>
                        <Box component="form" noValidate  sx={{ mt: 1 }}>
                            <TextField fullWidth sx={{my:1}} label="Email/Username" name="email" inputRef={emailRef} variant="outlined" error={errors.email!==''?true:false} onChange={e => handler(e)} helperText={errors.email} />
                            <TextField fullWidth sx={{my:1}} label="Password" name="password" inputRef={passwordRef} variant="outlined" error={errors.password!==''?true:false} onChange={e => handler(e)} helperText={errors.password} />
                            <Button onClick={formSubmit} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Sign In </Button>
                            <Grid container>
                                <Grid item xs></Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2"> {"Don't have an account? Sign Up"} </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default Login
