import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import ErrorDetailsContainer from './ErrorDetailsContainer';
import IntroductionContainer from './IntroductionContainer';
import ConsentContainer from './ConsentContainer';
import MicSetupContainer from './MicSetupContainer';
import MicCheckContainer from './MicCheckContainer';

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
        default:
            currentBlockContainer = <ErrorDetailsContainer />;
    }
    return(
        <div className="App-box">
            {currentBlockContainer}
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        currentBlock: state.experimentBlocks.find(block => state.blocksById[block].finished === false)
    }
};

export default connect(mapStateToProps)(App);
