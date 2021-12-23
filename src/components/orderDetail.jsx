import { Grid } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAOrder } from '../redux/actions/orderActions';
import { cancelProduct } from '../redux/actions/productsAction';
import Loader from './loader/Loading';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function RenderProductDetail({ product }) {
    return (
        <div>
            Product Detail - <br></br>
            Name - {product.name}<br></br>
            category - {product.category}<br></br>
            Company - {product.company}<br></br>
            Delivery Charges - {product.delivery}<br></br>
            Old Price - {product.old_price}<br></br>
            Price - {product.price}<br></br>
            Number of items - {product.stock.numberOfItems}<br></br>
            Image - <img src={product.image} height="200" width="200" alt="Product Image"></img><br></br>
            Tags - <ul>{product.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
            ))}</ul>

            Description - <ul>{product.description.map((des, index) => (
                <li key={index}>{des}</li>
            ))}</ul>

        </div>
    );
}


function RenderOrderDetail(props) {

    const [open, setOpen] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const RenderStatus = () => {
        if (props.order.status == 'packed')
            return (
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        placed - done
                    </Grid>
                    <Grid item xs={3}>
                        packed - done
                    </Grid>
                    <Grid item xs={3}>
                        shipped
                    </Grid>
                    <Grid item xs={3}>
                        delivered
                    </Grid>
                </Grid>
            );

        else if (props.order.status == 'shipped')
            return (
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        placed - done
                    </Grid>
                    <Grid item xs={3}>
                        packed - done
                    </Grid>
                    <Grid item xs={3}>
                        shipped - done
                    </Grid>
                    <Grid item xs={3}>
                        delivered
                    </Grid>
                </Grid>
            );

        else if (props.order.status == 'delivered')
            return (
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        placed - done
                    </Grid>
                    <Grid item xs={3}>
                        packed - done
                    </Grid>
                    <Grid item xs={3}>
                        shipped - done
                    </Grid>
                    <Grid item xs={3}>
                        delivered - done
                    </Grid>
                </Grid>
            );

        else
            return (
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        placed - done
                    </Grid>
                    <Grid item xs={3}>
                        packed -
                    </Grid>
                    <Grid item xs={3}>
                        shipped
                    </Grid>
                    <Grid item xs={3}>
                        delivered
                    </Grid>
                </Grid>
            );
    }

    const shareData = {
        title: `${props.order.name}`,
        text: `I am sharing my order with you.`,
        url: `${window.location.href}`
    }

    const shareOrder = async () => {
        try {
            await navigator.share(shareData);
            setSuccess(true);
            setOpen(true);
        } catch (err) {
            setSuccess(false);
            setOpen(true);
        }
    }

    return (
        <>
            Order Detail - <br></br>

            Placed At - {props.order.placedAt} <br></br>

            Order Status - <br></br>

            <RenderStatus /> <br></br>

            Estimated Delivery Date (provided by Seller) - {props.order.deliveryDate}<br></br>

            Message by seller - {props.order.message} <br></br>

            <button onClick={props.handleOpen}>Cancel</button>
            <button onClick={shareOrder}>Share Order details</button>


            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={success ? "success" : "error"} sx={{ width: '100%' }}>
                    {success ? "Order shared successfully" : "Order could not be shared successfully"}
                </Alert>
            </Snackbar>

        </>
    );
}


const ProductDetail = (props) => {
    const history = useHistory();
    React.useEffect(() => {
        props.getAOrder(props.match.params.id);
    }, []);
    console.log(props);


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

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const cancelOrder = () => {
        const reason = document.querySelector('#reason').value;
        const comments = document.querySelector('#comments').value;
        console.log(reason, comments)
        props.cancelProduct(props.order.data.user,
            props.order.data.product,
            props.match.params.id,
            props.order.data.number,
            reason,
            comments);

        history.push('/');

    }

    if (props.order.isLoading)
        return (
            <Loader />
        );

    else if (!_.isEmpty(props.order.err))
        return (
            <div>Error : {props.products.err.name}<br></br>
                Message : {props.products.err.code}</div>
        );

    else
        return (
            <>
                <RenderOrderDetail order={props.order.data} handleOpen={handleOpen} />
                <RenderProductDetail product={props.order.data} />

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
                                <label htmlFor="Quantity" style={{ display: 'block' }}>
                                    Reason
                                </label>
                                <select
                                    name="reason"
                                    id="reason"
                                >
                                    <option value="" label="Select" />
                                    <option value="reason 1" label="Reason 1" />
                                    <option value="reason 2" label="Reason 2" />
                                    <option value="reason 3" label="Reason 3" />
                                    <option value="reason 4" label="Reason 4" />
                                    <option value="reason 5" label="Reason 5" />


                                </select>
                                <label htmlFor="Quantity" style={{ display: 'block' }}>
                                    Additional Comments (if any)
                                </label>
                                <textarea rows={2} id="comments" />
                                <div className="buttons">
                                    <button onClick={cancelOrder}>Cancel</button>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>
                </div>

            </>
        );
}

const mapStateToProps = (state) => {
    return {
        order: state.order
    };
};

export default connect(mapStateToProps, {
    getAOrder,
    cancelProduct
})(ProductDetail);