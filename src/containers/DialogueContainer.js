import React from 'react';
import { connect } from 'react-redux';

import PartnerAudioContainer from './PartnerAudioContainer';
import DialogueSurveyDisplayContainer from './DialogueSurveyDisplayContainer';
import DialogueControlsContainer from './DialogueControlsContainer';
import DialogueTimerContainer from './DialogueTimerContainer';
import { finishBlock } from '../actions';

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
                <p>{this.props.instructions}</p>
                <DialogueSurveyDisplayContainer />
                <DialogueTimerContainer />
                <DialogueControlsContainer />
                <PartnerAudioContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { ...state.blocksById['dialogue'],
        dialogueStatus: state.experimentalData.dialogueStatus,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: (blockId) => () => dispatch(finishBlock(blockId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialogue);
