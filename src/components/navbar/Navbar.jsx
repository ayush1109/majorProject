import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import Avatar from '@mui/material/Avatar';
import { getUser, logoutUser } from '../../redux/actions/userAction'
import { getKeywords, addKeywords } from '../../redux/actions/keywordsAction'
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function PrimarySearchAppBar(props) {

    React.useEffect(() => {
        props.getUser();
        props.getKeywords();
    }, []);

    const items = props.keywords.data;

    const history = useHistory();


    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };


    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const handleOnSearch = (string, results) => {
        console.log(string, results);
    };

    const handleOnHover = (result) => {
        console.log(result);
    };

    const handleOnSelect = (item) => {
        console.log(item);
        if (window.location.href.includes('/searchProducts')) {
            window.open(`http://localhost:3001/searchProducts?${item.name}`, '_blank').focus();
        }
        else {
            history.push({
                pathname: '/searchProducts',
                search: item.name
            })
        }
    };

    const handleOnFocus = () => {
        console.log("Focused");
    };

    const handleOnClear = () => {
        console.log("Cleared");
    };

    const MyAvatar = () => {
        if (props.user != undefined && props.user.avatar) {
            return (
                <Avatar
                    alt={props.user.firstName}
                    src={props.user.avatar}
                    sx={{ width: 24, height: 24 }}
                />
            );
        }
        else if (props.user != undefined && props.user.firstName) {
            return (
                <Avatar
                    alt={props.user.name}
                    {...stringAvatar(`${props.user.firstName} ${props.user.lastName}`)}
                    sx={{ width: 24, height: 24 }}
                />
            );
        }
        else {
            return (
                <Avatar
                    alt="Shopify User"
                    {...stringAvatar('Shopify User')}
                    sx={{ width: 24, height: 24 }}
                />
            );
        }
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {props.user != undefined ? <Link to="/profile"><MenuItem onClick={handleMenuClose}>Profile</MenuItem></Link> : <MenuItem onClick={handleMenuClose}>Profile</MenuItem>}
            <MenuItem onClick={() => {
                handleMenuClose();
                props.logoutUser();
                history.push('/');
            }}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Link to="/myCart"><Badge badgeContent={props.user.cart ? props.user.cart.length : 0} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                    </Link>
                </IconButton>
                <p>Cart</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Link to="/myorders"><Badge badgeContent={props.user.orders ? props.user.orders.length : 0} color="error">
                        <FolderIcon />
                    </Badge>
                    </Link>
                </IconButton>
                <p>My Orders</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <MyAvatar />
                </IconButton>
                <p>{props.user != undefined ? props.user.firstName : null}</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        <Link to="/">Shopify</Link>
                    </Typography>

                    <div style={{ width: 200, margin: 20 }}>
                        {/* <SearchIcon /> */}
                        <ReactSearchAutocomplete
                            items={items}
                            onSearch={handleOnSearch}
                            onHover={handleOnHover}
                            onSelect={handleOnSelect}
                            onFocus={handleOnFocus}
                            onClear={handleOnClear}
                            maxResults={10}
                            placeholder="Search..."
                            styling={{ zIndex: 2 }} // To display it on top of the search box below
                            autoFocus
                        />
                    </div>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Link to="/myCart"><Badge badgeContent={props.user.cart ? props.user.cart.length : 0} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                            </Link>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Link to="/myorders"><Badge badgeContent={props.user.orders ? props.user.orders.length : 0} color="error">
                                <FolderIcon />
                            </Badge>
                            </Link>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <MyAvatar />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box >
    );
}


const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        auth: state.auth,
        keywords: state.keywords
    };
};

export default connect(mapStateToProps, {
    getUser,
    logoutUser,
    getKeywords,
    addKeywords
})(PrimarySearchAppBar);