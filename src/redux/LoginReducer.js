import { combineReducers } from 'redux';

const INITIAL_STATE = {
    user: "undefined"
};

const loginReducer = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'LOGGED_IN': 
            return {user : action.payload};

        case 'LOGGED_OUT':
            return {user : "undefined"};

        default:
            return {user : "undefined"};
    }
}

export default combineReducers({
    login: loginReducer
});