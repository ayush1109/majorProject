import { combineReducers } from "redux";
import { auth } from "./userReducer";
import { mainPoster } from './mainPosterReducer';
import { categories } from './categoriesReducer';
import { products } from './productsReducer';
import { product } from './productsReducer';
import { cart } from './cartReducer';
import { orders } from './orderReducer';
import { order } from './orderReducer';
import { cancelled } from './cancelledReducer';
import { keywords } from './keywordsReducer';


export default combineReducers({
    auth,
    mainPoster,
    categories,
    products,
    product,
    cart,
    orders,
    order,
    cancelled,
    keywords
});
