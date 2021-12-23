import React from 'react';
import { connect } from 'react-redux';
import { getAProduct, buyProduct, rateProduct, deletRateProduct } from '../redux/actions/productsAction';
import { cartProduct, getCart } from '../redux/actions/cartActions';
import Loader from './loader/Loading';
import _ from 'lodash';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import ReactStars from "react-rating-stars-component";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CenteredTabs from "./tabs/CenteredTab";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '40%',
    // overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function RenderDetail({ product }) {
    return (
        <div>
            Name - {product.name}<br></br>
            category - {product.category}<br></br>
            Company - {product.company}<br></br>
            Delivery Charges - {product.delivery}<br></br>
            Old Price - {product.old_price}<br></br>
            Price - {product.price}<br></br>
            Number of items - {product.stock.numberOfItems}<br></br>
            Image - <img src={product.image} height="200" width="200" alt="Product Image"></img><br></br>
            <a href="#ratings"><button>see reviews</button></a> <br></br>
            Tags - <ul>{product.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
            ))}</ul>

            Description - <ul>{product.description.map((des, index) => (
                <li key={index}>{des}</li>
            ))}</ul>


        </div>
    );
}


// function RenderRatings({ product }) {


//     return (
//         <>

//     </>
//     );
// }



const RenderRateButton = ({ auth, id, rateProduct }) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    var rating = 0;
    const ratingChanged = (newRating) => {
        rating = newRating;
    };

    const rate = () => {
        var review = document.querySelector('#review').value;
        rateProduct(auth.user.id, id, rating, review);
    }

    if (auth.isLoading) {
        return (
            <Loader />
        );
    }

    if (auth.isLogedIn) {
        if (_.find(auth.user.orders, { id: id })) {
            return (
                <div>
                    <button onClick={handleOpen}>rate product</button>

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
                                    {_.find(auth.user.reviews, { product: id }) ? <div>You have already rated the product. Go to reviews section to see your review!!!</div> :
                                        <>
                                            <label htmlFor="Quantity" style={{ display: 'block' }}>
                                                Rate Product
                                            </label>
                                            <ReactStars
                                                count={5}
                                                onChange={ratingChanged}
                                                size={24}
                                                isHalf={true}
                                                emptyIcon={<StarBorderIcon />}
                                                halfIcon={<StarHalfIcon />}
                                                fullIcon={<StarIcon />}
                                                activeColor="#ffd700"
                                            />
                                            <label htmlFor="Quantity" style={{ display: 'block' }}>
                                                Review Product
                                            </label>
                                            <textarea rows={2} id="review" placeholder="Good Product">Good Product</textarea>
                                            <div>
                                                <button onClick={rate}>Submit</button>
                                            </div>
                                        </>}

                                </Box>
                            </Fade>
                        </Modal>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }
    else {
        return (
            <div></div>
        );
    }
}


const ProductDetail = (props) => {
    const history = useHistory();
    React.useEffect(() => {
        props.getAProduct(props.match.params.id);
        props.getCart();
    }, []);
    console.log(props);

    const [activeTab, setActiveTab] = React.useState(0);

    const headings = [
        "Ratings",
        "My Rating"
    ];

    const renderForm = () => {
        if (activeTab === 0) return <div>
            {props.product.data.reviews && props.product.data.reviews.map((review) => {
                return (
                    <ul>
                        <li>
                            <p>{review.rating}</p>
                            <p>{review.review}</p>
                        </li>
                    </ul>
                );
            })}
        </div>;
        if (activeTab === 1) {
            var review = _.find(props.auth.user.reviews, { product: props.match.params.id });
            // const editReview = () => {
            //     props.editRateProduct(props.auth.user.id, review.product, )
            // }
            const deleteReview = () => {
                props.deletRateProduct(props.auth.user.id, review.product, review.rating, review.review);
            }
            if (review != undefined)
                return <div>
                    <p>{review.rating}</p>
                    <p>{review.review}</p>
                    <button
                    // onClick={editReview}
                    >Edit</button>
                    <button onClick={deleteReview}>delete</button>
                </div>
            else return <div>No review found!</div>
        }
    };



    const [open, setOpen] = React.useState(false);
    const [price, setPrice] = React.useState(0);
    const handleOpen = () => {
        setPrice(props.product.data.price)
        setOpen(true)
    }
    const handleClose = () => setOpen(false);
    const showPrice = () => {
        const quantity = document.querySelector('#quantity').value;
        setPrice(quantity * props.product.data.price);
    }

    var flag = 0;

    const buyNow = () => {
        if (props.auth.isLogedIn === false) {
            history.push('/login');
        }
        else if (props.auth.user.address === undefined || props.auth.user.address === null) {
            console.log('update your adress');
        }
        else {
            props.buyProduct(props.auth.user.id, props.match.params.id, price / props.product.data.price);
            history.push('/thankYou');
            console.log();
        }
    }

    const addToCart = () => {
        props.cartProduct(props.auth.user.id, props.match.params.id)
    }




    if (props.product.isLoading)
        return (
            <Loader />
        );

    else if (!_.isEmpty(props.product.err))
        return (
            <div>Error : {props.product.err.name}<br></br>
                Message : {props.product.err.code}</div>
        );

    else
        return (
            <>
                <RenderDetail product={props.product.data} />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <button onClick={handleOpen}>Buy Now</button>
                    </Grid>
                    <Grid item xs={6}>
                        {props.cart.data.map(p => {
                            if (p.id === props.match.params.id) {
                                flag = 1;
                                // return (
                                //     
                                // );
                            }
                        })}
                        {flag === 0 ?
                            <button onClick={addToCart}>Add to Cart</button> :
                            <Link to="/myCart"><button>go to Cart</button></Link>}
                    </Grid>
                </Grid>

                <div className="rateBtn">
                    <RenderRateButton auth={props.auth} id={props.match.params.id} rateProduct={props.rateProduct} />
                </div>

                <div className="ratings" id="ratings">
                    <CenteredTabs
                        headings={headings}
                        changeActiveTab={setActiveTab}
                        centered
                    />
                    <br />
                    <br />
                    {renderForm()}
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
                                <label htmlFor="Quantity" style={{ display: 'block' }}>
                                    Quantity
                                </label>
                                <select
                                    name="quantity"
                                    onChange={showPrice}
                                    id="quantity"
                                >
                                    <option value="" label="Select" />
                                    <option value={1} label={1} selected={true} />
                                    <option value={2} label={2} />
                                    <option value={3} label={3} />
                                    <option value={4} label={4} />
                                    <option value={5} label={5} />

                                </select>
                                <div className="price">
                                    Total Price of the Product - {price}
                                </div>
                                <div className="buttons">
                                    <button onClick={buyNow}>buy</button>
                                    <button>cancel</button>
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
        product: state.product,
        cart: state.cart,
        auth: state.auth
    };
};

export default connect(mapStateToProps, {
    getAProduct,
    buyProduct,
    cartProduct,
    getCart,
    rateProduct,
    deletRateProduct
})(ProductDetail);