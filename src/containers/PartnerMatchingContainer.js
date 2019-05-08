import React from 'react';
import { connect } from 'react-redux';

import * as switchboardTypes from '../actionTypes/switchboardTypes';
import { finishTask, restartTask, requestPeer, initiatePeer, sendSignal, acceptSignal, peered, peeringFailed } from '../actions';

class PartnerMatching extends React.Component {
    componentDidMount() {
        this.props.dispatchAction(requestPeer());
    }

    componentDidUpdate(prevProps) {
        if(this.props.peerError && this.props.peerError !== prevProps.peerError) {
            this.props.dispatchAction(peeringFailed(this.props.candidatePeer));
            this.props.dispatchTaskAction(restartTask(this.props.id))();
        }
        if(this.props.finished) return;
        // handle peer setup and signaling
        if(prevProps.lastServerMessage !== this.props.lastServerMessage && this.props.lastServerMessage.hasOwnProperty('type')) {
            switch(this.props.lastServerMessage.type) {
                case switchboardTypes.CANDIDATE_PEER:
                    this.props.dispatchAction(initiatePeer(this.props.lastServerMessage.initiator));
                    break;
                case switchboardTypes.SIGNAL:
                    this.props.dispatchAction(acceptSignal(this.props.lastServerMessage.signal));
                    break;
            }
        }
        if(this.props.candidatePeer && this.props.selfSignalData && prevProps.selfSignalData !== this.props.selfSignalData) {
            this.props.dispatchAction(sendSignal(this.props.selfSignalData, this.props.candidatePeer));
        }
        if(this.props.peerConnected && this.props.peerConnected !== prevProps.peerConnected) {
            this.props.dispatchAction(peered());
            this.props.dispatchTaskAction(finishTask(this.props.id))();
        }
    }

    render() {
        let message = <p>Our software is currently trying to match you with a partner.</p>;
        if(this.props.peerInitialized){
            message = <p>We've identified a potential partner, trying to establish a connection.</p>;
            if(this.props.peerConnected){
                message = <p>You have a partner! Please finish your survey if you haven't already so you can continue the study.</p>;
            }
        }
        return(
            <div className="PartnerMatching-box">
                {message}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lastServerMessage: state.switchboardData.messages[state.switchboardData.messages.length - 1],
        selfSignalData: state.switchboardData.selfSignalData[state.switchboardData.selfSignalData.length - 1],
        selfStream: state.micData.micInput,
        serverId: state.switchboardData.serverId,
        candidatePeer: state.switchboardData.candidatePeer,
        peerInitialized: state.peer.isInitialized,
        peerConnected: state.peer.isConnected,
        peerError: state.peer.error
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatchAction: (action) => dispatch(action),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerMatching);
