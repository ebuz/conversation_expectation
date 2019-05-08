import React from 'react';
import { connect } from 'react-redux';

import { setupMic } from '../actions';

const MicSetup = ({instructions, id, micData, tryMicSetup}) => {
    let message = <div className="MicSetup-message"><p>{instructions}</p></div>
    if(micData.micInput === false){
        message = <div className="MicSetup-message">
            <p>There was a problem with starting your microphone.</p>
            <p>This could be due to your web browser being out of date or it malfunctioning. Refreshing the page may help. If it does not, retry using an up-to-date version of the <a key='firefox' target="_blank" rel="noopener noreferrer" href="https://www.mozilla.org/en-US/firefox/">Firefox</a> or the <a key='googleChrome' target="_blank" rel="noopener noreferrer" href="https://www.google.com/chrome/">Google Chrome</a> web browser.</p>
            <br />
            <p>This message will also appear if you, or a browser plugin, denied this webpage access to your microphone. If this was in error, you can refresh the page and allow access. You cannot participate unless you provide access to the microphone.</p>
        </div>
    }
    return(
        <div className="MicSetup-box">
            {message}
            <button type='button' onClick={micData.micInput === false ? () => {window.location.reload(true);}: tryMicSetup}
                className="MicSetup-button"
            >
                    {micData.micInput === false ? 'Click to reload page' : 'Click here to activate microphone'}
            </button>
        </div>
    )
};

const mapStateToProps = (state) => {
    return { ...state.experimentTasksById['micSetup'],
        micData: state.micData
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        tryMicSetup: () => {
            dispatch(setupMic());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MicSetup);
