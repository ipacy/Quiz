import React from "react";
import {
    Menu,
    MenuItem,
    Avatar,
    Typography,
    Chip
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Img from '../../../assets/online-learning.png';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import DP from '../../../assets/dp.jpg';

const SimpleMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useHistory();

    function handleClick(event) {
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
            {/*<Chip style={{marginRight:'1rem'}}
                avatar={<Avatar onMouseOver={handleClick} alt="Remy Sharp" src={Img}/>}
                onMouseOver={handleClick}
                label={props.name}
                variant="outlined"
            />*/}
            <Avatar onMouseOver={handleClick} alt="Remy Sharp" src={DP} style={{marginRight:'1rem'}}/>
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
                <MenuItem>
                    <Typography variant="inherit">{props.name}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <AccountBoxIcon/>
                    <Typography variant="inherit">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon/>
                    <Typography variant="inherit">Logout</Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default SimpleMenu;
