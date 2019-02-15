import React from 'react';
import { connect } from 'react-redux';

import PartnerMatchingContainer from './PartnerMatchingContainer';
import PreDialogueSurveyContainer from './PreDialogueSurveyContainer';
import { startNotificationTimer, endNotificationTimer, completePreDialogueSurvey, sharePreDialogueSurvey, finishBlock } from '../actions';

const finishedSurvey = (questions, answersById) => {
    const unAnswered = questions.findIndex(q => {
        let answer = answersById.get(q.questionId);
        return answer === undefined || answer === null || answer === '';
    });
    return unAnswered === -1;
}

class PreDialogue extends React.Component {
    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        const readyToContinue = this.props.finishedPreDialogueQuestions && this.props.havePartnerSurvey;
        const prevReadyToContinue = prevProps.finishedPreDialogueQuestions && prevProps.havePartnerSurvey;
        if(readyToContinue && !prevReadyToContinue) {
            startNotificationTimer();
        }
        const readyToShareAnswers = this.props.finishedPreDialogueQuestions && this.props.havePartner;
        const prevReadyToShareAnswers = prevProps.finishedPreDialogueQuestions && prevProps.havePartner;
        if(readyToShareAnswers && !prevReadyToShareAnswers) {
            //share survey answers
            this.props.sharePreDialogueSurvey(this.props.preDialogueAnswersById);
        }
    }

    componentWillUnmount() {
        endNotificationTimer();
    }

    render() {
        let button_message = 'Please answer all the questions';
        let button_action = this.props.completePreDialogueSurvey();
        let button_disabled = true;
        if(this.props.surveyReady && !this.props.finishedPreDialogueQuestions){
            button_message = 'Save your answers';
            button_disabled = false;
        } else if (this.props.finishedPreDialogueQuestions && !this.props.havePartnerSurvey){
            button_message = 'Waiting on your partner';
            button_disabled = true;
        } else if (this.props.finishedPreDialogueQuestions && this.props.havePartnerSurvey){
            button_message = 'Continue to begin conversing with your partner';
            button_action = this.props.onFinished(this.props.blockId);
            button_disabled = false;
        }
        return(
            <div className="PreDialogue-box">
                <p>{this.props.instructions}</p>
                <PreDialogueSurveyContainer />
                <button type='button' onClick={button_action} disabled={button_disabled}
                    className="PreDialogue-button"
                >
                    {button_message}
                </button>
                <PartnerMatchingContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { ...state.blocksById['preDialogue'],
        preDialogueAnswersById: state.experimentalData.preDialogueAnswersById,
        surveyReady: finishedSurvey(state.blocksById['preDialogue'].preDialogueQuestions, state.experimentalData.preDialogueAnswersById),
        havePartner: state.peer.isConnected,
        havePartnerSurvey: state.experimentalData.preDialoguePartnerAnswersById !== null && state.experimentalData.preDialoguePartnerAnswersById.size === state.experimentalData.preDialogueAnswersById.size,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: (blockId) => () => dispatch(finishBlock(blockId)),
        completePreDialogueSurvey: () => () => dispatch(completePreDialogueSurvey()),
        sharePreDialogueSurvey: (answers) => dispatch(sharePreDialogueSurvey(answers)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreDialogue);
