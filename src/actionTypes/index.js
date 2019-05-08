// redux-websocket action types to be dispatched by the user
export { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket';

// redux-websocket action types dispatched by the WebSocket implementation.
// These would be caught by reducers or other middleware.
export { WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED, WEBSOCKET_MESSAGE } from '@giantmachines/redux-websocket';

export * from './switchboardTypes';

// mturk actions
export const MTURKSUBMITTO = 'MTURKSUBMITTO';
export const MTURKWORKERID = 'MTURKWORKERID';
export const MTURKHITID = 'MTURKHITID';
export const MTURKASSIGNMENTID = 'MTURKASSIGNMENTID';

// block actions
export const DEBUG_MODE = 'DEBUG_MODE';
export const SKIP_TO_BLOCK = 'SKIP_TO_BLOCK';
export const FINISHED_BLOCK = 'FINISHED_BLOCK';
export const STARTED_TASK = 'STARTED_TASK';
export const FINISHED_TASK = 'FINISHED_TASK';
export const RESTART_TASK = 'RESTART_TASK';
export const TASK_ACTION = 'TASK_ACTION';
export const COMPLETE_PREDIALOGUE_SURVEY = 'COMPLETE_PREDIALOGUE_SURVEY';
export const QUESTION_ANSWER = 'QUESTION_ANSWER';
export const RECALL_DATA = 'RECALL_DATA';

// Mic and recorder actions
export const GOT_MIC = 'GOT_MIC';
export const MIC_ERROR = 'MIC_ERROR';
export const GOT_RECORDER = 'GOT_RECORDER';
export const RECORDING_STATE = 'RECORDING_STATE';
export const GOT_AUDIO_CONTEXT = 'GOT_AUDIO_CONTEXT';
export const MIC_TEST_FILE = 'MIC_TEST_FILE';

// Partner actions
export const PARTNER_PREDIALOGUE_SURVEY = 'PARTNER_PREDIALOGUE_SURVEY';
export const PARTNER_READY_FOR_DIALOGUE = 'PARTNER_READY_FOR_DIALOGUE';
export const PARTNER_NOT_READY_FOR_DIALOGUE = 'PARTNER_NOT_READY_FOR_DIALOGUE';

export const PEER_CONSTRAINT = 'PEER_CONSTRAINT';

// Dialogue actions
export const READY_FOR_DIALOGUE = 'READY_FOR_DIALOGUE';
export const NOT_READY_FOR_DIALOGUE = 'NOT_READY_FOR_DIALOGUE';
export const START_DIALOGUE = 'START_DIALOGUE';
export const TIME_KEEPER = 'TIME_KEEPER';
export const END_DIALOGUE = 'END_DIALOGUE';
export const DIALOGUE_START_TIME = 'DIALOGUE_START_TIME';
export const DIALOGUE_TIME = 'DIALOGUE_TIME';
export const DIALOGUE_FILE_NAME = 'DIALOGUE_FILE_NAME';
