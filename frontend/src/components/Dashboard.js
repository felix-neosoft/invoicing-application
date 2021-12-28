import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import {AppBar, createTheme, ThemeProvider, Card, CardContent, Toolbar, Typography, Button, Box, Menu, MenuItem, CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper} from '@mui/material'
import { authenticateUser, fetchInvoiceDetails } from '../config/NodeServices';



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

function Dashboard() {
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
    const [amount,setAmount] = useState(0)
    const [totalInc,setTotalInc] = useState(0)
    const [data,setData] = useState([])

    //redux state variables
    const token = useSelector(state => state.user.token)

    useEffect(()=>{
        if(token !==undefined){
            authenticateUser({"token":token}).then(res =>{
                if(res.data.err===1) logout()
                console.log(res.data.msg)
            })
            const decode = jwt_decode(token)
            fetchInvoiceDetails({"email":decode.uid}).then(res => {
                if(res.data.err===0){
                    setData(res.data.data)
                }
            })
        }
    },[token])

    useEffect(()=>{
        let inctotal = 0
        let incamount = 0
        data.map(element => {
            inctotal+=1
            if(element.status==="UNPAID"){
                let products = JSON.parse(element.products)
                products.forEach(index => {
                incamount+=parseInt(index.totalValue)
                })
            }
        });
        setAmount(incamount)
        setTotalInc(inctotal)
    },[data])

    const logout = () =>{
        window.location.replace('/')
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
            <Card sx={{width:300}}>
                <CardContent>
                    <Typography variant="h5">Total Amount Pending</Typography>
                    <Typography sx={{textAlign:"center"}} variant="h5">Rs. {amount}</Typography>
                </CardContent>
            </Card>
            <Card sx={{width:300, mt:10}}>
                <CardContent>
                    <Typography variant="h5">Total Invoices Generated</Typography>
                    <Typography sx={{textAlign:"center"}} variant="h5">{totalInc}</Typography>
                </CardContent>
            </Card>
      </Box>
    </Box>

        </ThemeProvider>
    )
}

export default Dashboard
