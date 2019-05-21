import { combineReducers } from 'redux';
import { createReducer as rpcCreateReducer } from '@ebuz/redux-peer-connection';

import { constants as rpcActionTypes } from '@ebuz/redux-peer-connection';

import * as types from '../actionTypes';

import * as defaults from '../store/initialState';

const experimentTasks = (state = defaults.experimentTasks, action) => { return state };

const parseServerMessage = (payload) => {
    const message = {
        timestamp: payload.timestamp,
        ...JSON.parse(payload.data)
    }
    return message;
};

const JSONListToMap = (str) => {
    return new Map(JSON.parse(str));
}

const experimentalData = (state = defaults.experimentalData, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

const dialogueTaskAction = (state = {}, action) => {
    switch (action.id) {
        case 'dialogueIcebreakers':
            if(action.type === types.COMPLETE_PREDIALOGUE_SURVEY){
                return {...state, finishedQuestions: true};
            }
            if(action.type === types.PARTNER_PREDIALOGUE_SURVEY){
                return {...state, data: { ...state.data,
                    partnerAnswersById: JSONListToMap(action.answers)
                }};
            }
        case 'potentialTopics':
        case 'potentialTopicsRecall':
        case 'icebreakersRecall':
            if(action.type === types.QUESTION_ANSWER){
                return {...state,
                    data: {...state.data,
                        answersById: new Map([...state.data['answersById'],
                        [action.questionId, action.value]]) }};
            }
        case 'dialogue1Recall':
            if(action.type === types.RECALL_DATA){
                return {...state, data: { ...state.data, transcript: action.recallData }};
            }
        case 'dialogue1':
        case 'dialogue2':
        case 'dialogue3':
            if(action.type === types.READY_FOR_DIALOGUE){
                return {...state, ready: true };
            }
            if(action.type === types.NOT_READY_FOR_DIALOGUE){
                return {...state, ready: false };
            }
            if(action.type === types.PARTNER_READY_FOR_DIALOGUE){
                return {...state, partnerReady: true };
            }
            if(action.type === types.PARTNER_NOT_READY_FOR_DIALOGUE){
                return {...state, partnerReady: false };
            }
            if(action.type === types.DIALOGUE_START_TIME){
                return {...state, dialogueStartTime: action.time };
            }
            if(action.type === types.DIALOGUE_TIME){
                return {...state, dialogueTime: action.time };
            }
            if(action.type === types.DIALOGUE_FILE_NAME){
                return {...state, dialogueFileName: action.name };
            }
            if(action.type === types.END_DIALOGUE){
                return {...state, ended: true };
            }
        case 'dialogueBreak':
        case 'findPartner':
        case 'removePartner':
        default:
            return state;
    }
};

const dialogue = (state = {}, action) => {
    switch(action.type) {
        case types.STARTED_TASK:
            return {...state, dialogueTasksById:
                {...state.dialogueTasksById,
                    [action.id]: {...state.dialogueTasksById[action.id], started: true}}
            };
        case types.FINISHED_TASK:
            return {...state, dialogueTasksById:
                {...state.dialogueTasksById,
                    [action.id]: {...state.dialogueTasksById[action.id], finished: true}}
            };
        case types.RESTART_TASK:
            return {...state, dialogueTasksById:
                {...state.dialogueTasksById,
                    [action.id]: {...state.dialogueTasksById[action.id], started: false, finished: false}}
            };
        default:
            return {...state, dialogueTasksById:
                {...state.dialogueTasksById,
                    [action.id]: dialogueTaskAction(state.dialogueTasksById[action.id], action)}
            };
    }
};

const taskAction = (state = {}, action) => {
    switch (action.id) {
        case "dialogue":
            return dialogue(state, action.action);
        case "introduction":
        case "consent":
        case "micSetup":
        case "micCheck":
        case "wrapUp":
        case "submission":
        default:
            return state;
    }
};

const experimentTasksById = (state = defaults.experimentTasksById, action) => {
    switch (action.type) {
        case types.STARTED_TASK:
            return {...state, [action.id]: {...state[action.id], started: true}};
        case types.FINISHED_TASK:
            return {...state, [action.id]: {...state[action.id], finished: true}};
        case types.RESTART_TASK:
            return {...state, [action.id]: {...state[action.id], started: false, finished: false}};
        case types.TASK_ACTION:
            return {...state, [action.id]: taskAction(state[action.id], action)};
        default:
            return state;
    }
};

const mturkData = (state = defaults.mturkData, action) => {
    switch (action.type) {
        case types.MTURKSUBMITTO:
            return {...state, turkSubmitTo: action.turkSubmitTo};
        case types.MTURKWORKERID:
            return {...state, workerId: action.workerId};
        case types.MTURKHITID:
            return {...state, hitId: action.hitId};
        case types.MTURKASSIGNMENTID:
            return {...state, assignmentId: action.assignmentId };
        default:
            return state;
    }
};

const micData = (state = defaults.micData, action) => {
    switch (action.type) {
        case types.GOT_MIC:
            return {...state, micInput: action.micInput}
        case types.MIC_ERROR:
            return {...state, micInput: false}
        case types.GOT_RECORDER:
            return {...state, recorder: action.recorder}
        case types.RECORDING_STATE:
            return {...state, recordingState: action.recordingState}
        case types.GOT_AUDIO_CONTEXT:
            return {...state, speakerOutput: action.speakerOutput}
        case types.MIC_TEST_FILE:
            return {...state, micTestFile: action.micTestFile}
        default:
            return state;
    }
};

const switchboardData = (state = defaults.switchboardData, action) => {
    switch (action.type) {
        case types.CANDIDATE_PEER:
            return {...state, candidatePeer: action.peerId}
        case types.SELFID:
            return {...state, selfId: action.selfId}
        case types.PEER_CONSTRAINT:
            if(action.constraint.hasOwnProperty('unreachable')){
                return {...state,
                    peeringConstraints: {...state.peeringConstraints,
                        unreachable: [...state.peeringConstraints.unreachable,
                            ...action.constraint.unreachable
                        ]
                    }
                }
            }else{
                return {...state,
                    peeringConstraints: {...state.peeringConstraints,
                        ...action.constraint
                    }
                }
            }
        case types.WEBSOCKET_CONNECTING:
            return {...state, status: 'connecting'}
        case types.WEBSOCKET_CLOSED:
            return {...state, status: 'disconnected'}
        case types.WEBSOCKET_OPEN:
            return {...state, status: 'connected'}
        case types.WEBSOCKET_MESSAGE:
            const parsedMessage = parseServerMessage(action.payload);
            switch(parsedMessage.type){
                case types.SERVERID:
                    return {...state, messages: [...state.messages, parsedMessage],
                        serverId: parsedMessage.serverId}
                case types.CANDIDATE_PEER:
                    return {...state, messages: [...state.messages, parsedMessage],
                        candidatePeer: parsedMessage.peerId}
                default:
                    return {...state, messages: [...state.messages, parsedMessage]}
            }
        case rpcActionTypes.default.PEER_SIGNAL:
            return {...state, selfSignalData: [...state.selfSignalData, action.signal]}
        default:
            return state;
    }
};

const reducer = combineReducers({
    mturkData,
    experimentalData,
    micData,
    switchboardData,
    peer: rpcCreateReducer('peer'),
    experimentTasks,
    experimentTasksById
});


export default reducer;
