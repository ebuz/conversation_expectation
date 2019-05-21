import React from 'react';
import { connect } from 'react-redux';

import * as switchboardTypes from '../actionTypes/switchboardTypes';
import { finishTask, restartTask, requestPeer, initiatePeer, switchInitiator, sendSignal, acceptSignal, peered, peeringConstraint, destroyPeer, peeringFailed } from '../actions';

const peerSignalingWaitTime = 2 * 60 * 1000; //2 minutes in ms

class PartnerMatching extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            peerSignalingTimer: null,
        };
    }
    signalingTimer(){
        clearTimeout(this.state.peerSignalingTimer);
        this.setState({ ...this.state,
            peerSignalingTimer: setTimeout(() => {
                this.signalingTimeUp();
            }, peerSignalingWaitTime),
        });
    }
    signalingCancelTimer(){
        clearTimeout(this.state.peerSignalingTimer);
        this.setState({ ...this.state,
            peerSignalingTimer: null
        });
    }
    signalingTimeUp(){
        //first try switching who initiates but save candidate peer as unreachable
        this.props.dispatchAction(peeringConstraint({unreachable: [this.props.candidatePeer]}));
        this.props.dispatchAction(switchInitiator(this.props.candidatePeer));
        this.props.dispatchAction(destroyPeer());
        this.props.dispatchTaskAction(restartTask(this.props.id))();
        this.setState({ ...this.state,
            peerSignalingTimer: null
        });
    }
    componentDidMount() {
        this.props.dispatchAction(requestPeer());
    }

    componentWillUnmount() {
        clearTimeout(this.state.peerSignalingTimer);
    };
    componentDidUpdate(prevProps) {
        if(this.props.peerError && this.props.peerError !== prevProps.peerError) {
            this.props.dispatchAction(peeringFailed(this.props.candidatePeer));
            this.props.dispatchTaskAction(restartTask(this.props.id))();
            this.signalingCancelTimer();
        }
        if(this.props.finished) return;
        // handle peer setup and signaling
        if(prevProps.lastServerMessage !== this.props.lastServerMessage && this.props.lastServerMessage.hasOwnProperty('type')) {
            if(this.props.lastServerMessage.type === switchboardTypes.CANDIDATE_PEER){
                if(this.props.lastServerMessage.initiator){
                    if(this.props.peeringConstraints.unreachable.includes(this.props.candidatePeer)){
                        this.props.dispatchAction(peeringFailed(this.props.candidatePeer));
                        this.props.dispatchTaskAction(restartTask(this.props.id))();
                        this.signalingCancelTimer();
                    } else {
                        this.props.dispatchAction(initiatePeer(this.props.lastServerMessage.initiator, this.props.selfStream));
                        this.signalingTimer();
                    }
                } else {
                    if(this.props.peerInitialized){
                        this.props.dispatchAction(destroyPeer());
                        this.props.dispatchAction(initiatePeer(this.props.lastServerMessage.initiator, this.props.selfStream));
                    } else {
                        this.props.dispatchAction(initiatePeer(this.props.lastServerMessage.initiator, this.props.selfStream));
                    }
                }
            }
            if(this.props.lastServerMessage.type === switchboardTypes.SIGNAL && !this.props.peeringConstraints.ignoreSignals)
                this.props.dispatchAction(acceptSignal(this.props.lastServerMessage.signal));
        }
        if(this.props.candidatePeer && this.props.selfSignalData && prevProps.selfSignalData !== this.props.selfSignalData) {
            this.props.dispatchAction(sendSignal(this.props.selfSignalData, this.props.candidatePeer));
        }
        if(this.props.peerConnected && this.props.peerConnected !== prevProps.peerConnected) {
            this.props.dispatchAction(peered());
            this.props.dispatchTaskAction(finishTask(this.props.id))();
            this.signalingCancelTimer();
        }
    }

    render() {
        let message = <p>Our software is currently trying to match you with a partner. This may take a while and requires you to leave this window open. You can put this window in the background, a sound will play if a partner is found. If you decide not to continue with this HIT please return it so others can successfully match.</p>;
        if(this.props.peerInitialized){
            message = <p>We've identified a potential partner, trying to establish a connection.</p>;
            if(this.props.peerConnected){
                message = <p>You have a partner! Please finish your survey if you haven't already so you can continue the study.</p>;
            }
            if(this.props.peerError){
                message = <p>Pairing failed, trying again.</p>;
            }
        } else if(this.props.peeringConstraints.unreachable.length >= 2){
            message = <p>Our software has not been able to match you with two potential partners. This may mean you are behind a firewall preventing connections. If so then you will not be able to connect with a partner.</p>;
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
        peeringConstraints: state.switchboardData.peeringConstraints,
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
