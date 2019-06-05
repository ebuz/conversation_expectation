import React from 'react';
import { connect } from 'react-redux';
import './App.css';

// import ErrorDetailsContainer from './ErrorDetailsContainer';
import IntroductionContainer from './IntroductionContainer';
import ConsentContainer from './ConsentContainer';

import { openHITWindow } from './ConsentContainer';

const taskToContainer = new Map([
    ["introduction", <IntroductionContainer />],
    ["consent", <ConsentContainer />],
]);

const Ad = ({currentTask, currentContainer}) => {
    if(currentContainer){
        return(
            <div className="Ad-box">
                {currentContainer}
            </div>
        )
    }
    return(
        <div className="Ad-box">
            <p>Please complete the HIT in the pop-up window. You can close or navigate away from this page.</p>
            <p>If it was blocked by yourself or a pop-up blocker, you can press the button below to reopen.</p>
            <button type='button' onClick={openHITWindow}
                className="HIT-popup-button"
            >
                Launch HIT window
            </button>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        currentTask: state.experimentTasks.find(block => state.experimentTasksById[block].finished === false),
        currentContainer: taskToContainer.get(state.experimentTasks.find(block => state.experimentTasksById[block].finished === false)),
    }
};

export default connect(mapStateToProps)(Ad);
