import {
    GET_PRODUCTS, GET_PRODUCTS_FAILED, GET_PRODUCTS_LOADING,
    GET_PRODUCT, GET_PRODUCT_FAILED, GET_PRODUCT_LOADING
} from "../actions/types";

const initialState = { isLoading: true, data: [], err: {} };

export const products = (state = initialState, action) => {
    switch (action.type) {

        case GET_PRODUCTS_LOADING:
            return {
                ...state
            }

        case GET_PRODUCTS:
            console.log(action)
            return {
                ...state,
                isLoading: false,
                data: action.payload
            };


        case GET_PRODUCTS_FAILED:
            return {
                data: [],
                isLoading: false,
                err: action.payload
            }

        default:
            return state;
    }
};



const initialState2 = { isLoading: true, data: {}, err: {} };


export const product = (state = initialState2, action) => {
    switch (action.type) {
        case GET_PRODUCT_LOADING:
            return { ...state }

        case GET_PRODUCT:
            return {
                ...state,
                isLoading: false,
                data: { ...action.payload }
            }

        case GET_PRODUCT_FAILED:
            return {
                err: action.payload,
                isLoading: false
            }
        default:
            return state;
    }
}
