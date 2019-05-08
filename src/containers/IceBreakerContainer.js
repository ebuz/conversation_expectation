import React from 'react';
import { connect } from 'react-redux';

import SurveyQuestionContainer from './SurveyQuestionContainer';
import SurveyAnswerContainer from './SurveyAnswerContainer';

import { finishedSurvey } from './IceBreakerRecallContainer';

import { completePreDialogueSurvey, updateQuestionValue } from '../actions';

const PreDialogueSurvey = ({
    onFinishedSurvey, onFinished, surveyReady,
    preDialogueQuestions, finishedQuestions, data,
    handleOnChange, handleOnChangeMultiple }) => {

    let SurveyComponent = SurveyQuestionContainer;
    if(finishedQuestions){
        SurveyComponent = SurveyAnswerContainer;
    }

    return(
        <div className="PreDialogueSurvey-box">
            {preDialogueQuestions.map((item, i) =>
                (<SurveyComponent key={i}
                    handleOnChange={handleOnChange(item.questionId)}
                    handleOnChangeMultiple={handleOnChangeMultiple(item.questionId)}
                    questionId={item.questionId}
                    question={item}
                    answer={data.answersById.get(item.questionId)}
                />)
            )}
            <button type='button' onClick={onFinishedSurvey} disabled={!surveyReady}
                hidden={finishedQuestions}
                className="IceBreaker-button"
            >
                {surveyReady ? 'Save your answers' : 'Please answer all the questions'}
            </button>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        onFinishedSurvey: ownProps.dispatchAction(completePreDialogueSurvey(ownProps.id)),
        surveyReady: finishedSurvey(ownProps.preDialogueQuestions, ownProps.data.answersById),
        handleOnChange: questionId => event => ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, event.target.value))(),
        handleOnChangeMultiple: questionId => event => ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, [...event.target.options].filter(({selected}) => selected).map(({value}) => value)))(),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreDialogueSurvey);
