import React from 'react';
import { connect } from 'react-redux';

import throttle from 'lodash.throttle';

import { finishTask, recallData } from '../actions';

const throttleValidityChecker = throttle((recallData) => {
    if(recallData === null || recallData === '') return false;
    return true;
}, 1000, {leading: true, trailing: true});

const recallTimeMinimum = 2 * 60; //two minutes

class Recall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalTimer: setTimeout(() => {
                this.timeUp();
            }, recallTimeMinimum * 1000),
            tickTimer: setInterval(() => {
                this.tick();
            }, 1000),
            time: recallTimeMinimum
        };
    }
    tick(){
        this.setState({ ...this.state,
            time: this.state.time - 1
        });
    }
    timeUp(){
        clearTimeout(this.state.tickTimer);
        this.setState({ ...this.state,
            time: - 10
        });
    }
    componentDidMount() {
    };
    componentDidUpdate(prevProps) {
    };
    componentWillUnmount() {
        clearTimeout(this.state.totalTimer);
        this.timeUp();
    };

    render() {
        const disableButton = this.state.time > 0 || !this.props.recallDataValid;
        let buttonMsg = 'Save your transcript and continue';
        if(this.state.time > 0){
            buttonMsg = `Please continue transcribing for ${this.state.time} more seconds`;
        } else if(this.props.recallDataValid){
            buttonMsg = 'Please transcribe what you recall';
        }
        return(
            <div className="Recall-box">
                <div className="RecallInstructions-box">
                    <p>Now that the conversation is over, we would like you to spend at least the next two minutes transcribing the conversation. Try to write out what you and your partner said as close as possible to how you remember it. Start each line with who is speaking, using "me:" and "them:" to denote who is talking. Do not write a summary, we want as close to a word-for-word transcript as you can recal. Here is an example:</p>
                    <blockquote>
                        <p>me: Well I prefer to drink water though sometimes the tap water doesn't taste very good</p>
                        <p>them: I know what you mean, mine doesn't taste very good so I use one of those filters</p>
                        <p>me: Oh I should buy one too</p>
                        <p>[...]</p>
                    </blockquote>
                </div>
                <p>Provide your transcript here:</p>
                <textarea wrap="soft" cols={60} rows={6} value={this.props.data.transcript} onChange={this.props.handleOnChange} />
                <br />
                <button type='button' onClick={this.props.onFinished} disabled={disableButton}
                    className="Recall-button"
                >
                    {buttonMsg}
                </button>
        </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        recallDataValid: throttleValidityChecker(ownProps.data.transcript),
        onFinished: ownProps.dispatchAction(finishTask(ownProps.id)),
        handleOnChange: (event) => ownProps.dispatchAction(recallData(ownProps.id, event.target.value))(),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recall);
