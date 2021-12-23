import React from 'react';
import { getUser } from '../redux/actions/userAction'
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    return (
        <div>
            Thank you with shopping with us!
            <Link to="/"><button>continue shopping</button></Link>
            <Link to="/myorders"><button>go to your orders</button></Link>
        </div>
    );
}

export default ThankYou;