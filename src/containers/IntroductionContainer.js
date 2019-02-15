import React from 'react';
import { connect } from 'react-redux';

import { MediaRecorder, getUserMedia } from '../actions';

import { finishBlock } from '../actions';

const Introduction = ({instructions, onFinished, blockId}) => {
    if(Audio === null || Audio === undefined || MediaRecorder === null || MediaRecorder === undefined || getUserMedia === null || getUserMedia === undefined){
        return(
            <div className="Introduction-box">
                <p>This experiment requires audio functionality that your browser does not support.</p>
                <p>If you wish to participate, please retry using an up-to-date version of the <a key='googleChrome' target="_blank" rel="noopener noreferrer" href="https://www.mozilla.org/en-US/firefox/">Firefox</a> or <a key='googleChrome' target="_blank" rel="noopener noreferrer" href="https://www.google.com/chrome/">Google Chrome</a> web browser.</p>
            </div>
        )
    }
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
