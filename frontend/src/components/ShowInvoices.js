import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { authenticateUser, changeInvoiceStatus, deleteInvoiceDetails, fetchInvoiceDetails } from '../config/NodeServices';
import {AppBar, createTheme, ThemeProvider, Toolbar, Typography, Button, Box, Menu, MenuItem, CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper,Table ,TableHead, TableRow, TableCell, TableBody} from '@mui/material'

//Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import { setState } from '../redux/invoiceReducer';

// Material Theme
const dashboardTheme = createTheme({
    palette:{
        mode:'dark',
        primary:{
            main: '#3FC1C9'
        }
    }   
})

function ShowInvoices() {
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

    //state variables
    const[invoices,setInvoices] = useState([])

    // redux variables
    const token = useSelector(state => state.user.token)
    const dispatch = useDispatch()

    useEffect(()=>{
        if(token !==undefined){
            authenticateUser({"token":token}).then(res =>{
                if(res.data.err===1) logout()
            })
            const decode = jwt_decode(token)
            fetchInvoiceDetails({"email":decode.uid}).then(res => {
                if(res.data.err===0) setInvoices(res.data.data)
            })
        }
    },[invoices])

    //logout function  -> login page
    const logout = () =>{
        window.location.replace('/')
    }

    //show pdf
    const showpdf = (id) =>{
        dispatch(setState({"receiver_name":invoices[id].receiver_name,"receiver_address":invoices[id].receiver_address,"invoice_date":invoices[id].invoice_date,"due_date":invoices[id].due_date,"status":invoices[id].status,"products":JSON.parse(invoices[id].products)}))
        navigate('/createpdf')
    }

    const deletepdf = (id) =>{
        const decode = jwt_decode(token)
        deleteInvoiceDetails({"email":decode.uid,"pid":id}).then(res=>{
            if(res.data.err===0) alert(res.data.msg)
        })
        navigate('/showinvoices')
    }

    const changestatus = (id,status) => {
        const decode = jwt_decode(token)
        changeInvoiceStatus({"email":decode.uid,"pid":id,"status":status}).then(res => {
            if(res.data.err===0) alert(res.data.msg)
        })
        navigate('/showInvoices')
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No.</TableCell>
                            <TableCell>Receiver Name</TableCell>
                            <TableCell>Invoice Data</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell sx={{textAlign:"center"}}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((inc,id)=>(
                            <TableRow>
                                <TableCell>{inc.pid}</TableCell>
                                <TableCell>{inc.receiver_name}</TableCell>
                                <TableCell>{inc.invoice_date}</TableCell>
                                <TableCell>{inc.due_date}</TableCell>
                                <TableCell>{inc.status}</TableCell>
                                <TableCell sx={{textAlign:"center"}}>
                                    <Button onClick={()=>changestatus(inc.pid,'FULL PAID')}>Full Paid</Button>
                                    <Button onClick={()=>changestatus(inc.pid,'PARTIALLY PAID')}>Partially Paid</Button>
                                    <Button onClick={()=>changestatus(inc.pid,'UNPAID')}>Unpaid</Button>
                                    <Button onClick={()=>showpdf(id)}>Show</Button>
                                    <Button onClick={()=>deletepdf(inc.pid)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
      </Box>
    </Box>

        </ThemeProvider>
    )
}

export default ShowInvoices
