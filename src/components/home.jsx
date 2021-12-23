import React from 'react';
import { connect } from 'react-redux';
import { getMainPoster } from '../redux/actions/mainPosterAction'
import Loader from './loader/Loading';
import Carousel from 'react-material-ui-carousel';
import Categories from './categories/Categories';
import NewArrivals from './NewArrivals';
import GreatDeals from './GreatDeals';

const MainPoster = ({ isLoading, url }) => {
    if (isLoading) {
        return (
            <>
                <h1>Loading Posters...</h1>
                <Loader />
            </>
        );
    }
    else if (Array.isArray(url.url)) {
        return (
            <Carousel
                next={(next, active) => console.log(`we left ${active}, and are now at ${next}`)}
                prev={(prev, active) => console.log(`we left ${active}, and are now at ${prev}`)}>
                {
                    url.url.map((item, i) => <img key={i} src={item} className='main-poster' />)
                }
            </Carousel>
        )
    }
    else {
        return (
            <div>Error : {url.name} <hr></hr>
                Message : {url.code}</div>
        );
    }
}


const Home = (props) => {

    React.useEffect(() => {
        props.getMainPoster();
    }, []);


    return (
        <>
            <div className='App'>
                <Categories />
                <MainPoster isLoading={props.mainPoster.isLoading}
                    url={props.mainPoster.url} />
            </div>
            <NewArrivals />
            <GreatDeals />
        </>
    );
}

const mapStateToProps = (state) => {
    return { mainPoster: state.mainPoster };
};

export default connect(mapStateToProps, {
    getMainPoster
})(Home);