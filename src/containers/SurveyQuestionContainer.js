import React from 'react';
import { connect } from 'react-redux';
import { updateQuestionValue } from '../actions';

const numberStringEqCheck = (v1, v2) => {
    return v1 === v2 || v1.toString() === v2 || v1 === v2.toString();
};

const SurveyQuestion = ({dataField, questionId, question, answer, handleOnChange, handleOnChangeMultiple}) => {
    let questionDiv = <div />;
    let {questionType, label, defaultValue, ...subparts} = question;
    switch (questionType){
        case 'select':
            questionDiv =
                <div className="SelectQuestion-box">
                    <label htmlFor={questionId}>{label}</label><br />
                    <select name={questionId} multiple={subparts.multiple}
                        value={answer || defaultValue}
                        onChange={subparts.multiple ? handleOnChangeMultiple : handleOnChange}>
                        {subparts.options.map((item, index) => {
                            return (
                                <option key={index} value={item}
                                >{item}</option>
                            )
                        })
                        }
                    </select>
                </div>
            break;
        case 'input':
            questionDiv =
                <div className="InputQuestion-box">
                    <label htmlFor={questionId}>{label}</label><br />
                    <input {...subparts} value={answer || defaultValue} onChange={handleOnChange}/>
                </div>
            break;
        case 'textarea':
            questionDiv =
                <div className="TextareaQuestion-box">
                    <label htmlFor={questionId}>{label}</label><br />
                    <textarea {...subparts} value={answer || defaultValue} onChange={handleOnChange}/>
                </div>
            break;
        case 'likert':
            let likertRange = Array.from(new Array(subparts.range[1] - subparts.range[0] + 1),
                (v, i) => i + subparts.range[0]);
            questionDiv =
                <div className="LikertQuestion-box">
                    <label htmlFor={questionId}>{label}</label><br />
                    <ul className="LikertQuestion-list">
                        {likertRange.map((item, index) => {
                            return(
                                <li key={index} >
                                    <label>
                                        <input type='radio' name={questionId} value={item}
                                            checked={numberStringEqCheck(answer, item)}
                                            onChange={handleOnChange}
                                        /> <br />
                                        {subparts.rangeLabels[index]}
                                    </label>
                                </li>
                            )
                        })
                        }
                    </ul>
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
        handleOnChange: (event) => {
            dispatch(
                updateQuestionValue(ownProps.dataField, ownProps.questionId,
                    event.target.value));
        },
        handleOnChangeMultiple: (event) => {
            dispatch(
                updateQuestionValue(ownProps.dataField, ownProps.questionId,
                    [...event.target.options].filter(({selected}) => selected).map(({value}) => value)));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SurveyQuestion);
