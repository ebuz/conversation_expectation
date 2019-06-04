import React from 'react';
import { connect } from 'react-redux';

const SwitchboardStatus = ({showDetails, switchboardData, peer, skipTo}) => {
    if(!showDetails) return null;
    let last_message = '';
    const styles = {
        height: 100,
        overflowX: 'hidden',
        overflowY: 'scroll',
    };
    if(switchboardData.messages.length > 0){
        last_message = switchboardData.messages[switchboardData.messages.length - 1];
    }
    return(
        <div className="SwitchboardStatus-box">
            <div className="SwitchboardInfo-box">
                <p>switchboard status: {switchboardData.status}; constraints: {JSON.stringify(switchboardData.peeringConstraints)}</p>
                <div style={styles}>
                    {[...switchboardData.messages].reverse().map((item, index) => {
                        return (
                            <div style={{height: '1em', lineHeight: '1em', overflow: 'hidden'}} key={index}>{JSON.stringify(item, null, '  ')}</div>
                        )
                    })
                    }
                </div>
            </div>
            <div className="PeerInfo-box">
            <p>peer: {peer.isInitialized? '' : 'not'} initialized; initiator: {peer.offer ? 'y' : 'n'}; {peer.isConnected ? '' : 'not'} connected; candidate peer: {switchboardData.candidatePeer}</p>
                <div style={styles}>
                    {[...peer.data].reverse().map((item, index) => {
                        return (
                            <div style={{height: '1em', lineHeight: '1em', overflow: 'hidden'}} key={index}>{item}</div>
                        )
                    })
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        showDetails: state.experimentalData.debugMode || false,
        switchboardData: state.switchboardData,
        peer: state.peer
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchboardStatus);
