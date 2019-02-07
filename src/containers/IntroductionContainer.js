import React from 'react';
import { connect } from 'react-redux';

import { finishBlock } from '../actions';

const Introduction = ({instructions, onFinished, blockId}) => {
    return(
        <div className="Introduction-box">
            <p>{instructions}</p>
            <button type='button' onClick={onFinished(blockId)}
                className="Instructions-button"
            >
                I understand these instructions
            </button>
        </div>
    )
};

const mapStateToProps = (state) => {
    return { ...state.blocksById['introduction'] }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: blockId => { return () => { dispatch(finishBlock(blockId)) } },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Introduction);
