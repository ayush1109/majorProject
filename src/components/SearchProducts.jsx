import { CardActionArea, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProductsBySearch } from '../redux/actions/productsAction';
import Loader from './loader/Loading';

import ReactPaginate from 'react-paginate';


function Product(props) {

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
                                        </Typography>
                                    </CardContent>
                                    {/* <CardActions>
                                        
                                        
                                    </CardActions> */}
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
            <Product products={currentItems} />
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


const SearchProducts = (props) => {

    React.useEffect(() => {
        props.getProductsBySearch(query)
    }, []);

    console.log(props)

    var query = props.location.search.substring(1);

    console.log(query)

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

    else if (props.products.data.length === 0)
        return (
            <div>No products !</div>
        );

    else {

        return (
            <>
                <PaginatedItems itemsPerPage={1} products={props.products.data} />
            </>

        );
    }

}


const mapStateToProps = (state) => {
    return {
        products: state.products
    };
};

export default connect(mapStateToProps, {
    getProductsBySearch
})(SearchProducts);