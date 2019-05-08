import React from 'react';
import { connect } from 'react-redux';

class PartnerAudio extends React.Component {
    componentDidMount() {
        if(this.props.peerStream){
            this.audioElement.srcObject = this.props.peerStream;
        }
    };
    componentDidUpdate(prevProps) {
        this.audioElement.srcObject = this.props.peerStream;
    };
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
        debugMode: state.experimentalData.debugMode,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerAudio);
