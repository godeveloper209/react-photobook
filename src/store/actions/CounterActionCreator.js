import * as actionTypes from './ActionTypes';
// action creators

export const increment = () => {
    return {
        type: actionTypes.INCREMENT
    }
};

// synchronous action creators
export const updateResult = (value) => {
    return {
        type: actionTypes.UPDATE,
        value
    }
};


// async action creators
export const update = (value) => {
    // here we are getting dispatch only because we have set up redux thunk middleware
    // here we can pass another parameter getState from which we can retrieve the state
    return (dispatch, getState) => {
        setTimeout(() => {
            // what we typically do is we create asynchronous action creators which should be eventually dispatch to an synchronous action creators
            // here asynchronous action creators update is dispatched to the synchronous action creators updateResult
            console.log(getState().CountReducer.wish_value);
            dispatch(updateResult(value))
        }, 2000)
    }
};
