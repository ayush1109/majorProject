import {
    GET_KEYWORDS, GET_KEYWORDS_FAILED, GET_KEYWORDS_LOADING,
} from "../actions/types";

const initialState = { isLoading: true, data: [], err: {} };

export const keywords = (state = initialState, action) => {
    switch (action.type) {

        case GET_KEYWORDS_LOADING:
            return {
                ...state
            }

        case GET_KEYWORDS:
            return {
                ...state,
                isLoading: false,
                data: action.payload,
            };


        case GET_KEYWORDS_FAILED:
            return {
                data: [],
                isLoading: false,
                err: action.payload
            }

        default:
            return state;
    }
};
