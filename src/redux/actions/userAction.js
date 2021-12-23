import {
    ADD_USER, ADD_USER_FAILED, ADD_USER_LOADING,
    GET_USER, GET_USER_FAILED, GET_USER_LOADING,
    UPDATE_USER, UPDATE_USER_LOADING, UPDATE_USER_FAILED
} from "./types";

import firebase from 'firebase';
import { useHistory } from 'react-router-dom';

export const setUser = (id, phone) => async (dispatch) => {
    dispatch({
        type: ADD_USER_LOADING
    })
    try {

        console.log(id)

        var flag = 0;

        const db = firebase.firestore();

        const uid = window.localStorage.getItem('uid');
        if (uid != null) {
            flag = 1;
            console.log('in uid is present')
            getUser();
        }
        else {
            const snapshot = db.collection('user').get();

            (await snapshot).docs.map(doc => {
                if (doc.id == id) {
                    window.localStorage.setItem('uid', id);
                    flag = 1;
                    getUser();
                }
            })
        }
        if (flag === 0) {
            console.log('in new user')
            window.localStorage.setItem('uid', id);
            await db.collection('user').doc(id).set({
                phone: phone,
                cart: [],
                orders: [],
                wishlist: []
            }, { merge: true });

            dispatch({
                type: ADD_USER,
                payload: 'User has been added'
            })
            getUser();
        }
    }
    catch (e) {
        dispatch({
            type: ADD_USER_FAILED,
            payload: e.message
        })
    }
}

export const getUser = () => async (dispatch) => {
    dispatch({
        type: GET_USER_LOADING
    })
    try {
        const uid = window.localStorage.getItem('uid');
        const db = firebase.firestore();

        db.collection('user').doc(uid)
            .get()
            .then(async doc => {
                if (doc.exists) {
                    let newItem = {};

                    newItem.orders = [];
                    newItem.cart = [];
                    newItem.wishlist = [];
                    newItem.id = doc.id;
                    newItem.firstName = doc.data().firstName;
                    newItem.lastName = doc.data().lastName;
                    newItem.address = doc.data().address;
                    newItem.email = doc.data().email;
                    newItem.phone = doc.data().phone;
                    newItem.avatar = doc.data().avatar;
                    newItem.reviews = doc.data().reviews;


                    if (doc.data().orders.length > 0) {
                        await doc.data().orders.map(async (pro) => {
                            await db.collection('products').doc(pro.product).get().then(p => {
                                newItem.orders.push({ id: p.id, number: pro.noofItems, ...p.data() });
                            })
                        })
                    }
                    if (doc.data().cart.length > 0) {
                        await doc.data().cart.map(async (pro) => {
                            await db.collection('products').doc(pro.product).get().then(p => {
                                newItem.cart.push({ id: p.id, number: pro.noofItems, ...p.data() });
                            })
                        })
                    }
                    if (doc.data().wishlist.length > 0) {
                        await doc.data().wishlist.map(async (pro) => {
                            await db.collection('products').doc(pro).get().then(p => {
                                newItem.wishlist.push({ id: p.id, ...p.data() });
                                dispatch({
                                    type: GET_USER,
                                    payload: newItem
                                })
                            })
                        })
                    }
                    else {
                        console.log(newItem);
                        dispatch({
                            type: GET_USER,
                            payload: newItem
                        })
                    }

                }
                else
                    dispatch({
                        type: GET_USER_FAILED,
                        payload: 'No such document!'
                    })
            })
            .catch((error) => {
                dispatch({
                    type: GET_USER_FAILED,
                    payload: error.message
                })
            });
    }
    catch (e) {
        dispatch({
            type: GET_USER_FAILED,
            payload: e.message
        })
    }
}



export const logoutUser = () => async (dispatch) => {
    try {
        const history = useHistory();
        firebase.auth().signOut();
        window.localStorage.removeItem('uid');
        console.log(window.localStorage.getItem('uid'))
        history.push('/');
    }
    catch (e) {
        console.log(e)
    }
}



export const updateUser = (id, data, photo) => async (dispatch) => {
    dispatch({
        type: UPDATE_USER_LOADING
    })
    try {

        const db = firebase.firestore();

        if (photo != undefined) {

            var metadata = {
                contentType: 'image/jpeg'
            };

            var url;

            var storageRef = firebase.storage().ref();

            var uploadTask = storageRef.child('users/' + photo.name).put(photo, metadata);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        url = downloadURL;

                        const db = firebase.firestore();
                        var batch = db.batch();

                        var userRef = db.collection('user').doc(id);

                        batch.update(userRef, { avatar: url, ...data });

                        batch.commit()
                            .then(() => {

                                dispatch({
                                    type: UPDATE_USER
                                })
                                getUser();

                            })
                            .catch((e) => {
                                dispatch({
                                    type: UPDATE_USER_FAILED,
                                    paylaod: e.message
                                })
                            })

                    });
                }
            );
        }
        else {

            var doc = db.collection('user').doc(id);
            console.log(doc.id)

            var batch = db.batch();

            batch.update(doc, {
                ...data
            });

            batch.commit()
                .then(() => {
                    dispatch({
                        type: UPDATE_USER
                    })
                    getUser();
                })


        }
    }
    catch (e) {
        dispatch({
            type: UPDATE_USER_FAILED,
            payload: e.message
        })
    }
}


