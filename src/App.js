import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from './components/login';
import Success from './components/SucessPage';
import firebase from "firebase";
import firebaseConfig from './config/firebase';
import Home from './components/home';
import PrimarySearchAppBar from './components/navbar/Navbar';
import CategoryWise from './components/categories/CategoryWise';
import ProductDetail from './components/ProductDetail';
import Profile from './components/Profile';
import ThankYou from './components/ThankYou';
import MyOrders from './components/MyOrders';
import MyCart from './components/MyCart';
import orderDetail from './components/orderDetail';
import SearchProducts from './components/SearchProducts';
import NewArrivalsDetail from './components/NewArrivalsDetail';
import GreatDealDetails from './components/GreatDealDetails';
class App extends Component {
  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
  }
  render() {
    return (
      <BrowserRouter>
        <PrimarySearchAppBar />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/success" component={Success} />
          <Route exact path="/" component={Home} />
          <Route exact path="/categoryWise" component={CategoryWise} />
          <Route exact path="/searchProducts" component={SearchProducts} />
          <Route exact path="/productDetail/:id" component={ProductDetail} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/myorders" component={MyOrders} />
          <Route exact path="/newArrivals" component={NewArrivalsDetail} />
          <Route exact path="/greatDeals" component={GreatDealDetails} />
          <Route exact path="/orderDetail/:id" component={orderDetail} />
          <Route exact path="/myCart" component={MyCart} />
          <Route exact path="/thankYou" component={ThankYou} />
          <Route path="*" exact={true} render={() => {
            <div>No match</div>
          }}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;