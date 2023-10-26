//dependencies
import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';

//images
import { ReactComponent as Dashboard } from "../../../assets/images/dashboard.svg";
import { ReactComponent as Assignments } from "../../../assets/images/Assignments.svg";
import { ReactComponent as TourPlanning } from "../../../assets/images/TourPlanning.svg";
import { ReactComponent as Production } from "../../../assets/images/Production.svg";
import { ReactComponent as Sales } from "../../../assets/images/Sales.svg";
import { ReactComponent as BaseData } from "../../../assets/images/BaseData.svg";
import { ReactComponent as Setting } from "../../../assets/images/Setting.svg";
import { ReactComponent as Notifications } from "../../../assets/images/Notifications.svg";
import { ReactComponent as MagnifyingGlass } from "../../../assets/images/MagnifyingGlass.svg";
import { ReactComponent as Logo } from "../../../assets/images/Logo.svg";

//css
import './header.scss'
import { Link } from "react-router-dom";

function Header() {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => { setAnchorElNav(event.currentTarget); };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    return (
        <>
            <AppBar className="mainHeader" position="static">
                <Toolbar disableGutters>
                    <Link to={""} className="mainHeader__logo"><Logo /></Link>
                    <Box className="mainHeader__menu mainHeader__menu--mobile">
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <Dashboard />Dashboard
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <Assignments />  Assignments
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <TourPlanning />  TourPlanning
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <Production />   Production
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <Sales />   Sales
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    <BaseData />   BaseData
                                </Typography>
                            </MenuItem>

                        </Menu>
                    </Box>
                    {/* <Logo /> */}

                    <Box className="mainHeader__menu" sx={{ flexGrow: 1 }}>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                            <Dashboard />Dashboard
                        </Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                            <TourPlanning />  Assignments
                        </Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                            <TourPlanning />  TourPlanning
                        </Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                            <Production />   Production
                        </Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                            <Sales />   Sales
                        </Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                            <BaseData />   BaseData
                        </Button>
                    </Box>

                    <Box className="mainHeader__btnBox">
                        <Box className="searchBox">
                            <input placeholder='Search.....' />
                            <MagnifyingGlass />
                        </Box>
                        <IconButton>
                            <Setting />
                        </IconButton>
                        <IconButton>
                            <Notifications />
                        </IconButton>

                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Header
