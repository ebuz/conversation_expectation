import React from 'react';
import { connect } from 'react-redux';

const SwitchboardStatus = ({showDetails, switchboardData, peer, skipTo}) => {
    if(!showDetails) return null;
    let last_message = '';
    if(switchboardData.messages.length > 0){
        last_message = switchboardData.messages[switchboardData.messages.length - 1];
    }
    return(
        <div className="SwitchboardStatus-box">
            <p>switchboard: status: {switchboardData.status}, last message: {last_message.type}</p>
            <p>peer: {peer.isInitialized? '' : 'not'} initialized; {peer.isConnected ? '' : 'not'} connected</p>
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
