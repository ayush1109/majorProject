import {
    ADD_USER, ADD_USER_FAILED, ADD_USER_LOADING,
    GET_USER, GET_USER_FAILED, GET_USER_LOADING,
    UPDATE_USER, UPDATE_USER_LOADING, UPDATE_USER_FAILED
} from "../actions/types";
import _ from "lodash";

const initialState = { isLogedIn: false, isLoading: true, user: {}, err: {} };

export const auth = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USER_LOADING:
        case GET_USER_LOADING:
        case UPDATE_USER_LOADING:
        case UPDATE_USER:
            return {
                ...state
            }
        case ADD_USER:
        case GET_USER:
            return {
                ...state,
                isLogedIn: !_.isEmpty(action.payload),
                user: { ...action.payload },
                isLoading: false
            };
        // case LOGOUT:
        //   return initialState;

        case ADD_USER_FAILED:
        case GET_USER_FAILED:
        case UPDATE_USER_FAILED:
            return {
                err: action.payload,
                isLogedIn: false,
                isLoading: false
            }


        // case AUTHENTICATE_USER:
        //   console.log("authenticate user reducer");
        //   return { isLogedIn: true, user: { ...action.payload } };

        default:
            return state;
    }
};
