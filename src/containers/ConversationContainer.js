import React from 'react';
import { connect } from 'react-redux';

import PartnerAudioContainer from './PartnerAudioContainer';
import DialogueSurveyDisplayContainer from './DialogueSurveyDisplayContainer';
import DialogueControlsContainer from './DialogueControlsContainer';
import DialogueTimerContainer from './DialogueTimerContainer';
import { finishTask, endEarly } from '../actions';

class Dialogue extends React.Component {
    componentDidMount() {
        if(!this.props.peerConnected || this.props.peerError)
            this.props.endEarly();
    }

    componentDidUpdate(prevProps) {
        if(!this.props.peerConnected || this.props.peerError)
            this.props.endEarly();
    }

    componentWillUnmount() {
    }

    render() {
        return(
            <div className="Dialogue-box">
                <DialogueTimerContainer {...this.props} />
                <DialogueControlsContainer {...this.props} />
                {this.props.id === 'dialogue1' ? <DialogueSurveyDisplayContainer /> : null}
                {this.props.dialogueStartTime ? <PartnerAudioContainer /> : null}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        onFinished: ownProps.dispatchAction(finishTask(ownProps.id)),
        peerInitialized: state.peer.isInitialized,
        peerConnected: state.peer.isConnected,
        peerError: state.peer.error
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        endEarly: () => {dispatch(endEarly())}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialogue);
