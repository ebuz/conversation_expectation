import React from 'react';
import { connect } from 'react-redux';

import { finishBlock } from '../actions';

const WaitingRoom = ({instructions, blockId, onFinished}) => {
    let message = <div className="MicSetup-message"><p>{instructions}</p></div>
    return(
        <div className="WaitingRoom-box">
            {message}
            <button type='button' onClick={onFinished}
                className="MicSetup-button"
            >
                    Ready to talk
            </button>
        </div>
    )
};

const mapStateToProps = (state) => {
    return { ...state.blocksById['waitingRoom'] }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: (blockId) => () => dispatch(finishBlock(blockId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WaitingRoom);
