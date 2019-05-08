import React from 'react';
import { connect } from 'react-redux';

import { MediaRecorder, getUserMedia } from '../actions';

import { finishTask } from '../actions';

const Introduction = ({instructions, id, onFinished}) => {
    if(Audio === null || Audio === undefined || MediaRecorder === null || MediaRecorder === undefined || getUserMedia === null || getUserMedia === undefined){
        return(
            <div className="Introduction-box">
                <p>This experiment requires audio functionality that your browser does not support.</p>
                <p>If you wish to participate, please retry using an up-to-date version of the <a key='firefox' target="_blank" rel="noopener noreferrer" href="https://www.mozilla.org/en-US/firefox/">Firefox</a> or <a key='googleChrome' target="_blank" rel="noopener noreferrer" href="https://www.google.com/chrome/">Google Chrome</a> web browser.</p>
            </div>
        )
    }
    return(
        <div className="Introduction-box">
            {instructions}
            <button type='button' onClick={onFinished(id)}
                className="Instructions-button"
            >
                I understand these instructions
            </button>
        </div>
    )
};

const mapStateToProps = (state) => {
    return { ...state.experimentTasksById['introduction'] }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: id => { return () => { dispatch(finishTask(id)) } },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Introduction);
