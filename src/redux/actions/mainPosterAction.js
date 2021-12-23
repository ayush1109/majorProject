import { GET_MAIN_POSTER, GET_MAIN_POSTER_LOADING, GET_MAIN_POSTER_FAILED } from "./types";

import firebase from 'firebase';

export const getMainPoster = () => async (dispatch) => {
    dispatch({
        type: GET_MAIN_POSTER_LOADING
    })
    try {

        const db = firebase.firestore();

        const docRef = db.collection('main-poster').doc('s1v4rTpV8W32MxrDEwcu');

        const poster = await docRef.get();

        if (poster.exists) {
            dispatch({
                type: GET_MAIN_POSTER,
                payload: poster.data()
            })
        }

        else {
            dispatch({
                type: GET_MAIN_POSTER_FAILED,
                payload: 'https://picsum.photos/800/1000'
            })
        }
    }
    catch (e) {
        dispatch({
            type: GET_MAIN_POSTER_FAILED,
            payload: e
        })
    }
}


