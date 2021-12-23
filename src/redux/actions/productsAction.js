import firebase from 'firebase';
import _ from 'lodash';
import {
    BUY_PRODUCT, BUY_PRODUCT_FAILED, BUY_PRODUCT_LOADING,
    GET_PRODUCT, GET_PRODUCTS, GET_PRODUCTS_FAILED,
    GET_PRODUCTS_LOADING, GET_PRODUCT_FAILED, GET_PRODUCT_LOADING,
    CANCEL_PRODUCT, CANCEL_PRODUCT_FAILED, CANCEL_PRODUCT_LOADING,
    RATE_PRODUCT, RATE_PRODUCT_FAILED, RATE_PRODUCT_LOADING,

} from "./types";



export const getProducts = () => async (dispatch) => {

    dispatch({
        type: GET_PRODUCTS_LOADING
    })
    try {

        const db = firebase.firestore();
        db.collection('products')
            .orderBy('updatedAt')
            .onSnapshot((querySnapshot) => {
                const productArray = [];
                querySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id })
                }, (error) => {
                    dispatch({
                        type: GET_PRODUCTS_FAILED,
                        payload: error
                    })
                })
                dispatch({
                    type: GET_PRODUCTS,
                    payload: productArray
                })
            })

    }
    catch (e) {
        dispatch({
            type: GET_PRODUCTS_FAILED,
            payload: e
        })
    }
}

export const getProductsByCategory = (name) => async (dispatch) => {
    const productArray = [];
    dispatch({
        type: GET_PRODUCTS_LOADING
    })
    try {

        const db = firebase.firestore();

        const snapshot = db.collection('products')
            .orderBy('updatedAt')
            .where('category', '==', name)
            .get();


        (await snapshot).docs.map((doc) => {
            if (doc) {
                productArray.push({ ...doc.data(), id: doc.id });
            }

            else {
                dispatch({
                    type: GET_PRODUCTS_FAILED,
                    payload: 'No products'
                })
            }
        })

        console.log(productArray)


        dispatch({
            type: GET_PRODUCTS,
            payload: productArray
        })

    }
    catch (e) {
        dispatch({
            type: GET_PRODUCTS_FAILED,
            payload: e
        })
    }
}

async function getProductsByQuery(query) {

    const db = firebase.firestore();
    const productsRef = db.collection('products');

    const byCategory = productsRef.where('category', '==', query).get();
    const byName = productsRef.where('name', '==', query).get();
    const byCompany = productsRef.where('company', '==', query).get();
    const byDescription = productsRef.where('description', 'array-contains', query).get();
    const byTags = productsRef.where('tags', 'array-contains', query).get();

    const [category, name, company, description, tags] = await Promise.all([
        byCategory, byName, byCompany, byDescription, byTags
    ])
    const categoryArray = category.docs;
    const nameArray = name.docs;
    const companyArray = company.docs;
    const descriptionArray = description.docs;
    const tagsArray = tags.docs;

    const productsArray = _.concat(categoryArray, nameArray, companyArray, descriptionArray, tagsArray);

    return _.uniqWith(productsArray, _.isEqual);

}

export const getProductsBySearch = (query) => async (dispatch) => {
    const productArray = [];
    dispatch({
        type: GET_PRODUCTS_LOADING
    })
    try {

        getProductsByQuery(query).then(res => {
            res.forEach(doc => {
                console.log(doc.data(), doc.id)
                productArray.push({ ...doc.data(), id: doc.id })
            })
            console.log(productArray)

            dispatch({
                type: GET_PRODUCTS,
                payload: productArray
            })
        })



    }
    catch (e) {
        console.log(e)
        dispatch({
            type: GET_PRODUCTS_FAILED,
            payload: e.message
        })
    }
}




export const getAProduct = (docId) => async (dispatch) => {

    dispatch({
        type: GET_PRODUCT_LOADING
    })
    try {
        const db = firebase.firestore();

        db.collection('products').doc(docId).get()
            .then((doc) => {
                if (doc.exists)
                    dispatch({
                        type: GET_PRODUCT,
                        payload: doc.data()
                    })
                else
                    dispatch({
                        type: GET_PRODUCT_FAILED,
                        payload: {
                            name: 'invalid id',
                            code: 'invalid id',
                        }
                    })
            })

    }
    catch (e) {
        dispatch({
            type: GET_PRODUCT_FAILED,
            payload: e.message
        })
    }
}


export const buyProduct = (userId, productId, number) => async (dispatch) => {
    dispatch({
        type: BUY_PRODUCT_LOADING
    })
    try {

        const db = firebase.firestore();
        var batch = db.batch();

        var userRef = db.collection('user').doc(userId);

        batch.update(userRef, {
            orders:
                firebase.firestore.FieldValue.arrayUnion({
                    product: productId,
                    noofItems: number
                })

        });

        batch.commit()
            .then(() => {

                dispatch({
                    type: BUY_PRODUCT
                })

                notifySeller(true, productId, userId, number);

            })
            .catch((e) => {
                dispatch({
                    type: BUY_PRODUCT_FAILED,
                    paylaod: e.message
                })
            })


    }
    catch (e) {
        dispatch({
            type: BUY_PRODUCT_FAILED,
            payload: e.message
        })
    }
}



export const cancelProduct = (userId, productId, orderId, number, reason, comments) => async (dispatch) => {
    dispatch({
        type: CANCEL_PRODUCT_LOADING
    })
    try {

        const db = firebase.firestore();
        var batch = db.batch();

        var userRef = db.collection('user').doc(userId);

        batch.update(userRef, {
            orders:
                firebase.firestore.FieldValue.arrayRemove({
                    product: productId,
                    noofItems: number
                })

        });

        batch.update(userRef, {
            orders:
                firebase.firestore.FieldValue.arrayUnion({
                    product: productId,
                    noofItems: number,
                    cancelled: true
                })

        });

        batch.commit()
            .then(() => {

                dispatch({
                    type: CANCEL_PRODUCT
                })

                notifySeller(false, productId, userId, number, orderId, reason, comments);

            })
            .catch((e) => {
                dispatch({
                    type: CANCEL_PRODUCT_FAILED,
                    paylaod: e.message
                })
            })


    }
    catch (e) {
        dispatch({
            type: CANCEL_PRODUCT_FAILED,
            payload: e.message
        })
    }
}



function notifySeller(bool, id, userId, number, orderId, reason, comments) {


    if (bool) {          //buy order
        const db = firebase.firestore();
        db.collection('products')
            .doc(id)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    db.collection('order').add({
                        placedAt: new Date().toDateString() + ' at ' + new Date().toLocaleTimeString(),
                        product: id,
                        user: userId,
                        seller: doc.data().seller,
                        status: 'placed',
                        deliveryDate: '',
                        message: '',
                        number: number,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                        .then(() => {
                            console.log('done');
                        })
                        .catch((e) => {
                            console.log(e.message)
                        })

                }
            })

    }
    else {             //cancel order
        const db = firebase.firestore();
        db.collection('order')
            .doc(orderId)
            .delete()
            .then(() => {

                db.collection('products')
                    .doc(id)
                    .get()
                    .then((doc) => {
                        if (doc.exists) {
                            db.collection('cancelOrder').add({
                                cancelledAt: new Date().toDateString() + ' at ' + new Date().toLocaleTimeString(),
                                product: id,
                                user: userId,
                                seller: doc.data().seller,
                                status: 'cancelled',
                                reason: reason,
                                comments: comments,
                                number: number,
                                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                            })
                                .then(() => {
                                    console.log('done');
                                })
                                .catch((e) => {
                                    console.log(e.message)
                                })
                        }
                    })

            })
    }
}




export const rateProduct = (userId, productId, rating, review) => async (dispatch) => {
    dispatch({
        type: RATE_PRODUCT_LOADING
    })
    try {

        const db = firebase.firestore();
        var batch = db.batch();

        var productRef = db.collection('products').doc(productId);

        batch.update(productRef, {
            reviews:
                firebase.firestore.FieldValue.arrayUnion({
                    rating: rating,
                    review: review,
                    user: userId
                })

        });

        var userRef = db.collection('user').doc(userId);

        batch.update(userRef, {
            reviews:
                firebase.firestore.FieldValue.arrayUnion({
                    rating: rating,
                    review: review,
                    product: productId
                })

        });

        batch.commit()
            .then(() => {

                dispatch({
                    type: RATE_PRODUCT
                })
            })
            .catch((e) => {
                dispatch({
                    type: RATE_PRODUCT_FAILED,
                    paylaod: e.message
                })
            })


    }
    catch (e) {
        dispatch({
            type: RATE_PRODUCT_FAILED,
            payload: e.message
        })
    }
}


export const editRateProduct = (userId, productId, prevRating, prevReview, rating, review) => async (dispatch) => {
    dispatch({
        type: RATE_PRODUCT_LOADING
    })
    try {

        const db = firebase.firestore();
        var batch = db.batch();

        var productRef = db.collection('products').doc(productId);


        batch.update(productRef, {
            reviews:
                firebase.firestore.FieldValue.arrayRemove({
                    rating: prevRating,
                    review: prevReview,
                    user: userId
                })

        });

        batch.update(productRef, {
            reviews:
                firebase.firestore.FieldValue.arrayUnion({
                    rating: rating,
                    review: review,
                    user: userId
                })

        });

        var userRef = db.collection('user').doc(userId);


        batch.update(userRef, {
            reviews:
                firebase.firestore.FieldValue.arrayRemove({
                    rating: prevRating,
                    review: prevReview,
                    product: productId
                })

        });

        batch.update(userRef, {
            reviews:
                firebase.firestore.FieldValue.arrayUnion({
                    rating: rating,
                    review: review,
                    product: productId
                })

        });

        batch.commit()
            .then(() => {

                dispatch({
                    type: RATE_PRODUCT
                })
            })
            .catch((e) => {
                dispatch({
                    type: RATE_PRODUCT_FAILED,
                    paylaod: e.message
                })
            })


    }
    catch (e) {
        dispatch({
            type: RATE_PRODUCT_FAILED,
            payload: e.message
        })
    }
}



export const deletRateProduct = (userId, productId, rating, review) => async (dispatch) => {
    dispatch({
        type: RATE_PRODUCT_LOADING
    })
    try {

        const db = firebase.firestore();
        var batch = db.batch();

        var productRef = db.collection('products').doc(productId);

        batch.update(productRef, {
            reviews:
                firebase.firestore.FieldValue.arrayRemove({
                    rating: rating,
                    review: review,
                    user: userId
                })

        });

        var userRef = db.collection('user').doc(userId);

        batch.update(userRef, {
            reviews:
                firebase.firestore.FieldValue.arrayRemove({
                    rating: rating,
                    review: review,
                    product: productId
                })

        });

        batch.commit()
            .then(() => {

                dispatch({
                    type: RATE_PRODUCT
                })
            })
            .catch((e) => {
                dispatch({
                    type: RATE_PRODUCT_FAILED,
                    paylaod: e.message
                })
            })


    }
    catch (e) {
        dispatch({
            type: RATE_PRODUCT_FAILED,
            payload: e.message
        })
    }
}