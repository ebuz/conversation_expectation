import React from 'react';
import { connect } from 'react-redux';

const SurveyAnswer = ({questionId, question, answer}) => {
    let questionDiv = <div />;
    let {questionType, label, defaultValue, ...subparts} = question;
    switch (questionType){
        case 'select':
                    // not sure how it will render for multiple select
            questionDiv =
                <div className="SelectAnswer-box">
                    <p>{label}: {answer}</p>
                </div>
            break;
        case 'input':
            questionDiv =
                <div className="InputAnswer-box">
                    <p>{label}: {answer}</p>
                </div>
            break;
        case 'textarea':
            questionDiv =
                <div className="TextareaAnswer-box">
                    <label htmlFor={questionId}>{label}</label><br />
                    <textarea {...subparts} disabled={true} value={answer} />
                </div>
            break;
        case 'likert':
            questionDiv =
                <div className="LikertAnswer-box">
                    <p>{label}: {answer} out of {subparts.range[1]}</p>
                </div>
            break;
        default:
            questionDiv = <div />;
    }
    return(questionDiv);
}

const mapStateToProps = (state, ownProps) => {
    return {
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SurveyAnswer);
