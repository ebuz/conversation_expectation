import React from 'react';
import { connect } from 'react-redux';

import PartnerAudioContainer from './PartnerAudioContainer';
import DialogueSurveyDisplayContainer from './DialogueSurveyDisplayContainer';
import DialogueControlsContainer from './DialogueControlsContainer';
import DialogueTimerContainer from './DialogueTimerContainer';
import { finishTask } from '../actions';

class Dialogue extends React.Component {
    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
    }

    componentWillUnmount() {
    }

    render() {
        return(
            <div className="Dialogue-box">
                <DialogueTimerContainer {...this.props} />
                <DialogueControlsContainer {...this.props} />
                <p>{this.props.instructions}</p>
                {this.props.id === 'dialogue1' ? <DialogueSurveyDisplayContainer /> : null}
                {this.props.dialogueStartTime ? <PartnerAudioContainer /> : null}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        onFinished: ownProps.dispatchAction(finishTask(ownProps.id)),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialogue);
