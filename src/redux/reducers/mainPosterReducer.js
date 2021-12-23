import { GET_MAIN_POSTER, GET_MAIN_POSTER_LOADING, GET_MAIN_POSTER_FAILED } from "../actions/types";
import _ from "lodash";

const initialState = { isLoading: true, url: {} };

export const mainPoster = (state = initialState, action) => {
    switch (action.type) {

        case GET_MAIN_POSTER_LOADING:
            return {
                ...state
            }

        case GET_MAIN_POSTER:
            return {
                ...state,
                isLoading: false,
                url: { ...action.payload }
            };


        case GET_MAIN_POSTER_FAILED:
            return {
                url: { ...action.payload },
                isLoading: false
            }

        default:
            return state;
    }
};
