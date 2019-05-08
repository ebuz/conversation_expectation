import React from 'react';
import { connect } from 'react-redux';

import { recordMicTest, stopRecording, gotMicTest, finishTask } from '../actions';

const MicCheck = ({id, micData, onFinished, startRecordingAction, stopRecordingAction, redoRecordingAction}) => {
    if(micData.micTestFile){
        return(
            <div className="MicCheck-box">
                <div className="Header">
                    <audio src={micData.micTestFile} controls="controls" autoPlay="autoplay" />
                    <p style={{fontSize: 'small'}}>
                        If your recording doesn't start on its own, press play.
                    </p>
                    <p>Can't hear yourself? Check that the speakers are on and their volume is up. You can also try re-recording.</p>
                </div>
                <div className="Footer">
                    <button type="button" onClick={redoRecordingAction}
                        className="RecordingRedo-button"
                    >
                        I want to re-record
                    </button>
                    <button type="button" onClick={onFinished(id)}
                        className="RecordingOk-button"
                    >
                        I can hear myself, let's continue
                    </button>
                </div>
            </div>
        )
    } else {
        return(
            <div className="MicCheck-box">
                <div className="Header">
                    <p>Let's test your microphone. We need to make sure the webpage can successfully record you and that you can hear sound.</p>
                    <p>Press the button below to start recording and read the passage that appears below.
                    </p>
                </div>
                <div className="Footer">
                    <button disabled={micData.recordingState === 'uploading'}
                        type="button"
                        onClick={micData.recordingState === 'inactive' ? startRecordingAction : stopRecordingAction}
                        className={micData.recordingState === 'inactive' ? 'GreenButton CenterButton' : 'RedButton CenterButton'}
                    >
                            {micData.recordingState === 'inactive' ? 'Start recording a message' : 'Stop recording'}
                    </button>
                    <div className="MicCheckPassage-box"
                        style={{visibility: micData.recordingState === 'inactive' ? 'hidden' : 'visible'}}
                    >
                            <br />
                            <p style={{color:'blue'}}>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"</p>
                        </div>
                    </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { ...state.experimentTasksById['micCheck'],
        micData: state.micData
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: id => { return () => { dispatch(finishTask(id)) } },
        startRecordingAction: () => {
            dispatch(recordMicTest());
        },
        stopRecordingAction: () => {
            dispatch(stopRecording());
        },
        redoRecordingAction: () => {
            dispatch(gotMicTest(null));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MicCheck);
