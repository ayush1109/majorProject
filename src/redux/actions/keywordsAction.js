import { GET_KEYWORDS, GET_KEYWORDS_LOADING, GET_KEYWORDS_FAILED } from "./types";

import firebase from 'firebase';

export const getKeywords = () => async (dispatch) => {
    dispatch({
        type: GET_KEYWORDS_LOADING
    })
    try {

        const db = firebase.firestore();

        const docRef = db.collection('AutoSuggest').doc('YqySEpTRmQa1GoIWzClN');

        const keywords = await docRef.get();

        if (keywords.exists) {
            dispatch({
                type: GET_KEYWORDS,
                payload: keywords.data().keywords
            })
        }

        else {
            dispatch({
                type: GET_KEYWORDS_FAILED,
                payload: []
            })
        }
    }
    catch (e) {
        dispatch({
            type: GET_KEYWORDS_FAILED,
            payload: e.message
        })
    }
}



export const addKeywords = (keyword) => async (dispatch) => {

    try {

        const db = firebase.firestore();

        const docRef = db.collection('AutoSuggest').doc('YqySEpTRmQa1GoIWzClN');

        await docRef.set({
            keywords: [keyword]
        }, { merge: true });

    }
    catch (e) {
        console.log(e.message)
    }
}


