import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import {useSelector} from 'react-redux'
import {AppBar, createTheme, ThemeProvider, Toolbar, Typography, Button, Box, Menu, MenuItem, CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, TextField} from '@mui/material'

//Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import { addCompany, fetchCompany, sendmailerdata } from '../config/NodeServices';

// Material Theme
const dashboardTheme = createTheme({
    palette:{
        mode:'dark',
        primary:{
            main: '#3FC1C9'
        }
    }   
})

const MainTheme = createTheme({

})

//RegEx for Validation
const RegForName = RegExp('^[a-zA-Z\\s]{3,15}$')
const RegForAddress = RegExp('^[a-zA-Z0-9\\s.,-_]{5,100}$')
const RegForGmail = RegExp('^[a-zA-Z0-9_]+@gmail.com$')

function Settings() {
    //to change components in App.js
    let navigate = useNavigate()


    // Appbar Menu Handler for open and close menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //App Drawer Width
    const drawerWidth = 240

    //redux state variables
    const token = useSelector(state => state.user.token)

    //state variables
    const [values, setValues] = useState({email:'',cname:'',address:'',logo:''})
    const [company,setCompany] = useState([])
    const [errors,setErrors] = useState({cname:'',address:''})
    const [svalues,sSetValues] = useState({email:'',password:''})
    const [serrors,sSetErrors] = useState({email:''})

    //useRef Varaibles
    const cnameRef = useRef(null)
    const addressRef= useRef(null)
    const semailRef = useRef(null)
    const spasswordRef = useRef(null)


    useEffect(()=>{
        if(token !==undefined){
            const decode = jwt_decode(token)
            setValues({...values,email:decode.uid})
        }
    },[])

    const handler = e =>{
        let name = e.target.name
        switch(name){
            case 'cname':
                setErrors({...errors,cname:RegForName.test(cnameRef.current.value)?'':'Please Enter Company Name'})
                setValues({...values,cname:cnameRef.current.value})
                break
            
            case 'address':
                setErrors({...errors,address:RegForAddress.test(addressRef.current.value)?'':'Please Enter Address'})
                setValues({...values,address:addressRef.current.value})
                break
            
            case 'logo':
                setValues({...values,logo:e.target.files[0]})
                break

            case 'semail':
                sSetErrors({...serrors,email:RegForGmail.test(semailRef.current.value)?'':'Gmail Account email must be used'})
                sSetValues({...svalues,email:semailRef.current.value})
                console.log(svalues)


            case 'spassword':
                sSetValues({...svalues,password:spasswordRef.current.value})
                
            default : 
        }
    }

    //formSubmit function to company details to server
    const formSubmit = e =>{
        e.preventDefault()
        if(values.email!=='' && values.cname!=='' && values.address!==''){
            if(errors.cname==='' && errors.address===''){
                let formData = new FormData
                formData.append('email',values.email)
                formData.append('cname',values.cname)
                formData.append('address',values.address)
                formData.append('logo',values.logo)
                addCompany(formData).then(res => {
                    if(res.data.err===0) alert(res.data.msg)
                    else alert(res.data.msg)
                })
                navigate('/dashboard')

            }else alert("Validation Error")

        } else alert("Input Fields must not be empty")
    }

    //function to store mailer details in database for sending mails
    const MailerInfo = () => {
        if(semailRef.current.value!==''  && svalues.password!==''){
            if(serrors.email===''){
                sendmailerdata({"email":values.email,"sender_email":semailRef.current.value,"sender_password":svalues.password}).then(res =>{
                    if(res.data.err===0) alert(res.data.msg)
                })

            }else alert('Sender Email Validation')
        } else alert("Sender's Details Input Field must not be blanked")

    }



    return (
        <ThemeProvider theme={dashboardTheme}>  
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex:2}}>
                    <Toolbar>
                        <Typography variant="h5" component="div" sx={{flexGrow:1}}><img alt="dash-logo" src="images/gui/logo.svg" width="20" /> OctraCal</Typography>
                        <Button  onClick={handleClick} color="primary"> Welcome User </Button>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Paper  sx={{zIndex:1}} elevation={20}>
                    <Drawer sx={{ width: drawerWidth ,flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }} variant="permanent" anchor="left">
                        <Toolbar />
                        <Divider />
                        <List >
                        <ListItem button >
                                <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
                                <ListItemText><Typography onClick={()=>navigate('/dashboard')} color="primary" variant="h6">Dashboard</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><InsertDriveFileIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography onClick={()=>navigate('/addinvoice')} color="primary" variant="h6">Add Invoice</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><ReceiptIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography onClick={()=>navigate('/showinvoices')} color="primary" variant="h6">Show Invoices</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><SettingsIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography onClick={()=>navigate('/settings')} color="primary" variant="h6">Settings</Typography></ListItemText>
                            </ListItem>
                        </List>
                        <Divider />
                    </Drawer>
                </Paper>
                
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }} >
            <Toolbar />
            <ThemeProvider theme={MainTheme}>
                <Paper sx={{width:3/4, mx:"auto"}}>
                    <form onSubmit={e => formSubmit(e)} encType='multipart/form-data'>
                        <Typography sx={{pt:3}} textAlign="center" variant="h5">Company Details</Typography>
                        <TextField sx={{my:3, width:3/4, ml:15}}  type="text"  label="Company Name" variant="outlined" name="cname" inputRef={cnameRef} error={errors.cname!==''?true:false} onChange={e => handler(e)} helperText={errors.cname} /> 
                        <TextField sx={{my:3, width:3/4, ml:15}} type="text" label="Address" variant="outlined" name="address" inputRef={addressRef} error={errors.address!==''?true:false} onChange={e => handler(e)} helperText={errors.address} /> 
                        <div className="file-input">
                            <label>Upload Logo</label>
                            <input type="file" name="logo" onChange={e => handler(e)} />
                        </div>
                        <Button type="submit" sx={{my:5, ml:90}} variant="outlined">Update</Button> 
                    </form>
                </Paper>
                <Paper sx={{width:3/4, mt:10, mx:"auto"}}>
                    <form>
                        <Typography sx={{pt:3}} textAlign="center" variant="h5">Sending Mail Details</Typography>
                        <TextField sx={{my:3, width:3/4, ml:15}}  type="text"  label="Sender's Email" variant="outlined" name="semail" inputRef={semailRef} error={serrors.email!==''?true:false} onChange={e => handler(e)} helperText={serrors.email}  /> 
                        <TextField sx={{my:3, width:3/4, ml:15}} type="text" label="Password" variant="outlined" name="spassword" inputRef={spasswordRef} onChange={e => handler(e)} /> 
                        <Button onClick={MailerInfo} sx={{my:5, ml:90}} variant="outlined">Update</Button> 
                    </form>
                </Paper>
            </ThemeProvider>
            
      </Box>
    </Box>

        </ThemeProvider>
    )
}

export default Settings
