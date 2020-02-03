import * as actionTypes from '../actions/ActionTypes';
// passing the parameter initial state and an action
export default function CountReducer(state = {count: 0, wish_value: 0}, action) {

    switch (action.type) {
        case actionTypes.INCREMENT:
            return {...state, count: state.count + 1};
        case actionTypes.UPDATE:
            return {...state, count: action.value, wish_value: action.value};
        default:
            return state;
    }
}
