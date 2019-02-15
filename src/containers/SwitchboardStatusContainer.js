import React from 'react';
import { connect } from 'react-redux';
import { skipToBlock } from '../actions';

const SwitchboardStatus = ({showDetails, switchboardData, peer, skipTo}) => {
    if(!showDetails) return null;
    let last_message = '';
    if(switchboardData.messages.length > 0){
        last_message = switchboardData.messages[switchboardData.messages.length - 1];
    }
    const skipOptions = ["consent", "micSetup", "micCheck", "preDialogue", "recall", "debrief", "submission"];
    return(
        <div className="SwitchboardStatus-box">
            <p>switchboard: status: {switchboardData.status}, last message: {last_message.type}</p>
            <p>peer: {peer.isInitialized? '' : 'not'} initialized; {peer.isConnected ? '' : 'not'} connected</p>
            <p>skip to section:
            {skipOptions.map((item, i) => {
                return <button key={i} onClick={skipTo(item)}>{item}</button>
            })}</p>
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
        skipTo: (blockId) => () => dispatch(skipToBlock(blockId)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchboardStatus);
