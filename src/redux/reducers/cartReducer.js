import {
    GET_CART, GET_CART_FAILED, GET_CART_LOADING,
    CART_PRODUCT, CART_PRODUCT_FAILED, CART_PRODUCT_LOADING
} from "../actions/types";

const initialState = { isLoading: true, data: [], err: {} };

export const cart = (state = initialState, action) => {
    switch (action.type) {

        case GET_CART_LOADING:
            return {
                ...state
            }

        case GET_CART:
            return {
                ...state,
                isLoading: false,
                data: action.payload,
            };


        case GET_CART_FAILED:
            return {
                data: [],
                isLoading: false,
                err: action.payload
            }

        default:
            return state;
    }
};
