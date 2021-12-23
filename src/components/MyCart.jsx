import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Button, CardActionArea, CardActions, Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeCartProduct, updateCart, getCart } from '../redux/actions/cartActions';
import { buyProduct } from '../redux/actions/productsAction';
import Loader from './loader/Loading';

function Product(props) {

    return (
        <>
            <div>Your Products</div>
            <Grid container spacing={1}>
                {props.products.map((pro, index) => {
                    const updateQuantity = () => {
                        var quan = document.getElementById(pro.id).value;
                        console.log(quan, pro.id)
                        props.updateCart(props.id, pro.id, quan, pro.number);
                    }
                    return (
                        <Grid item xs={4}>
                            <Card sx={{ minWidth: 345 }} key={index}>
                                <CardActionArea>
                                    <Link to={{
                                        pathname: `/productDetail/${pro.id}`
                                    }}><CardMedia
                                            component="img"
                                            height="140"
                                            image={pro.image}
                                            alt={pro.name}
                                        />
                                    </Link>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {pro.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Rs. {pro.price} <br></br>
                                            by {pro.company}<br></br>
                                            Quantity - {pro.number}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <select
                                            name="quantity"
                                            onChange={updateQuantity}
                                            id={pro.id}
                                        >
                                            <option value={1} label={1} />
                                            <option value={2} label={2} />
                                            <option value={3} label={3} />
                                            <option value={4} label={4} />
                                            <option value={5} label={5} />

                                        </select>
                                        <Button size="small" onClick={() => {
                                            props.removeCartProduct(props.id, pro.id, pro.number);
                                        }}>Remove</Button>
                                    </CardActions>
                                </CardActionArea>

                            </Card>
                        </Grid>
                    );

                })}
            </Grid>
        </>
    );
}



const MyCart = (props) => {

    React.useEffect(() => {
        props.getCart();
    }, []);

    var totalPrice = 0;

    const buyAll = () => {
        props.cart.data.map(d => {
            props.buyProduct(props.user.id, d.id, d.number);
            props.removeCartProduct(props.user.id, d.id, d.number);
        })
    }

    if (props.cart.data.length === 0) totalPrice = 0;
    else {
        props.cart.data.map(p => {
            totalPrice = totalPrice + p.price * Number(p.number);
        })
    }


    if (props.cart.isLoading)
        return (
            <Loader />
        );

    else if (!_.isEmpty(props.cart.err))
        return (
            <div>Error : {props.products.err.name}<br></br>
                Message : {props.products.err.code}<br></br>
                Stack - {props.products.err.stack}
            </div>
        );

    else if (props.cart.data.length === 0)
        return (
            <div>No cart till yet!</div>
        );

    else {

        return (
            <>
                <Product products={props.cart.data}
                    id={props.user.id}
                    removeCartProduct={props.removeCartProduct}
                    updateCart={props.updateCart} />

                <AppBar position="sticky" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                    <Toolbar>
                        <div>
                            Total products - {props.cart.data.length} <br></br>
                            Total price - {totalPrice}
                        </div>

                        <Box sx={{ flexGrow: 1 }} />
                        <button onClick={buyAll}>buy now</button>

                    </Toolbar>
                </AppBar>
            </>

        );
    }

}


const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, {
    removeCartProduct,
    updateCart,
    getCart,
    buyProduct,
    removeCartProduct
})(MyCart);