import {
    GET_ORDERS, GET_ORDERS_FAILED, GET_ORDERS_LOADING,
    GET_ORDER, GET_ORDER_FAILED, GET_ORDER_LOADING
} from "../actions/types";

const initialState = { isLoading: true, data: [], err: {} };

export const orders = (state = initialState, action) => {
    switch (action.type) {

        case GET_ORDERS_LOADING:
            return {
                ...state
            }

        case GET_ORDERS:
            return {
                ...state,
                isLoading: false,
                data: action.payload,
            };


        case GET_ORDERS_FAILED:
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

export const order = (state = initialState2, action) => {
    switch (action.type) {

        case GET_ORDER_LOADING:
            return {
                ...state
            }

        case GET_ORDER:
            return {
                ...state,
                isLoading: false,
                data: action.payload,
            };


        case GET_ORDER_FAILED:
            return {
                data: {},
                isLoading: false,
                err: action.payload
            }

        default:
            return state;
    }
};
