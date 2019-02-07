import adapter from 'webrtc-adapter';
import AudioRecorder from './AudioRecorder';
import uuid from 'uuid/v3';
import * as types from '../actionTypes';

const AudioContext = window.AudioContext || window.webkitAudioContext;
// const alert = window.alert;

export { adapter, AudioContext };

export const finishBlock = (blockId) => ({
    type: types.FINISHED_BLOCK,
    blockId: blockId
});

const genPublicId = (id, namespace) => ({
            type: types.GOT_PUBLICID,
            publicId: uuid(id, namespace),
});

const gotAudioContext = (speakerOutput, data = {}) => ({
    type: types.GOT_AUDIO_CONTEXT,
    speakerOutput: speakerOutput
});

const recordingState = (recordingState) => ({
    type: types.RECORDING_STATE,
    recordingState: recordingState
});


const gotRecorder = (micInput, data = {}) =>
    (dispatch, getState) => {
        dispatch({
            type: types.GOT_RECORDER,
            recorder: new AudioRecorder(micInput)
        });
        dispatch(recordingState('inactive'));
    };

const gotMic = (micInput, data = {}) =>
    (dispatch, getState) => {
        dispatch({
            type: types.GOT_MIC,
            micInput: micInput
        });
        dispatch(gotRecorder(micInput));
        dispatch(genPublicId(getState().mturkData.workerId, getState().experimentalData.studyIdCode));
        dispatch(finishBlock('micSetup'));
    };

const micError = (data = {}) => ({
    type: types.MIC_ERROR
});

const constraints = {
    audio: {
        echoCancellation: false,
        googEchoCancellation: false,
        googAutoGainControl: false,
        googNoiseSuppression: false,
        googHighpassFilter: false,
        googTypingNoiseDetection: false
    },
    video: false
};

const getMic = () => (dispatch, getState) => {
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            dispatch(gotMic(stream));
        })
        .catch((err) => {
            dispatch(micError())
        });
};

export const setupMic = () => (dispatch, getState) => {
    dispatch(gotAudioContext(new AudioContext()));
    dispatch(getMic());
};

export const gotMicTest = (micTestFile) => ({
    type: types.MIC_TEST_FILE,
    micTestFile: micTestFile
});

export const stopRecording = () =>
    (dispatch, getState) => {
        getState().micData.recorder.stop();
};

export const uploadTestRecording = (blob, id, filename = 'test_recording.ogg') =>
    (dispatch, getState) => {
        dispatch(recordingState('uploading'));
        let formD = new FormData();
        formD.append('recording', blob, filename);
        fetch(
            `${process.env.PUBLIC_URL}/recording/${id}`,
            {method: 'post', body: formD}
        ).then(() => {
            dispatch(recordingState('inactive'));
            dispatch(gotMicTest(`${process.env.PUBLIC_URL}/recordings/${id}/${filename}`));
        });
    };

export const recordMicTest = (data = {}) =>
    (dispatch, getState) => {
        const state = getState();
        const micTestFile = `test_recording_${Date.now()}.` + (state.micData.recorder.recorderOptions.mimeType.startsWith('audio/webm') ? 'webm' : 'ogg');
        state.micData.recorder.record().then((blob) => {
            dispatch(uploadTestRecording(blob, state.micData.publicId, micTestFile));
        });
        dispatch(recordingState('recording'));
};

