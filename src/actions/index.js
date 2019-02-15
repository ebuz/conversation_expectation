import AudioRecorder from './AudioRecorder';
import uuid from 'uuid/v3';
import * as types from '../actionTypes';

import { actions as rpcActions } from '@ebuz/redux-peer-connection';

export { MediaRecorder, getUserMedia } from './AudioRecorder';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export const continueNotificationTimer = () => (dispatch, getState) => {
};

let dialogueTimer = {
    totalTimer: null,
    tickTimer: null,
    time: 0
};

export const endDialogue = () => ({
    type: types.END_DIALOGUE,
});

export const dialogueStartTime = (time) => ({
    type: types.DIALOGUE_START_TIME,
    time
});

export const dialogueTime = (time) => ({
    type: types.DIALOGUE_TIME,
    time
});

const destroyPeer = () => {
    return rpcActions.destroyPeer();
};


export const startDialogueRecorderTimer = () => (dispatch, getState) => {
    dispatch(dialogueStartTime(Date.now()));
    dispatch(recordDialogue());
    dialogueTimer.totalTimer = setTimeout(() => {
        clearTimeout(dialogueTimer.tickTimer);
        dispatch(stopRecording());
        dispatch(endDialogue());
        dispatch(finishBlock('dialogue'));
        dispatch(destroyPeer());
    }, getState().experimentalData.dialogueTimeLimit);
    dialogueTimer.tickTimer = setInterval(() => {
        dispatch(dialogueTime(Date.now() - getState().experimentalData.dialogueStatus.dialogueStartTime));
    }, 1000);
};

let notificationTimer = null;
let notificationSound = null;

export const startNotificationTimer = (waitTime = 30000) => {
    notificationTimer = setTimeout(() => {
        notificationSound = new Audio(`${process.env.PUBLIC_URL}/notification.wav`)
        notificationSound.loop = true;
        notificationSound.play();
    }, waitTime);
};

export const endNotificationTimer = () => {
    clearTimeout(notificationTimer);
    if(notificationSound !== null){
        notificationSound.pause();
        notificationSound = null;
    }
};

export const initiatePeer = (initiator, stream) => {
    return rpcActions.createPeer({
        initiator: initiator,
        channelName: 'test',
        stream: stream
    });
};

export const candidatePeerId = (id) => ({
        type: types.CANDIDATE_PEERID,
        candidatePeerId: id
});

export const sendSignal = (signal, peerId) => ({
    type: types.WEBSOCKET_SEND,
    payload: {
        type: types.relaySignalToPeer,
        receivingPeer: peerId,
        signal: signal
    }
});

export const mapToJSON = (map) => {
    if(map instanceof Map) return JSON.stringify([...map]);
    return null;
}

export const sharePreDialogueSurvey = (answers) => {
    return rpcActions.sendData(JSON.stringify({
        type: types.PARTNER_PREDIALOGUE_SURVEY,
        answers: mapToJSON(answers)
    }));
};

export const acceptSignal = (signal) => { return rpcActions.acceptSignal(signal); };

export const askServerForPeer = () => (dispatch, getState) => {
    dispatch({
        type: types.WEBSOCKET_SEND,
        payload: {
            type: types.setSelfId,
            selfId: getState().switchboardData.selfId
        }
    });
    dispatch({
        type: types.WEBSOCKET_SEND,
        payload: {
            type: types.requestPeer,
            peeringConstraints: getState().switchboardData.peeringConstraints
        }
    });
};

export const notifyServerPeering = (selfId, peerId) => ({
    type: types.WEBSOCKET_SEND,
    payload: {
        type: types.peerFound,
        selfId,
        peerId
    }
});

export const notifyPartnerReady = () => {
    return rpcActions.sendData(JSON.stringify({
        type: types.PARTNER_READY_FOR_DIALOGUE,
    }));
};


export const readyToDialogue = () => ({
    type: types.READY_FOR_DIALOGUE,
});

export const askToStartDialogue = () => ({
    type: types.WEBSOCKET_SEND,
    payload: {
        type: types.initiateDialogue
    }
});

export const updateQuestionValue = (dataField, questionId, value) => ({
    type: types.QUESTION_ANSWER,
    dataField: dataField,
    questionId: questionId,
    value: value
});

export const recallData = (recallData) => ({
    type: types.RECALL_DATA,
    recallData,
});

export const completePreDialogueSurvey = () => ({
    type: types.COMPLETE_PREDIALOGUE_SURVEY
});

export const finishBlock = (blockId) => ({
    type: types.FINISHED_BLOCK,
    blockId: blockId
});

const genSelfId = (id, namespace) => ({
            type: types.SELFID,
            selfId: uuid(id, namespace),
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
        dispatch(genSelfId(getState().mturkData.workerId, getState().experimentalData.studyIdCode));
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

const connectToSwitchboard = () => (dispatch, getState) => {
    dispatch({
        type: types.WEBSOCKET_CONNECT,
        payload: {
            url: 'wss://switchboard.esteban.bz/' + getState().experimentalData.studyIdCode
        }
    })
};

export const setupMic = () => (dispatch, getState) => {
    dispatch(gotAudioContext(new AudioContext()));
    dispatch(getMic());
    dispatch(connectToSwitchboard());
};

export const gotMicTest = (micTestFile) => ({
    type: types.MIC_TEST_FILE,
    micTestFile: micTestFile
});

const dialogueFileName = (dialogueFileName) => ({
    type: types.DIALOGUE_FILE_NAME,
    dialogueFileName
});

export const stopRecording = () =>
    (dispatch, getState) => {
        getState().micData.recorder.stop();
};

const uploadRecording = (blob, id, filename, postAction) =>
    (dispatch, getState) => {
        dispatch(recordingState('uploading'));
        let formD = new FormData();
        formD.append('recording', blob, filename);
        fetch(
            `${process.env.PUBLIC_URL}/recording/${id}`,
            {method: 'post', body: formD}
        ).then(() => {
            dispatch(recordingState('inactive'));
            if(postAction){
                dispatch(postAction);
            }
        });
    };

const recordDialogue = () =>
    (dispatch, getState) => {
        const state = getState();
        const fileName = `dialogue_recording_${Date.now()}.` + (state.micData.recorder.recorderOptions.mimeType.startsWith('audio/webm') ? 'webm' : 'ogg');
        state.micData.recorder.record().then((blob) => {
            dispatch(uploadRecording(blob, state.switchboardData.selfId, fileName, dialogueFileName(fileName)));
        });
        dispatch(recordingState('recording'));
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
            dispatch(uploadTestRecording(blob, state.switchboardData.selfId, micTestFile));
        });
        dispatch(recordingState('recording'));
};

export const skipToBlock = (blockId) =>
    (dispatch, getState) => {
        switch(blockId){
            case 'submission':
            case 'debrief':
                dispatch(finishBlock('recall'));
                dispatch(finishBlock('dialogue'));
                dispatch(finishBlock('preDialogue'));
                dispatch(finishBlock('micCheck'));
                dispatch(finishBlock('micSetup'));
                dispatch(finishBlock('consent'));
                dispatch(finishBlock('introduction'));
                break;
            case 'recall':
                dispatch(finishBlock('dialogue'));
                dispatch(finishBlock('preDialogue'));
                dispatch(finishBlock('micCheck'));
                dispatch(finishBlock('micSetup'));
                dispatch(finishBlock('consent'));
                dispatch(finishBlock('introduction'));
                break;
            //it's not really possible to skip to the dialogue given the requirements needed for it to work
            // case 'dialogue':
            case 'preDialogue':
                dispatch(finishBlock('micCheck'));
                dispatch(setupMic());
                dispatch(finishBlock('consent'));
                dispatch(finishBlock('introduction'));
                break;
            case 'micCheck':
                dispatch(setupMic());
                dispatch(finishBlock('consent'));
                dispatch(finishBlock('introduction'));
                break;
            case 'micSetup':
                dispatch(finishBlock('consent'));
                dispatch(finishBlock('introduction'));
                break;
            case 'consent':
                dispatch(finishBlock('introduction'));
                break;
            default:
        }
};

