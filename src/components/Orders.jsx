import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getOrders } from '../redux/actions/orderActions'
import Loader from './loader/Loading';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import _ from 'lodash';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Order = (props) => {

    return (
        <>
            <div>Your Products</div>
            <Grid container spacing={1}>
                {props.products && props.products.map((pro, index) => {
                    return (
                        <Grid item xs={4}>
                            <Card sx={{ minWidth: 345 }} key={index}>
                                <CardActionArea>
                                    <Link to={{
                                        pathname: `/orderDetail/${pro.docId}`
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
                                </CardActionArea>

                            </Card>
                        </Grid>
                    );

                })}
            </Grid>
        </>
    );
}


function PaginatedItems({ itemsPerPage, products }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(products.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(products.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % products.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    return (
        <>
            <Order products={currentItems} />
            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
        </>
    );
}



const MyOrders = (props) => {

    React.useEffect(() => {
        props.getOrders();
    }, []);

    if (props.orders.isLoading)
        return (
            <Loader />
        );

    else if (!_.isEmpty(props.orders.err))
        return (
            <div>Error : {props.products.err.name}<br></br>
                Message : {props.products.err.code}<br></br>
                Stack - {props.products.err.stack}
            </div>
        );

    else if (props.orders.length === 0)
        return (
            <div>No orders till yet!</div>
        );
    else
        return (
            <PaginatedItems itemsPerPage={1} products={props.orders.data} />

        );
}


const mapStateToProps = (state) => {
    return {
        orders: state.orders,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, {
    getOrders
})(MyOrders);