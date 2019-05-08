import React from 'react';
import { connect } from 'react-redux';

import { finishTask, updateQuestionValue } from '../actions';

import SurveyQuestionContainer from './SurveyQuestionContainer'

export const finishedSurvey = (questions, answersById) => {
    const unAnswered = questions.findIndex(q => {
        let answer = answersById.get(q.questionId);
        return answer === undefined || answer === null || answer === '';
    });
    return unAnswered === -1;
}

const QuestionsContainer = ({preDialogueQuestions, answersById, handleOnChange, handleOnChangeMultiple}) => {
    return(
        <div className="PreDialogueSurvey-box">
            {preDialogueQuestions.map((item, i) =>
                (<SurveyQuestionContainer key={i}
                    handleOnChange={handleOnChange(item.questionId)}
                    handleOnChangeMultiple={handleOnChangeMultiple(item.questionId)}
                    questionId={item.questionId}
                    question={item}
                    answer={answersById.get(item.questionId)}
                />)
            )}
        </div>
    );
};

class IceBreakerRecall extends React.Component {
    componentDidMount() {
    };
    componentDidUpdate(prevProps) {
    };
    componentWillUnmount() {
    };

    render() {
        return(
            <div className="IceBreakerRecall-box">
                <p>Try to recall the answers that your <b>partner</b> gave to these question.</p>
                <QuestionsContainer preDialogueQuestions={this.props.preDialogueQuestions}
                    answersById={this.props.data.answersById} handleOnChange={this.props.handleOnChange}
                    handleOnChangeMultiple={this.props.handleOnChangeMultiple}
                />
                <button type='button' onClick={this.props.onFinished} disabled={!this.props.surveyReady}
                    className="IceBreakerRecall-button"
                >
                    {this.props.surveyReady ? 'Save your answers' : 'Please answer all the questions'}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        onFinished: ownProps.dispatchAction(finishTask(ownProps.id)),
        preDialogueQuestions: state.experimentTasksById['dialogue'].dialogueTasksById['dialogueIcebreakers'].preDialogueQuestions,
        surveyReady: finishedSurvey(
           state.experimentTasksById['dialogue'].dialogueTasksById['dialogueIcebreakers'].preDialogueQuestions,
            ownProps.data.answersById),
        handleOnChange: questionId => event => ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, event.target.value))(),
        handleOnChangeMultiple: questionId => event => ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, [...event.target.options].filter(({selected}) => selected).map(({value}) => value)))(),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IceBreakerRecall);
