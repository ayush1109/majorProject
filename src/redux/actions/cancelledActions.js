import {
    GET_CANCEL_PRODUCTS, GET_CANCEL_PRODUCTS_FAILED, GET_CANCEL_PRODUCTS_LOADING,
} from "./types";

import firebase from 'firebase';


export const getCancelled = () => async (dispatch) => {
    const cancelledArray = [];
    dispatch({
        type: GET_CANCEL_PRODUCTS_LOADING
    })
    try {
        const user = localStorage.getItem('uid');
        const db = firebase.firestore();

        await db.collection("cancelOrder")
            .orderBy('updatedAt')
            .get().then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    if (user === doc.data().user) {
                        await db.collection('products').doc(doc.data().product).get().then(pro => {
                            cancelledArray.push({ id: pro.id, ...doc.data(), ...pro.data(), docId: doc.id })

                        })
                    }
                    dispatch({
                        type: GET_CANCEL_PRODUCTS,
                        payload: cancelledArray
                    })
                });
            });



    }
    catch (e) {
        dispatch({
            type: GET_CANCEL_PRODUCTS_FAILED,
            payload: e.message
        })
    }
}



