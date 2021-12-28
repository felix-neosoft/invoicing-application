import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {AppBar, createTheme, ThemeProvider, Toolbar, Typography, Button, Box, Menu, MenuItem, CssBaseline, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper} from '@mui/material'

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
                                <ListItemText><Typography color="primary" variant="h6">Add Invoice</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><ReceiptIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography color="primary" variant="h6">Show Invoices</Typography></ListItemText>
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><SettingsIcon color="primary"/></ListItemIcon>
                                <ListItemText><Typography color="primary" variant="h6">Settings</Typography></ListItemText>
                            </ListItem>
                        </List>
                        <Divider />
                    </Drawer>
                </Paper>
                
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }} >
            <Toolbar />
            <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
          neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
          tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
          sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
          tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
          gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
          et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
          tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Box>
    </Box>

        </ThemeProvider>
    )
}

export default Dashboard
