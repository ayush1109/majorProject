import { Tooltip } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { yellow } from '@mui/material/colors';
import { updateUser, getUser } from '../redux/actions/userAction'
import { Edit } from '@mui/icons-material';
import Loader from './loader/Loading';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import EditUserForm from './EditUserForm';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '80%',
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Profile = (props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    console.log(props)
    React.useEffect(() => {
        props.getUser();
    }, []);
    if (props.user.isLoading || _.isEmpty(props.user)) return <Loader />
    else
        return (
            <>
                <div>
                    Name - {props.user.firstName} {props.user.lastName}<br></br>
                    Email - {props.user.email}<br></br>
                    Phone Number - {props.user.phone}<br></br>
                    Address - {props.user.address}<br></br>
                    Profile Photo - {props.user.avatar ? <img src={props.user.avatar} height="100" width="100" alt="profile photo"></img> : null} <br></br>

                    <button>your oders</button>
                    <button>your cart</button>
                    <button>your wishlist</button>
                </div>

                <div>
                    <Tooltip title="Edit Profile"><Avatar sx={{ bgcolor: yellow[500] }} onClick={handleOpen}><Edit /></Avatar></Tooltip>
                </div>



                <div className="modal">
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <EditUserForm handleClose={handleClose} id={props.user.id} />
                            </Box>
                        </Fade>
                    </Modal>
                </div>
            </>



        )
}



const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    };
};

export default connect(mapStateToProps, {
    updateUser,
    getUser
})(Profile);