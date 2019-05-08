import React from 'react';
import { connect } from 'react-redux';

import { TASK_ACTION } from '../actionTypes';

import IceBreakerContainer from './IceBreakerContainer';
import PartnerMatchingContainer from './PartnerMatchingContainer';
import { startNotificationTimer, endNotificationTimer, finishTask, shareAnswers } from '../actions';

const readyToContinue = (props) => {
    return props.dialogueIcebreakers.data.answersById.size > 0 && props.dialogueIcebreakers.data.answersById.size === props.dialogueIcebreakers.data.partnerAnswersById.size;
}

const readyToShare = (props) => {
    return props.dialogueIcebreakers.finishedQuestions && props.findPartner.finished;
}

export const lastPeerMessage = (peerData) => {
    if(peerData && peerData.length > 0){
        return peerData[peerData.length - 1];
    }
    return null;
}

class PreDialogue extends React.Component {
    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        const currentlyReady = readyToContinue(this.props);
        const previouslyReady = readyToContinue(prevProps);
        if(currentlyReady && currentlyReady !== previouslyReady) {
            startNotificationTimer();
        }
        const currentlyReadyToShare = readyToShare(this.props);
        const previouslyReadyToShare = readyToShare(prevProps);
        if(currentlyReadyToShare && currentlyReadyToShare !== previouslyReadyToShare) {
            //share survey answers
            this.props.shareSurvey(JSON.stringify([...this.props.dialogueIcebreakers.data.answersById]));
        }
        if(this.props.peerData && this.props.peerData !== prevProps.peerData){
            const peerData = JSON.parse(this.props.peerData);
            if(peerData.type && peerData.type === TASK_ACTION){
                this.props.dispatchPeerAction(peerData);
            }
        }
    }

    componentWillUnmount() {
        endNotificationTimer();
    }

    render() {
        let button_message = 'Waiting on a partner';
        let button_action = this.props.onFinished;
        let button_disabled = !readyToContinue(this.props);
        if(this.props.dialogueIcebreakers.data.answersById.size === this.props.dialogueIcebreakers.data.partnerAnswersById.size){
            button_message = 'Continue to your conversation';
        }
        return(
            <div className="PreDialogue-box">
                <PartnerMatchingContainer dispatchTaskAction={this.props.dispatchAction} id={this.props.findPartner.id} finished={this.props.findPartner.finished} />
                <IceBreakerContainer dispatchAction={this.props.dispatchAction} {...this.props.dialogueIcebreakers} />
                <button type='button' onClick={button_action} disabled={button_disabled}
                    hidden={!this.props.dialogueIcebreakers.finishedQuestions}
                    className="PreDialogue-button"
                >
                    {button_message}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        findPartner: state.experimentTasksById['dialogue'].dialogueTasksById['findPartner'],
        dialogueIcebreakers: state.experimentTasksById['dialogue'].dialogueTasksById['dialogueIcebreakers'],
        onFinished: ownProps.dispatchAction(finishTask(ownProps.id)),
        peerData: lastPeerMessage(state.peer.data)
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        shareSurvey: answersAsJSON => dispatch(shareAnswers(answersAsJSON)),
        dispatchPeerAction: action => dispatch(action),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreDialogue);
