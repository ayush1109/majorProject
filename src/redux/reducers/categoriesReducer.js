import { GET_CATEGORIES, GET_CATEGORIES_FAILED, GET_CATEGORIES_LOADING } from "../actions/types";
import _ from "lodash";

const initialState = { isLoading: true, data: [], err: {} };

export const categories = (state = initialState, action) => {
    switch (action.type) {

        case GET_CATEGORIES_LOADING:
            return {
                ...state
            }

        case GET_CATEGORIES:
            return {
                ...state,
                isLoading: false,
                data: [...action.payload]
            };


        case GET_CATEGORIES_FAILED:
            return {
                data: [],
                isLoading: false,
                err: action.payload
            }

        default:
            return state;
    }
};
