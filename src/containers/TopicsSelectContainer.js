import React from 'react';
import { connect } from 'react-redux';

import { finishTask, updateQuestionValue } from '../actions';

import SurveyQuestionContainer from './SurveyQuestionContainer'

class TopicsSelect extends React.Component {
    componentDidMount() {
    };
    componentDidUpdate(prevProps) {
    };
    componentWillUnmount() {
    };

    render() {
        return(
            <div className="TopicsSelect-box">
                <SurveyQuestionContainer
                    handleOnChange={this.props.handleOnChange(this.props.topicsQuestion.questionId)}
                    handleOnChangeMultiple={this.props.handleOnChangeMultiple(this.props.topicsQuestion.questionId)}
                    questionId={this.props.topicsQuestion.questionId}
                    question={this.props.topicsQuestion}
                    answer={this.props.data.answersById.get(this.props.topicsQuestion.questionId)}
                />
                <button type='button' onClick={this.props.onFinished} disabled={!this.props.continueReady}
                    className="IceBreakerRecall-button"
                >
                    {this.props.continueReady ? 'Save your answer' : 'Please answer the question'}
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        onFinished: ownProps.dispatchAction(finishTask(ownProps.id)),
        continueReady: ownProps.data.answersById.get(ownProps.topicsQuestion.questionId),
        handleOnChange: questionId => event => {
            const answers = ownProps.data.answersById.get(questionId);
            if(answers && answers.includes(event.target.value)){
                ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, answers.filter(choices => choices !== event.target.value)))();
            } else if(answers){
                ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, answers.concat(event.target.value)))();
            } else {
                ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, [event.target.value,]))();
            }
        },
        handleOnChangeMultiple: questionId => event => ownProps.dispatchAction(updateQuestionValue(ownProps.id, questionId, [...event.target.options].filter(({selected}) => selected).map(({value}) => value)))(),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicsSelect);
