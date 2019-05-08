import AudioRecorder from './AudioRecorder';
import uuid from 'uuid/v3';
import * as types from '../actionTypes';
import { actions as rpcActions } from '@ebuz/redux-peer-connection';

import { connectToSwitchboard, destroyPeer } from './switchboardPeering';

export { connectToSwitchboard, requestPeer, candidatePeer, peering, sendSignal, acceptSignal, initiatePeer, peered, peeringFailed, initiateDialogue, partnerPredialogueAnswers, shareAnswers } from './switchboardPeering';

export { MediaRecorder, getUserMedia } from './AudioRecorder';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export const continueNotificationTimer = () => (dispatch, getState) => {
};

let dialogueTimer = {
    totalTimer: null,
    tickTimer: null,
    startTime: null,
    currentTime: null
};

export const actionCountDown = (action, waitTime = 15 * 1000) => (dispatch, getState) => {
    setTimeout(() => {
        dispatch(action);
    }, waitTime);
};

export const endDialogue = id => ({
    type: types.END_DIALOGUE, id
});

export const dialogueStartTime = (id, time) => ({
    type: types.DIALOGUE_START_TIME,
    id,
    time
});

export const dialogueTime = (id, time) => ({
    type: types.DIALOGUE_TIME,
    time, id
});

const dialogueFileName = (id, name) => ({
    type: types.DIALOGUE_FILE_NAME,
    name, id
});

export const handleDialogueStart = (taskWrapper, id, dialogueTimeLimit) =>
    (dispatch, getState) => {
        dialogueTimer.startTime = Date.now();
        dialogueTimer.currentTime = 0;
        dispatch(taskWrapper(dialogueStartTime(id, dialogueTimer.startTime)));
        const fileName = `${id}_${Date.now()}.` + (getState().micData.recorder.recorderOptions.mimeType.startsWith('audio/webm') ? 'webm' : 'ogg');
        dispatch(taskWrapper(dialogueFileName(id, fileName)));
        dispatch(recordDialogue(fileName));
        dialogueTimer.totalTimer = setTimeout(() => {
            dialogueTimer.startTime = null;
            dialogueTimer.currentTime = null;
            clearTimeout(dialogueTimer.tickTimer);
            dialogueTimer.tickTimer = null;
            dispatch(taskWrapper(endDialogue(id)));
            dispatch(stopRecording());
            // dispatch(uploadRecording());
            // dispatch(saveDialogueFileName());
            dispatch(taskWrapper(finishTask(id)));
        }, dialogueTimeLimit);
        dialogueTimer.tickTimer = setInterval(() => {
            dialogueTimer.currentTime = Date.now() - dialogueTimer.startTime;
            dispatch(taskWrapper(dialogueTime(id, dialogueTimer.currentTime)));
        }, 1000);
}

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




export const partnerReadyToDialogue = id => ({
    type: types.PARTNER_READY_FOR_DIALOGUE,
    id
});

export const partnerNotReadyToDialogue = id => ({
    type: types.PARTNER_NOT_READY_FOR_DIALOGUE,
    id
});

export const notReadyToDialogue = id => ({
    type: types.NOT_READY_FOR_DIALOGUE,
    id
});

export const readyToDialogue = id => ({
    type: types.READY_FOR_DIALOGUE,
    id
});


export const sendPeerAction = action => {
    return rpcActions.sendData(JSON.stringify(action));
}

export const updateQuestionValue = (id, questionId, value) => ({
    type: types.QUESTION_ANSWER,
    id: id,
    questionId: questionId,
    value: value
});

export const recallData = (id, recallData) => ({
    type: types.RECALL_DATA,
    id,
    recallData,
});

export const completePreDialogueSurvey = (id) => ({
    type: types.COMPLETE_PREDIALOGUE_SURVEY,
    id
});

export const restartTask = (id) => ({
    type: types.RESTART_TASK,
    id: id
});

export const finishTask = (id) => ({
    type: types.FINISHED_TASK,
    id: id
});

export const startTask = (id) => ({
    type: types.STARTED_TASK,
    id: id
});

export const taskAction = (id, action) => ({
    type: types.TASK_ACTION,
    id: id,
    action: action
});

const stopMic = () => (dispatch, getState) => {
    getState().micData.recorder.destroy();
    getState().micData.micInput.getTracks().forEach(t => {
        t.stop();
    });
    dispatch({
        type: types.GOT_MIC,
        micInput: null
    });
};

export const removePartner = () => (dispatch, getState) => {
    if(getState().peer.isInitialized){
        dispatch(destroyPeer());
    }
    dispatch(taskAction('dialogue', finishTask('removePartner')))
};


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
        dispatch(genSelfId(getState().mturkData.workerId, getState().experimentTasksById['dialogue'].studyIdCode));
        dispatch(finishTask('micSetup'));
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
            console.log(err);
            dispatch(micError());
        });
};


export const setupMic = () => (dispatch, getState) => {
    dispatch(gotAudioContext(new AudioContext()));
    dispatch(getMic());
    dispatch(connectToSwitchboard('wss://switchboard.esteban.bz/' + getState().experimentTasksById['dialogue'].studyIdCode));
};

export const gotMicTest = (micTestFile) => ({
    type: types.MIC_TEST_FILE,
    micTestFile: micTestFile
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

const recordDialogue = (fileName) =>
    (dispatch, getState) => {
        const state = getState();
        state.micData.recorder.record().then((blob) => {
            dispatch(uploadRecording(blob, state.switchboardData.selfId, fileName));
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

