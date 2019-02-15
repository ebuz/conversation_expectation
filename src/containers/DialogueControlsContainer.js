import React from 'react';
import { connect } from 'react-redux';

import { readyToDialogue, askToStartDialogue, notifyPartnerReady } from '../actions';

// dialogueLifeCycle:
//     not ready & partner not ready
//     ready & partner not ready || not ready & partner ready
//     ready & partner ready
//     not-started
//     in-progress
//     ended

const generateDialogueState = ({ready, partnerReady, started, ended}) => {
    if(ended) return 'ended';
    if(started) return 'inprogress';
    if(ready && partnerReady) return 'readyToStart';
    if(!ready) return 'notReady';
    if(!partnerReady) return 'partnerNotReady';
    return 'inital';
}

class DialogueControls extends React.Component {
    componentDidUpdate(prevProps) {
        if(this.props.dialogueState !== prevProps.dialogueState && this.props.dialogueState === 'readyToStart' && prevProps.dialogueState === 'notReady'){
            this.props.askToStartDialogue();
        }
    }

    render() {
        if(this.props.dialogueState === 'notReady'){
            return <div>
                <button onClick={this.props.readyToDialogue}>
                    Click when ready to start talking
                </button>
                </div>;
        }
        if(this.props.dialogueState === 'partnerNotReady'){
            return <div><p>Waiting on partner to be ready. Do not leave this page!</p></div>
        }
        return <div><p>Dialogue in progress</p></div>
    }
}

const mapStateToProps = (state) => {
    return {
        dialogueState: generateDialogueState(state.experimentalData.dialogueStatus),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        askToStartDialogue: () => dispatch(askToStartDialogue()),
        readyToDialogue: () => {
            dispatch(readyToDialogue());
            dispatch(notifyPartnerReady());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogueControls);
