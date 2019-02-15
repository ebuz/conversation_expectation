import React from 'react';
import { connect } from 'react-redux';

class PartnerAudio extends React.Component {
    componentDidUpdate(prevProps) {
        if(this.props.dialogueStarted && !prevProps.dialogueStarted){
            this.audioElement.srcObject = this.props.peerStream;
        }
        if(this.props.dialogueEnded){
            this.audioElement.srcObject = null;
        }
    }
    render() {
        const audioElement = <audio
            autoPlay
            muted={this.props.debugMode}
            controls={this.props.debugMode}
            ref={(ref) => { this.audioElement = ref; }}
            />;
        return(
            <div className="PeerAudio-box" hidden={!this.props.debugMode}>
                {audioElement}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        peerStream: state.peer.stream || null,
        dialogueStarted: state.experimentalData.dialogueStatus.started,
        dialogueEnded: state.experimentalData.dialogueStatus.ended,
        debugMode: state.experimentalData.debugMode,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerAudio);
