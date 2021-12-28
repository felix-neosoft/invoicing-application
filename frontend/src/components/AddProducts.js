import React, {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import {AppBar, createTheme, ThemeProvider, TextField, Toolbar, Typography, Button, Box, Menu, MenuItem, CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material'
import { addInvoiceDetails, authenticateUser } from '../config/NodeServices';
import { addProduct, deleteProduct } from '../redux/invoiceReducer';


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

//RegEx for Validation
const RegForName = RegExp('^[a-zA-Z0-9\\s]{3,30}$')

function AddProducts() {
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
    const products = useSelector(state => state.invoice.products) || []
    const invoice = useSelector(state => state.invoice)

    console.log(products)

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

    //state variables
    const [values,setValues] = useState({item:'',quantity:0,price:0,discount:0,totalValue:0})
    const [errors,setErrors] = useState({item:'',quantity:'',price:'',discount:''})

    //useRef Variables
    const itemRef = useRef(null)
    const quantityRef = useRef(null)
    const priceRef = useRef(null)
    const discountRef = useRef(null)

    const handler = e =>{
        let name = e.target.name
        
        console.log(values)
        switch(name){
            case 'item':
                setErrors({...errors,item:RegForName.test(itemRef.current.value)?'':'Please Enter Item Name'})
                setValues({...values,item:itemRef.current.value})
                break

            case 'quantity':
                setErrors({...errors,quantity:parseInt(quantityRef.current.value)>0 ?'':'Quantity should not be 0'})
                setValues({...values,quantity:parseInt(quantityRef.current.value)})
                break

            case 'price':
                setErrors({...errors,price:parseInt(priceRef.current.value)>0?'':'Price should not be 0'})
                setValues({...values,price:parseInt(priceRef.current.value)})
                break

            case 'discount':
                setErrors({...errors,discount:parseInt(discountRef.current.value)>0 && parseInt(discountRef.current.value)<=100?'':'Discount should not be 0-100'})
                setValues({...values,discount:parseInt(discountRef.current.value)})
                break

            default:

        }
        
    }

    const totalCal = () =>{
        console.log(values)
        let discount = (values.price * values.discount)/100
        console.log(discount)
        let price = values.price - discount
        console.log(price)
        let total = price * values.quantity
        console.log(total)
        setValues({...values,totalValue:`${total}`})
    }

    //function to add products in the redux store
    const addingProduct = () =>{
        if(values.totalValue!==0 && values.totalValue!==undefined){
            dispatch(addProduct(values))
            setValues({...values,totalValue:0})
        }
        else alert("Click on total")
    }

    //function to store bill details in the database and generate pdf
    const generate = () =>{
        const decode = jwt_decode(token)
        addInvoiceDetails({"email":decode.uid,"receiver_email":invoice.receiver_email,"status":"UNPAID","receiver_name":invoice.receiver_name,"receiver_address":invoice.receiver_address,"invoice_date":invoice.invoice_date,"due_date":invoice.due_date,"products":products}).then(res => {
            if(res.data.err===0) alert(res.data.msg)
            else alert(res.data.msg)
        })
        navigate('/createpdf')
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
            <ThemeProvider theme={MainTheme}>
                <Paper sx={{width:3/4, mx:"auto"}}>
                    <Typography sx={{pt:3}} textAlign="center" variant="h5">Add Products</Typography>
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined" label="Item Name" type="text" name="item" inputRef={itemRef} error={errors.item!==''?true:false} onChange={(e => handler(e))} helperText={errors.item} />
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined" label="Quantity" type="text" name="quantity" inputRef={quantityRef} error={errors.quantity!==''?true:false} onChange={(e => handler(e))} helperText={errors.quantity} />
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined" label="Price" type="text" name="price" inputRef={priceRef} error={errors.price!==''?true:false} onChange={(e => handler(e))} helperText={errors.price} />
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined" label="Discount" type="text" name="discount" inputRef={discountRef} error={errors.discount!==''?true:false} onChange={(e => handler(e))} helperText={errors.discount} />
                    <TextField sx={{ml:15,width:3/4,my:3}} variant="outlined"  type="number" disabled value={values.totalValue} />
                    <Button sx={{ml:75,mb:3}} onClick={totalCal} variant="outlined">Total</Button>
                    <Button sx={{ml:10,mb:3}} onClick={addingProduct} variant="outlined">Add</Button>
                    
                </Paper>
            </ThemeProvider>

            <ThemeProvider theme={MainTheme}>
                <Paper sx={{width:3/4, mt:10,mx:"auto",mb:5,pb:5}}>
                <Typography sx={{pt:3}} textAlign="center" variant="h5">Products</Typography>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Sr No.</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((val,id)=>(
                                <TableRow>
                                    <TableCell>{id+1}</TableCell>
                                    <TableCell>{val.item}</TableCell>
                                    <TableCell>{val.quantity}</TableCell>
                                    <TableCell>{val.price}</TableCell>
                                    <TableCell>{val.discount}</TableCell>
                                    <TableCell>{val.totalValue}</TableCell>
                                    <TableCell><Button variant="contained" onClick={()=>{dispatch(deleteProduct(id))
                                    navigate('/addproducts')}} color="error">Delete</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button sx={{my:3,ml:90}} onClick={generate} variant="outlined">Generate PDF</Button>
                    
                </Paper>
            </ThemeProvider>


      </Box>
    </Box>

        </ThemeProvider>
    )
}

export default AddProducts
