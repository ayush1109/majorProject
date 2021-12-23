import { GET_CATEGORIES, GET_CATEGORIES_FAILED, GET_CATEGORIES_LOADING } from "./types";

import firebase from 'firebase';

export const getCategories = () => async (dispatch) => {
    dispatch({
        type: GET_CATEGORIES_LOADING
    })
    try {

        const db = firebase.firestore();

        const docRef = db.collection('categories').doc('25IMibEqLXA7qGlizwYp');

        const categories = await docRef.get();

        if (categories.exists) {
            dispatch({
                type: GET_CATEGORIES,
                payload: categories.data().names
            })
        }

        else {
            dispatch({
                type: GET_CATEGORIES_FAILED,
                payload: 'could not load data'
            })
        }
    }
    catch (e) {
        dispatch({
            type: GET_CATEGORIES_FAILED,
            payload: e
        })
    }
}


