import React from 'react';
import { connect } from 'react-redux';

import { recordMicTest, stopRecording, gotMicTest, finishBlock } from '../actions';

const MicCheck = ({blockId, micData, onFinished, startRecordingAction, stopRecordingAction, redoRecordingAction}) => {
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
                    <button type="button" onClick={onFinished(blockId)}
                        className="RecordingOk-button"
                    >
                        I can hear myself, let's continue
                    </button>
                    <button type="button" onClick={redoRecordingAction}
                        className="RecordingRedo-button"
                    >
                        I want to re-record
                    </button>
                </div>
            </div>
        )
    } else {
        return(
            <div className="MicCheck-box">
                <div className="Header">
                    <p>Let's test your microphone. This both checks to make sure it records, that you can hear how you sound, and that your recordings can be saved by our software.</p>
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
                            <p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"</p>
                        </div>
                    </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { ...state.blocksById['micCheck'],
        micData: state.micData
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: (blockId) => () => dispatch(finishBlock(blockId)),
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
