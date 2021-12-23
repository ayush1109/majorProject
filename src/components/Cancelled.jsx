import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getCancelled } from '../redux/actions/cancelledActions'
import Loader from './loader/Loading';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import _ from 'lodash';
import { Grid } from '@mui/material';
import ReactPaginate from 'react-paginate';

const Cancelled = (props) => {

    return (
        <>
            <div>Your Products</div>
            <Grid container spacing={1}>
                {props.products && props.products.map((pro, index) => {
                    return (
                        <Grid item xs={4}>
                            <Card sx={{ minWidth: 345 }} key={index}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={pro.image}
                                        alt={pro.name}
                                    />
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
            <Cancelled products={currentItems} />
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
        props.getCancelled();
    }, []);

    if (props.cancelled.isLoading)
        return (
            <Loader />
        );

    else if (!_.isEmpty(props.cancelled.err))
        return (
            <div>Error : {props.products.err.name}<br></br>
                Message : {props.products.err.code}<br></br>
                Stack - {props.products.err.stack}
            </div>
        );

    else if (props.cancelled.length === 0)
        return (
            <div>No cancelled till yet!</div>
        );
    else
        return (
            <PaginatedItems itemsPerPage={1} products={props.cancelled.data} />

        );
}


const mapStateToProps = (state) => {
    return {
        cancelled: state.cancelled,
        user: state.auth.user
    };
};

export default connect(mapStateToProps, {
    getCancelled
})(MyOrders);