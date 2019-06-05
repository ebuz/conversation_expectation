import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import SwitchboardStatusContainer from './SwitchboardStatusContainer';
import ErrorDetailsContainer from './ErrorDetailsContainer';
import ErrorContainer from './ErrorContainer';
import IntroductionContainer from './IntroductionContainer';
import ConsentContainer from './ConsentContainer';
import MicSetupContainer from './MicSetupContainer';
import MicCheckContainer from './MicCheckContainer';
import DialogueContainer from './DialogueContainer';
import MturkSubmitContainer from './MturkSubmitContainer';

import { finishTask } from '../actions';

const taskToContainer = new Map([
    ["introduction", <IntroductionContainer />],
    ["consent", <ConsentContainer />],
    ["micSetup", <MicSetupContainer />],
    ["micCheck", <MicCheckContainer />],
    ["dialogue", <DialogueContainer />],
    ["error", <ErrorContainer />],
    ["submission", <MturkSubmitContainer />]
]);

class Hit extends React.Component {
    componentDidMount() {
        this.props.dispatchAction(finishTask('introduction'));
        this.props.dispatchAction(finishTask('consent'));
    }
    render() {
        if(this.props.currentContainer){
            return(
                <div className="Hit-box">
                    {this.props.currentContainer}
                    <SwitchboardStatusContainer />
                </div>
            );
        }
        return(
            <div className="App-box">
                <ErrorDetailsContainer />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        currentTask: state.experimentTasks.find(block => state.experimentTasksById[block].finished === false),
        currentContainer: taskToContainer.get(state.experimentTasks.find(block => state.experimentTasksById[block].finished === false)),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatchAction: (action) => dispatch(action),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Hit);
