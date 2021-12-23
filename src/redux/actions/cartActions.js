import {
    CART_PRODUCT, CART_PRODUCT_FAILED, CART_PRODUCT_LOADING,
    REMOVE_CART_PRODUCT_FAILED, REMOVE_CART_PRODUCT_LOADING,
    GET_CART, GET_CART_FAILED, GET_CART_LOADING,

} from "./types";

import firebase from 'firebase';


export const getCart = () => async (dispatch) => {
    dispatch({
        type: GET_CART_LOADING
    })
    try {
        const userId = localStorage.getItem('uid');
        const db = firebase.firestore();
        db.collection('user')
            .onSnapshot(async (querySnapshot) => {
                const cartArray = [];
                querySnapshot.forEach(async (doc) => {
                    if (doc.id === userId) {
                        if (doc.data().cart.length > 0) {
                            await doc.data().cart.forEach(async (cart) => {
                                await db.collection('products').doc(cart.product).get().then((d) => {
                                    if (d.exists) {
                                        cartArray.push({ number: cart.noofItems, ...d.data(), id: d.id, user: userId });

                                    }
                                })
                                dispatch({
                                    type: GET_CART,
                                    payload: cartArray
                                })
                            })

                        }
                        else {
                            dispatch({
                                type: GET_CART,
                                payload: cartArray
                            })
                        }
                    }
                }, (error) => {
                    dispatch({
                        type: GET_CART_FAILED,
                        payload: error
                    })
                })

            })


    }
    catch (e) {
        dispatch({
            type: GET_CART_FAILED,
            payload: e.message
        })
    }
}


export const cartProduct = (userId, productId) => async (dispatch) => {
    dispatch({
        type: CART_PRODUCT_LOADING
    })
    try {

        const db = firebase.firestore();
        var batch = db.batch();

        var userRef = db.collection('user').doc(userId);

        batch.update(userRef, {
            cart:
                firebase.firestore.FieldValue.arrayUnion({
                    product: productId,
                    noofItems: 1
                })
        });

        batch.commit()
            .then(() => {

                dispatch({
                    type: CART_PRODUCT
                })

            })
            .catch((e) => {
                dispatch({
                    type: CART_PRODUCT_FAILED,
                    paylaod: e.message
                })
            })


    }
    catch (e) {
        dispatch({
            type: CART_PRODUCT_FAILED,
            payload: e.message
        })
    }
}



export const removeCartProduct = (userId, productId, number) => async (dispatch) => {
    dispatch({
        type: REMOVE_CART_PRODUCT_LOADING
    })
    try {

        const db = firebase.firestore();
        var batch = db.batch();

        var userRef = db.collection('user').doc(userId)

        batch.update(userRef, {
            cart:
                firebase.firestore.FieldValue.arrayRemove({
                    product: productId,
                    noofItems: number
                })
        });

        batch.commit()
            .then(() => {
                console.log('done')

            })
            .catch((e) => {
                console.log(e.message)
                dispatch({
                    type: REMOVE_CART_PRODUCT_FAILED,
                    paylaod: e.message
                })
            })


    }
    catch (e) {
        dispatch({
            type: REMOVE_CART_PRODUCT_FAILED,
            payload: e.message
        })
    }
}


export const updateCart = (userId, productId, number, prevNumber) => async (dispatch) => {

    try {

        console.log(prevNumber, number);

        const db = firebase.firestore();

        var userRef = db.collection('user').doc(userId);

        await userRef.update({
            cart:
                firebase.firestore.FieldValue.arrayRemove({
                    product: productId,
                    noofItems: prevNumber
                })
        });


        await userRef.update({
            cart:
                firebase.firestore.FieldValue.arrayUnion({
                    product: productId,
                    noofItems: number
                })
        });


    }
    catch (e) {
        console.log(e.message)
    }

}


