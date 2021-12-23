import {
    GET_ORDERS, GET_ORDERS_FAILED, GET_ORDERS_LOADING,
    GET_ORDER, GET_ORDER_FAILED, GET_ORDER_LOADING,
} from "./types";

import firebase from 'firebase';


export const getOrders = () => async (dispatch) => {
    const orderArray = [];
    dispatch({
        type: GET_ORDERS_LOADING
    })
    try {
        const user = localStorage.getItem('uid');
        const db = firebase.firestore();

        await db.collection("order")
            .orderBy('updatedAt')
            .get().then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    if (user === doc.data().user) {
                        await db.collection('products').doc(doc.data().product).get().then(pro => {
                            orderArray.push({ id: pro.id, ...doc.data(), ...pro.data(), docId: doc.id })

                        })
                    }
                    dispatch({
                        type: GET_ORDERS,
                        payload: orderArray
                    })
                });
            });



    }
    catch (e) {
        dispatch({
            type: GET_ORDERS_FAILED,
            payload: e.message
        })
    }
}



export const getAOrder = (id) => async (dispatch) => {

    dispatch({
        type: GET_ORDER_LOADING
    })
    try {
        const db = firebase.firestore();

        db.collection('order')
            .doc(id)
            .onSnapshot((doc) => {
                if (doc.data() !== undefined)
                    db.collection('products').doc(doc.data().product).get().then(product => {
                        if (product.exists)
                            dispatch({
                                type: GET_ORDER,
                                payload: { ...doc.data(), ...product.data() }
                            })
                    })
            })



    }
    catch (e) {
        dispatch({
            type: GET_ORDER_FAILED,
            payload: e.message
        })
    }
}