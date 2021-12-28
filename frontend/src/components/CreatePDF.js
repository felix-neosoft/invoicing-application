import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import { authenticateUser, fetchCompany, fetchUser } from '../config/NodeServices';
import jwt_decode from 'jwt-decode'
import { resetState } from '../redux/invoiceReducer';
import {Document, Page, Text, View, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer'
import ReactPDF from '@react-pdf/renderer'
import {AppBar, createTheme, ThemeProvider, Toolbar, Typography, Button, Box, Menu, MenuItem, CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper} from '@mui/material'

//Material UI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import SummarizeIcon from '@mui/icons-material/Summarize';

// Material Theme
const dashboardTheme = createTheme({
    palette:{
        mode:'dark',
        primary:{
            main: '#3FC1C9'
        }
    }   
})

//create style
const styles = StyleSheet.create({
    page:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#E4E4E4'
    },
    logo:{
        width:"50",
        height:"50",
        marginTop:"30",
        marginLeft:"40"
    },
    heading:{
        position:"absolute",
        fontSize:"25",
        top:"40",
        left:"450"
    },
    fromuser:{
        marginTop:"150",
        marginLeft:"-50"
    },
    status:{
        marginTop:"-150",
        marginLeft:"350"
    },
    tablerow:{
        flexDirection:'row',
        marginTop:"50",
        marginLeft:"-50"
    },
    tabledatarow:{
        flexDirection:'row',
        marginTop:"10",
        marginLeft:"-50"
    }
})


function CreatePDF() {

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

    //to change components in App.js
    let navigate = useNavigate()

    //redux state variables
    const token = useSelector(state => state.user.token)
    const invoice = useSelector(state => state.invoice)
    const dispatch = useDispatch()

    //state variables
    const [company,setCompany] = useState([])
    const [user,setUser] =useState([])

    //useRed varaibles
    const sendpdf = useRef(null)

    let total = 0

    invoice.products.forEach(i =>{
        total += parseInt(i.totalValue)
    })




    useEffect(()=>{
        if(token !==undefined){
            authenticateUser({"token":token}).then(res =>{
                if(res.data.err===1) logout()
            })
            const decode = jwt_decode(token)
            fetchCompany({"email":decode.uid}).then(res =>{
                if(res.data.err===0) setCompany(res.data.data)
            })
            fetchUser({"email":decode.uid}).then(res =>{
                if(res.data.err===0) setUser(res.data.data)
            })
        }
    },[token])




    //logout function  -> login page
    const logout = () =>{
        window.location.replace('/')
    }

    //exitpdf function to re-init redux state
    const exitpdf = () => {
        dispatch(resetState())
        navigate('/dashboard')
    }

    //const Document
    const MyDocument = () => (
        <Document style={styles.Document}>
            <Page size="A4" style={styles.page}>
                <View>
                    <Image src={company.company_logo_path} style={styles.logo}/>
                    <View style={styles.heading}>
                        <Text>Invoice</Text>
                        <Text style={{fontSize:"10",}}>No.123456</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.fromuser}>
                        <Text style={{fontSize:"15"}}>From</Text>
                        <Text>{user.first_name+' '+user.last_name}</Text>
                        <Text>{company.company_name}</Text>
                        <Text>{user.email}</Text>
                        <Text style={{marginTop:"20", fontSize:"15"}}>Bill To</Text>
                        <Text>{invoice.receiver_name}</Text>
                        <Text>{invoice.receiver_email}</Text>
                        <Text>{invoice.receiver_address}</Text>
                    </View>
                    <View style={styles.status}>
                        <Text style={{fontSize:"15",marginLeft:"40"}}>Status</Text>
                        <Text style={{color:"red",marginLeft:"20"}}>{invoice.status}</Text>
                        <Text style={{fontSize:"15",marginLeft:"2", marginTop:"10"}}>Invoice Date</Text>
                        <Text style={{fontSize:"15",marginLeft:"10"}}>{invoice.invoice_date}</Text>
                        <Text style={{fontSize:"15",marginLeft:"20", marginTop:"20"}}>Due Date</Text>
                        <Text style={{fontSize:"15",marginLeft:"10"}}>{invoice.due_date}</Text>
                    </View>
                    <View>
                        <View style={styles.tablerow}>
                            <Text>Sr No.</Text>
                            <Text style={{marginLeft:"60"}}>Name</Text>
                            <Text style={{marginLeft:"60"}}>Qty</Text>
                            <Text style={{marginLeft:"60"}}>Price</Text>
                            <Text style={{marginLeft:"60"}}>Total Price</Text>
                        </View>
                    {invoice.products.map((index,id)=>(
                        <View style={styles.tabledatarow}>
                            <Text style={{marginLeft:"20"}}>{id+1}</Text>
                            <Text style={{marginLeft:"80"}}>{index.item}</Text>
                            <Text style={{marginLeft:"65"}}>{index.quantity}</Text>
                            <Text style={{marginLeft:"70"}}>{index.price}</Text>
                            <Text style={{marginLeft:"90"}}>{index.totalValue}</Text>
                        </View>
                    ))}

                    </View>
                    <Text style={{marginTop:"30",marginLeft:"320"}}>Total Amount : {total}</Text>
                    
                </View>


            </Page>
        </Document>
    )

    const sendToMail = () =>{
        console.log(`${invoice.receiver_email} , ${invoice.invoice_date}, ${invoice.due_date}, ${invoice.receiver_name} ${JSON.stringify(invoice.products)}`)

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
                                <ListItemText><Typography color="primary" onClick={()=>navigate('/addinvoice')} variant="h6">Add Invoice</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><ReceiptIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography color="primary" onClick={()=>navigate('/showinvoices')} variant="h6">Show Invoices</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><SettingsIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography color="primary" onClick={()=>navigate('/settings')} variant="h6">Settings</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><SummarizeIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography color="primary" onClick={exitpdf} variant="h6">Exit PDF</Typography></ListItemText>
                            </ListItem>
                        </List>
                        <Divider />
                    </Drawer>
                </Paper>
                
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }} >
            <Toolbar />
            <Button onClick={sendToMail}>Send to Mail</Button>
            <PDFViewer width="1220" height="1000">
                <MyDocument />
            </PDFViewer>
            
      </Box>
    </Box>

        </ThemeProvider>
    )
}

export default CreatePDF