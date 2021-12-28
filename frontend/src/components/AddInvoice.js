import React, {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {AppBar, createTheme, ThemeProvider, Grid, TextField, Toolbar, Typography, Button, Box, Menu, MenuItem, CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper} from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { authenticateUser } from '../config/NodeServices';
import { addReceiver } from '../redux/invoiceReducer';



//Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';



// Material Theme
const dashboardTheme = createTheme({
    palette:{
        mode:'dark',
        primary:{
            main: '#3FC1C9'
        }
    }   
})

const MainTheme = createTheme({})


//RegEx For Validation
const RegForName = RegExp('^[a-zA-Z]+\\s+[a-zA-Z]{3,15}$')
const RegForAddress = RegExp('^[a-zA-Z0-9.,_\\s-]{7,100}$') 
const RegForEmail = RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$');

function AddInvoice() {
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

    //redux dispatch function
    const dispatch = useDispatch()

    useEffect(()=>{
        if(token !==undefined){
            authenticateUser({"token":token}).then(res =>{
                if(res.data.err===1) logout()
                console.log(res.data.msg)
            })
        }
    },[token])

    //logout function  -> login page
    const logout = () =>{
        window.location.replace('/')
    }

    //Go to Products Page and storing data to redux function
    const productsPage = () => {
        dispatch(addReceiver({"receiver_email":values.receiver_email,"receiver_name":values.receiver_name,"receiver_address":values.receiver_address,"invoice_date":invoiceDateRef.current.value,"due_date":dueDateRef.current.value}))
        navigate('/addproducts')
    } 

    // state variables
    const [values,setValues] = useState({receiver_email:'',receiver_name:'',receiver_address:'',invoice_date:new Date('2014-08-18T21:11:54'),due_date:new Date('2014-08-18T21:11:54')})
    const [errors,setErrors] = useState({receiver_email:'',receiver_name:'',receiver_address:'',due_date:''})

    //useRef Variables
    const rnameRef = useRef(null)
    const raddressRef = useRef(null)
    const invoiceDateRef = useRef(null)
    const dueDateRef = useRef(null)
    const remailRef = useRef(null)

    //handler function for validation
    const handler = e =>{
        let name = e.target.name
        switch(name){
            case 'rname':
                setErrors({...errors,receiver_name:RegForName.test(rnameRef.current.value)?'':'Please Enter Full Name'})
                setValues({...values,receiver_name:rnameRef.current.value})
                break
            
            case 'raddress':
                setErrors({...errors,receiver_address:RegForAddress.test(raddressRef.current.value)?'':'Please Enter Address'})
                setValues({...values,receiver_address:raddressRef.current.value})
                break

            case 'remail':
                setErrors({...errors,receiver_email:RegForEmail.test(remailRef.current.value)?'':'Please Enter Email in correct format'})
                setValues({...values,receiver_email:remailRef.current.value})

            default :
        }
    }

    // Datepicker State Management
    const [value, setValue] = React.useState(new Date('2021-12-13T21:11:54'));
    const handleChange = (newValue) => {
    setValue(newValue);
    };



    return (
        <ThemeProvider theme={dashboardTheme}>  
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex:2}}>
                    <Toolbar>
                        <Typography variant="h5" component="div" sx={{flexGrow:1}}><img alt="dash-logo" src="images/gui/logo.svg" width="20" /> OctraCal</Typography>
                        <Button  onClick={handleClick} color="primary"> Welcome User </Button>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem onClick={logout}>Logout</MenuItem>
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
                    <Typography sx={{pt:3}} textAlign="center" variant="h5">Bill To</Typography>
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined" label="Receiver Full Name" type="text" name="rname" inputRef={rnameRef} error={errors.receiver_name!==''?true:false} onChange={e => handler(e)} helperText={errors.receiver_name} />
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined" label="Receiver Email" type="text" name="remail" inputRef={remailRef} error={errors.receiver_email!==''?true:false} onChange={e => handler(e)} helperText={errors.receiver_email} />
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined" label="Reciever Address" type="text" name="raddress" inputRef={raddressRef} error={errors.receiver_address!==''?true:false} onChange={e => handler(e)} helperText={errors.receiver_address} />
                    <Grid sx={{ml:12}} container spacing={10}>
                        <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker label="Invoice Date" inputRef={invoiceDateRef} readOnly renderInput={(params) => <TextField {...params} />}/>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker label="Due Date" inputFormat="MM/dd/yyyy" inputRef={dueDateRef} onChange={e => setValue(e) }  value={value} renderInput={(params) => <TextField {...params} />} />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                    <Button onClick={productsPage} sx={{ml:100,mt:5,mb:3}} variant="outlined">Next</Button>
                    
                </Paper>
            </ThemeProvider>
      </Box>
    </Box>

        </ThemeProvider>
    )
}

export default AddInvoice
