import React from 'react';
import { connect } from 'react-redux';
import Loader from '../loader/Loading';
import { getCategories } from '../../redux/actions/categoriesAction'
import _ from 'lodash';
import { Link } from 'react-router-dom';
const RenderList = ({ isLoading, list, err }) => {
    if (isLoading) {
        return (
            <Loader />
        );
    }
    else if (!_.isEmpty(err)) {
        return (
            <div>Error : {err.name}<br></br>
                Message : {err.code}</div>
        );
    }
    else {
        return (
            <div className="categories-div">
                <ul className="categories-list">
                    {list.length > 0 ? list.map((heading) => (
                        <Link to={{
                            pathname: "/categoryWise",
                            search: heading
                        }}><li key={heading}>{heading} </li></Link>
                    )) : <div>Error in fetching categories</div>}
                </ul>
            </div>
        )
    }
}


const Categories = (props) => {

    React.useEffect(() => {
        props.getCategories();
    }, []);



    return (
        <>
            <div className='App'>
                <RenderList isLoading={props.categories.isLoading}
                    list={props.categories.data}
                    err={props.categories.err}
                />
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return { categories: state.categories };
};

export default connect(mapStateToProps, {
    getCategories
})(Categories);