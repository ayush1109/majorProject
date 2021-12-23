import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../redux/actions/productsAction'
import Loader from './loader/Loading';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import ReactPaginate from 'react-paginate';

const Deals = (props) => {

    return (
        <>
            <div>Great Deals</div>
            <Grid container spacing={1}>
                {props.products && props.products.map((pro, index) => {
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
                                            by {pro.company}
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
            <Deals products={currentItems} />
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




const GreatDealsDetail = (props) => {
    React.useEffect(() => {
        props.getProducts();
    }, []);

    var data = [];

    props.products.data && props.products.data.map((pro, index) => {
        if (((pro.old_price - pro.price) * 100) / pro.old_price > 20)
            data.push(pro);
    })
    if (props.products.isLoading)
        return (
            <Loader />
        );

    else if (!_.isEmpty(props.products.err))
        return (
            <div>Error : {props.products.err.name}<br></br>
                Message : {props.products.err.code}<br></br>
                Stack - {props.products.err.stack}
            </div>
        );

    else if (data.length === 0)
        return (
            <div>
                No great deals products for now
            </div>
        );
    else {
        return (
            <PaginatedItems itemsPerPage={1} products={data} />

        );
    }
}



const mapStateToProps = (state) => {
    return { products: state.products };
};

export default connect(mapStateToProps, {
    getProducts
})(GreatDealsDetail);