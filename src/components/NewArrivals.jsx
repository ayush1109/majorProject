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

const NewArrivals = (props) => {
    React.useEffect(() => {
        props.getProducts();
    }, []);

    if (props.products.isLoading)
        return (
            <>
                <h1>Loading New Arrivals</h1>
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

    else

        return (
            <div>
                <h1>New Arrivals</h1>
                <Link to="/newArrivals"><button>See All</button></Link>
                <ScrollMenu
                >
                    {props.products.data.length > 0 ? props.products.data.map((product) => {
                        var productDate = product.updatedAt.toDate().toDateString();
                        var date = new Date().toDateString();
                        var date2 = Date.parse(date);
                        var productDate2 = Date.parse(productDate);
                        if (date2 - productDate2 <= 86400000) {
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
})(NewArrivals);
