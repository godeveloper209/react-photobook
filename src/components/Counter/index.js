import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionCreator from '../../store/actions';

// React component
class Counter extends Component {

    render() {
        const {count, wish_value, onIncreaseClick, onUpdateClick} = this.props;
        return (
            <div>
                <span>{count}</span>
                <button type='button' onClick={onIncreaseClick}>Increase</button>
                <input value={wish_value} type='text' onChange={(e) => onUpdateClick(e)}/>
            </div>
        )
    }
}


// Map Redux state to component props
function mapStateToProps(state) {
    return {
        count: state.CountReducer.count,
        wish_value: state.CountReducer.wish_value
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        onIncreaseClick: () => dispatch(actionCreator.increment()),
        onUpdateClick: event => dispatch(actionCreator.update(event.target.value))
    }
}

//Connected Component
const VisibleCounter = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter);

export default VisibleCounter;
