import React from "react";
import {Avatar, Box, Menu, MenuItem, Typography} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Img from '../../../assets/online-learning.png';
import Ad from '../../../assets/admin.jpg';
import {makeStyles} from "@material-ui/core/styles";
import './SimpleMenu.css';


const useStyles = makeStyles((theme) => ({
    typo: {
        marginTop: '0.3rem',
        marginRight: '10px',
        color: '#003678'
    },
    avatar: {
        marginRight: '10px',
        marginLeft: '10px',
        border: '1px solid #8e908c59'
    }
}));
const SimpleMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useHistory();
    const classes = useStyles();

    const handleClick = (event) => {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expireDate');
        history.push('/');
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div className={'row'}>
            <Box className='row menuBox' onMouseOver={handleClick}>
                <Avatar alt="Remy Sharp" src={props.isAdmin ? Ad : Img}
                        className={classes.avatar}/>
                <Typography className={classes.typo} variant="h5"
                            component="h2">{props.name}</Typography>
            </Box>
            <Menu
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                transformOrigin={{vertical: "bottom", horizontal: "center"}}
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{onMouseLeave: handleClose}}
                getContentAnchorEl={null}
            >
                <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon/>
                    <Typography variant="inherit">Logout</Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default SimpleMenu;
