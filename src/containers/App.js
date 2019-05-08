import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import SwitchboardStatusContainer from './SwitchboardStatusContainer';
import ErrorDetailsContainer from './ErrorDetailsContainer';
import IntroductionContainer from './IntroductionContainer';
import ConsentContainer from './ConsentContainer';
import MicSetupContainer from './MicSetupContainer';
import MicCheckContainer from './MicCheckContainer';
import DialogueContainer from './DialogueContainer';
import MturkSubmitContainer from './MturkSubmitContainer';

const taskToContainer = new Map([
    ["introduction", <IntroductionContainer />],
    ["consent", <ConsentContainer />],
    ["micSetup", <MicSetupContainer />],
    ["micCheck", <MicCheckContainer />],
    ["dialogue", <DialogueContainer />],
    ["submission", <MturkSubmitContainer />]
]);

const App = ({currentTask, currentContainer}) => {
    if(currentContainer){
        return(
            <div className="App-box">
                {currentContainer}
                <SwitchboardStatusContainer />
            </div>
        )
    }
    return(
        <div className="App-box">
            <ErrorDetailsContainer />
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        currentTask: state.experimentTasks.find(block => state.experimentTasksById[block].finished === false),
        currentContainer: taskToContainer.get(state.experimentTasks.find(block => state.experimentTasksById[block].finished === false)),
    }
};

export default connect(mapStateToProps)(App);
