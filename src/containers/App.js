import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import SwitchboardStatusContainer from './SwitchboardStatusContainer';
import ErrorDetailsContainer from './ErrorDetailsContainer';
import IntroductionContainer from './IntroductionContainer';
import ConsentContainer from './ConsentContainer';
import MicSetupContainer from './MicSetupContainer';
import MicCheckContainer from './MicCheckContainer';
import PreDialogueContainer from './PreDialogueContainer';
import DialogueContainer from './DialogueContainer';
import RecallContainer from './RecallContainer';
import MturkSubmitContainer from './MturkSubmitContainer';

const App = ({currentBlock}) => {
    let currentBlockContainer = <IntroductionContainer />;
    switch(currentBlock){
        case 'introduction':
            currentBlockContainer = <IntroductionContainer />;
            break;
        case 'consent':
            currentBlockContainer = <ConsentContainer />;
            break;
        case 'micSetup':
            currentBlockContainer = <MicSetupContainer />;
            break;
        case 'micCheck':
            currentBlockContainer = <MicCheckContainer />;
            break;
        case 'preDialogue':
            currentBlockContainer = <PreDialogueContainer />;
            break;
        case 'dialogue':
            currentBlockContainer = <DialogueContainer />;
            break;
        case 'recall':
            currentBlockContainer = <RecallContainer />;
            break;
        case 'submission':
            currentBlockContainer = <MturkSubmitContainer />;
            break;
        default:
            currentBlockContainer = <ErrorDetailsContainer />;
    }
    return(
        <div className="App-box">
            {currentBlockContainer}
            <SwitchboardStatusContainer />
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        currentBlock: state.experimentBlocks.find(block => state.blocksById[block].finished === false),
    }
};

export default connect(mapStateToProps)(App);
