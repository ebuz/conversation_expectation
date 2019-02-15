import React from 'react';
import { connect } from 'react-redux';

import SurveyQuestionContainer from './SurveyQuestionContainer';
import SurveyAnswerContainer from './SurveyAnswerContainer';

const PreDialogueSurvey = ({preDialogueQuestions, preDialogueAnswersById, finishedPreDialogueQuestions}) => {
    let SurveyComponent = SurveyQuestionContainer;
    if(finishedPreDialogueQuestions){
        SurveyComponent = SurveyAnswerContainer;
    }
    return(
        <div className="PreDialogueSurvey-box">
            {preDialogueQuestions.map((item, i) =>
                (<SurveyComponent key={i}
                    dataField='preDialogueAnswersById'
                    questionId={item.questionId}
                    question={item}
                    answer={preDialogueAnswersById.get(item.questionId)}
                />)
            )}
                </div>
    );
};

const mapStateToProps = (state) => {
    return {
        preDialogueQuestions: state.blocksById['preDialogue'].preDialogueQuestions,
        preDialogueAnswersById: state.experimentalData.preDialogueAnswersById,
        finishedPreDialogueQuestions: state.blocksById['preDialogue'].finishedPreDialogueQuestions,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PreDialogueSurvey);
