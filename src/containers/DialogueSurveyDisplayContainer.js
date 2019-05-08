import React from 'react';
import { connect } from 'react-redux';

const DialogueSurveyAnswerDisplay = ({preDialogueQuestions, preDialogueAnswersById, preDialoguePartnerAnswersById}) => {
    return(
        <div className="DialogueSurveyAnswerDisplay-box">
            <table className="DialogueSurveyAnswerDisplay-table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Your answer</th>
                        <th>Your partner's answer</th>
                    </tr>
                </thead>
                <tbody>
                    {preDialogueQuestions.map((item, i) =>
                        (<tr key={`tr${i}`}>
                            <td key={`tr${i}_q`}>{item.label}</td>
                            <td key={`tr${i}_a1`}>{preDialogueAnswersById.get(item.questionId)}</td>
                            <td key={`tr${i}_a2`}>{preDialoguePartnerAnswersById.get(item.questionId)}</td>
                        </tr>)
                    )}
                </tbody>
            </table>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        preDialogueQuestions: state.experimentTasksById['dialogue'].dialogueTasksById['dialogueIcebreakers'].preDialogueQuestions,
        preDialogueAnswersById: state.experimentTasksById['dialogue'].dialogueTasksById['dialogueIcebreakers'].data.answersById,
        preDialoguePartnerAnswersById: state.experimentTasksById['dialogue'].dialogueTasksById['dialogueIcebreakers'].data.partnerAnswersById,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DialogueSurveyAnswerDisplay);
