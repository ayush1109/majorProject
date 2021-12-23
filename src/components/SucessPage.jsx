import { Button } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
const Success = (props) => {
    console.log(props);
    return (
        <>
            <div>You have successfully logged in!</div>
        </>

    );
}


const mapStateToProps = (state) => {
    return { user: state.auth.user };
};

export default connect(mapStateToProps, {})(Success);