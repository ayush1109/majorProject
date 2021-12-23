import React, { Component } from 'react';
import firebaseConfig from '../config/firebase';
import * as firebaseui from "firebaseui";
import firebase from "firebase";
import { setUser } from '../redux/actions/userAction'
import { connect } from 'react-redux';

const Login = (props) => {

    React.useEffect(() => {
        const uiConfig = {

            signInSuccessUrl: "http://localhost:3001/", //This URL is used to return to that page when we got success response for phone authentication.
            signInOptions: [
                {
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    defaultCountry: 'IN',
                    defaultNationalNumber: '2222222222',
                }

            ],
            tosUrl: "http://localhost:3001/"
        };
        var currentUid = null;
        firebase.auth().onAuthStateChanged(user => {
            if (user && user.uid != currentUid) {
                // Update the UI when a new user signs in.  
                // Otherwise ignore if this is a token refresh.  
                // Update the current user UID.  
                currentUid = user.uid;
                props.setUser(currentUid, user.phoneNumber);
            } else {
                // Sign out operation. Reset the current user UID.  
                currentUid = null;
                console.log("no user signed in");
            }
        })



        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start("#firebaseui-auth-container", uiConfig);

    }, []);

    React.useEffect(() => {
        console.log(props.user);
    }, [props.user]);

    return (
        <>
            <h1>REACT PHONE AUTHENTICATION</h1>
            <div id="firebaseui-auth-container"></div>
        </>
    );
}

const mapStateToProps = (state) => {
    return { user: state.auth.user };
};


export default connect(mapStateToProps, { setUser })(Login);