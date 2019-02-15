import React from 'react';
import { connect } from 'react-redux';

import { askServerForPeer, notifyServerPeering, candidatePeerId, initiatePeer, sendSignal, acceptSignal } from '../actions';

class PartnerMatching extends React.Component {
    componentDidMount() {
        this.props.askForPeer();
    }

    componentDidUpdate(prevProps) {
        // handle peer setup and signaling
        if(prevProps.lastServerMessage !== this.props.lastServerMessage && this.props.lastServerMessage.hasOwnProperty('type')) {
            switch(this.props.lastServerMessage.type) {
                case 'initiateSignaling':
                case 'expectSignaling':
                    this.props.initiatePeering(this.props.lastServerMessage, this.props.selfStream);
                    break;
                case 'signal':
                    this.props.acceptSignal(this.props.lastServerMessage.signal);
                    break;
            }
        }
        if(this.props.selfSignalData !== prevProps.selfSignalData && this.props.selfSignalData) {
            // send offer to server for relaying
            this.props.sendSignal(this.props.selfSignalData, this.props.candidatePeerId);
        }
        if(this.props.isConnected && this.props.isConnected !== prevProps.isConnected) {
            // send offer to server for relaying
            this.props.notifyServerPeering(this.props.serverId, this.props.candidatePeerId);
        }
    }

    render() {
        let message = <p>Our software is currently trying to match you with a partner.</p>;
        if(this.props.isInitalized){
            if(this.props.isConnected){
                message = <p>You have a partner! Please finish your survey if you haven't already so you can continue the study.</p>;
            } else {
                message = <p>We've identified a potential partner, trying to establish a connection.</p>;
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
        candidatePeerId: state.switchboardData.candidatePeerId,
        isInitalized: state.peer.isInitalized,
        isConnected: state.peer.isConnected,
        peer: state.peer
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        askForPeer: () => dispatch(askServerForPeer()),
        initiatePeering: (message, stream) => {
            dispatch(candidatePeerId(message.candidatePeerId));
            dispatch(initiatePeer(message.type === 'initiateSignaling', stream));
            },
        sendSignal: (signal, peerId) => dispatch(sendSignal(signal, peerId)),
        acceptSignal: (signal) => dispatch(acceptSignal(signal)),
        notifyServerPeering: (self, peer) => dispatch(notifyServerPeering(self, peer)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerMatching);
