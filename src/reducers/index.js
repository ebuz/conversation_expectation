import { combineReducers } from 'redux';

import * as types from '../actionTypes';

import * as defaults from '../store/initialState';

const experimentBlocks = (state = defaults.experimentBlocks, action) => { return state };

const experimentalData = (state = defaults.experimentalData, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

const blocksById = (state = defaults.blocksById, action) => {
    switch (action.type) {
        case types.FINISHED_BLOCK:
            return {...state, [action.blockId]: {...state[action.blockId], finished: true}};
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
        case types.GOT_PUBLICID:
            return {...state, publicId: action.publicId}
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

const reducer = combineReducers({
    mturkData,
    experimentalData,
    micData,
    experimentBlocks,
    blocksById
});


export default reducer;
