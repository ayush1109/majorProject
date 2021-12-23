import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import React from 'react';
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../redux/actions/productsAction';
import _ from 'lodash';
import Loader from './loader/Loading';


const GreatDeals = (props) => {
    React.useEffect(() => {
        props.getProducts();
    }, []);

    if (props.products.isLoading)
        return (
            <>
                <h1>Loading Great Deals</h1>
                <Loader />
            </>
        );

    else if (!_.isEmpty(props.products.err))
        return (
            <div>Error : {props.products.err.name}<br></br>
                Message : {props.products.err.code}<br></br>
                Stack - {props.products.err.stack}
            </div>
        );

    else if (props.products.data.length === 0)
        return (
            <div></div>
        );

    return (
        <div>
            <h1>Great Deals</h1>
            <Link to="/greatDeals"><button>See All</button></Link>
            <ScrollMenu
            >
                {props.products.data ? props.products.data.map((product) => {
                    if (((product.old_price - product.price) * 100) / product.old_price > 20) {
                        return (

                            <Card sx={{ minWidth: 345 }}>
                                <CardActionArea>
                                    <Link to={{
                                        pathname: `/productDetail/${product.id}`
                                    }}><CardMedia
                                            component="img"
                                            height="140"
                                            image={product.image}
                                            alt={product.name}
                                        />
                                    </Link>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Rs. {product.price} <hr></hr>
                                            by {product.company}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>

                            </Card>
                        );
                    }
                }) : <div>
                </div>}
            </ScrollMenu>

        </div>
    );
}


const mapStateToProps = (state) => {
    return { products: state.products };
};

export default connect(mapStateToProps, {
    getProducts
})(GreatDeals);
