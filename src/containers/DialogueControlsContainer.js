import React from 'react';
import { connect } from 'react-redux';

import { TASK_ACTION } from '../actionTypes';

import { startNotificationTimer, endNotificationTimer, readyToDialogue, partnerReadyToDialogue, actionCountDown, notReadyToDialogue, partnerNotReadyToDialogue, sendPeerAction, handleDialogueStart } from '../actions';

import { lastPeerMessage } from './PreDialogueContainer';

class DialogueControls extends React.Component {
    componentDidMount() {
        if(this.props.peerData){
            const peerData = JSON.parse(this.props.peerData);
            if(peerData.type && peerData.type === TASK_ACTION){
                this.props.dispatchPeerAction(peerData);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.peerData && this.props.peerData !== prevProps.peerData){
            const peerData = JSON.parse(this.props.peerData);
            if(peerData.type && peerData.type === TASK_ACTION){
                this.props.dispatchPeerAction(peerData);
            }
        }
        if(this.props.dialogueStartTime === null){ //convo not started
            if((this.props.ready && this.props.partnerReady) && !(prevProps.ready && prevProps.partnerReady)){
                endNotificationTimer();
                this.props.startDialogue();
            } else if((!this.props.ready && this.props.partnerReady) && !prevProps.partnerRead){
                startNotificationTimer(10 * 1000);
            }
        }
    }

    componentWillUnmount() {
        endNotificationTimer();
    }

    render() {
        if(!this.props.ready){
            return <div>
                <button onClick={this.props.readyAndNotify}>
                    Click when ready to start talking
                </button>
                </div>;
        }
        if(!this.props.partnerReady){
            return <div><p>Waiting on partner to be ready. Do not leave this page!</p></div>
        }
        return <div><p>Dialogue in progress</p></div>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        peerData: lastPeerMessage(state.peer.data),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        readyAndNotify: () => {
            dispatch(ownProps.wrappedTaskAction(readyToDialogue(ownProps.id)));
            dispatch(sendPeerAction(ownProps.wrappedTaskAction(partnerReadyToDialogue(ownProps.id))));
            const NotReadyAction = ownProps.wrappedTaskAction(notReadyToDialogue(ownProps.id));
            const NotPartnerReadyAction = sendPeerAction(ownProps.wrappedTaskAction(partnerNotReadyToDialogue(ownProps.id)));
            dispatch(actionCountDown(NotReadyAction));
            dispatch(actionCountDown(NotPartnerReadyAction));
        },
        startDialogue: () => {
            endNotificationTimer();
            dispatch(handleDialogueStart(ownProps.wrappedTaskAction, ownProps.id, 15 * 1000));
        },
        dispatchPeerAction: action => dispatch(action),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogueControls);
