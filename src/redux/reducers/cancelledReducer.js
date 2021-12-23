import {
    GET_CANCEL_PRODUCTS, GET_CANCEL_PRODUCTS_FAILED, GET_CANCEL_PRODUCTS_LOADING,
} from "../actions/types";

const initialState = { isLoading: true, data: [], err: {} };

export const cancelled = (state = initialState, action) => {
    switch (action.type) {

        case GET_CANCEL_PRODUCTS_LOADING:
            return {
                ...state
            }

        case GET_CANCEL_PRODUCTS:
            return {
                ...state,
                isLoading: false,
                data: action.payload,
            };


        case GET_CANCEL_PRODUCTS_FAILED:
            return {
                data: [],
                isLoading: false,
                err: action.payload
            }

        default:
            return state;
    }
};
