import * as types from '../actionTypes';

import { actions as rpcActions } from '@ebuz/redux-peer-connection';

import { taskAction } from './index';

import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from '@giantmachines/redux-websocket';

// notifications for switchboard:
// connect //action: websocket connect
// send selfid
// request peer
// notify of peering
// signaling data w/peer id
// signaling success w/peer id
// signaling failure w/peer id
// dialogue initiate
// dialogue end
//

export const switchboardSendAction = action => ({
    type: WEBSOCKET_SEND,
    payload: action
});


export const connectToSwitchboard = (url) => ({
        type: WEBSOCKET_CONNECT,
        payload: { url }
});

export const sendSelfId = () => (dispatch, getState) => {
    return switchboardSendAction({
        type: types.SELFID,
        selfId: getState().switchboardData.selfId,
    })
};


export const requestPeer = (peeringConstraints) => {
    if(peeringConstraints) {
        return switchboardSendAction({
            type: types.REQUEST_PEER,
            peeringConstraints: peeringConstraints
        });
    } else{
        return (dispatch, getState) => {
            dispatch(switchboardSendAction({
                type: types.REQUEST_PEER,
                peeringConstraints: getState().switchboardData.peeringConstraints
            }));
        }
    }
};


export const candidatePeer = id => ({
        type: types.CANDIDATE_PEER,
        peerId: id
});

export const peering = () => {
    return switchboardSendAction({
        type: types.PEERING,
    })
};

export const sendSignal = (signal, peerId) => {
    return switchboardSendAction({
        type: types.RELAY_SIGNAL,
        signal: signal,
        receivingPeer: peerId,
    })
};

export const switchInitiator = peerId => {
    return switchboardSendAction({
        type: types.PEERING_SWITCH_INITIATOR,
        receivingPeer: peerId,
    })
};

export const peered = () => {
    return switchboardSendAction({
        type: types.PEERED,
    })
};

export const destroyPeer = () => (dispatch, getState) => {
    dispatch(rpcActions.destroyPeer());
};

export const partnerPredialogueAnswers = (answers) => {
    return taskAction('dialogue', {
        type: types.PARTNER_PREDIALOGUE_SURVEY,
        id: 'dialogueIcebreakers',
        answers
    });
};

export const peeringConstraint = constraint => ({
        type: types.PEER_CONSTRAINT,
        constraint
});

export const peeringFailed = peerId => (dispatch, getState) => {
    dispatch(peeringConstraint({unreachable: [peerId]}));
    dispatch(partnerPredialogueAnswers('[]'));
    dispatch(destroyPeer());
    dispatch(switchboardSendAction({
        type: types.PEERING_FAILED,
        peerId: peerId
    }));
    dispatch(requestPeer());
};

export const shareAnswers = (answers) => {
    return rpcActions.sendData(JSON.stringify(partnerPredialogueAnswers(answers)));
};

export const initiateDialogue = () => {
    return switchboardSendAction({
        type: types.INITIATE_DIALOGUE,
    });
};

export const endDialogue = () => {
    return switchboardSendAction({
        type: types.END_DIALOGUE,
    });
};

export const initiatePeer = (initiator, stream) => {
    return rpcActions.createPeer({
        initiator: initiator,
        channelName: 'peerData',
        stream: stream,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
                { urls: 'stun:stun.stunprotocol.org:3478?transport=udp' },
                { urls: 'stun:stun.services.mozilla.com:3478?transport=udp' },
            ] },
    });
};

export const acceptSignal = (signal) => { return rpcActions.acceptSignal(signal); };
