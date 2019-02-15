import { combineReducers } from 'redux';
import { createReducer as rpcCreateReducer } from '@ebuz/redux-peer-connection';

import { constants as rpcActionTypes } from '@ebuz/redux-peer-connection';

import * as types from '../actionTypes';

import * as defaults from '../store/initialState';

const experimentBlocks = (state = defaults.experimentBlocks, action) => { return state };

const parseServerMessage = (payload) => {
    const message = {
        timestamp: payload.timestamp,
        ...JSON.parse(payload.data)
    }
    return message;
};

const parsePeerData = (data) => {
    return JSON.parse(data);
}

const JSONToMap = (str) => {
    return new Map(JSON.parse(str));
}

const experimentalData = (state = defaults.experimentalData, action) => {
    switch (action.type) {
        case types.QUESTION_ANSWER:
            return {...state, [action.dataField]: new Map([...state[action.dataField], [action.questionId, action.value]])};
        case types.RECALL_DATA:
            return {...state, recallData: action.recallData};
        case rpcActionTypes.default.PEER_DATA:
            const parsedData = parsePeerData(action.data.toString());
            switch (parsedData.type) {
                case types.PARTNER_PREDIALOGUE_SURVEY:
                    return {...state, preDialoguePartnerAnswersById: JSONToMap(parsedData.answers)};
                case types.PARTNER_READY_FOR_DIALOGUE:
                    return {...state, dialogueStatus: {...state.dialogueStatus, partnerReady: true}};
                case types.START_DIALOGUE:
                    return {...state, dialogueStatus: {...state.dialogueStatus, started: true}};
                case types.END_DIALOGUE:
                    return {...state, dialogueStatus: {...state.dialogueStatus, ended: true}};
                default:
                    return state;
            }
        case types.READY_FOR_DIALOGUE:
            return {...state, dialogueStatus: {...state.dialogueStatus, ready: true}};
        case types.WEBSOCKET_MESSAGE:
            const parsedMessage = parseServerMessage(action.payload);
            if(parsedMessage.type === types.initiateDialogue){
                return {...state, dialogueStatus: {...state.dialogueStatus, started: true, timeKeeper: parsedMessage.initiator}};
            }
            return state;
        case types.START_DIALOGUE:
            return {...state, dialogueStatus: {...state.dialogueStatus, started: true}};
        case types.END_DIALOGUE:
            return {...state, dialogueStatus: {...state.dialogueStatus, ended: true}};
        case types.TIME_KEEPER:
            return {...state, dialogueStatus: {...state.dialogueStatus, timeKeeper: true}};
        case types.DIALOGUE_TIME:
            return {...state, dialogueStatus: {...state.dialogueStatus, dialogueTime: action.time}};
        case types.DIALOGUE_START_TIME:
            return {...state, dialogueStatus: {...state.dialogueStatus, dialogueStartTime: action.time}};
        case types.DIALOGUE_FILE_NAME:
            return {...state, dialogueStatus: {...state.dialogueStatus, dialogueFileName: action.dialogueFileName}};
        default:
            return state;
    }
};

const blocksById = (state = defaults.blocksById, action) => {
    switch (action.type) {
        case types.FINISHED_BLOCK:
            return {...state, [action.blockId]: {...state[action.blockId], finished: true}};
        case types.COMPLETE_PREDIALOGUE_SURVEY:
            return {...state, preDialogue: {...state.preDialogue, finishedPreDialogueQuestions: true}};
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
        case types.CANDIDATE_PEERID:
            return {...state, candidatePeerId: action.candidatePeerId}
        case types.SELFID:
            return {...state, selfId: action.selfId}
        case types.PEER_CONSTRAINTS:
            return {...state,
                peeringConstraints: {...state.peeringConstraints, ...action.peeringConstraints}
            }
        case types.WEBSOCKET_CONNECTING:
            return {...state, status: 'connecting'}
        case types.WEBSOCKET_CLOSED:
            return {...state, status: 'disconnected'}
        case types.WEBSOCKET_OPEN:
            return {...state, status: 'connected'}
        case types.WEBSOCKET_MESSAGE:
            const parsedMessage = parseServerMessage(action.payload);
            if(parsedMessage.type === 'serverId'){
                return {...state, messages: [...state.messages, parsedMessage], serverId: parsedMessage.serverId}
            } else {
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
    experimentBlocks,
    blocksById
});


export default reducer;
