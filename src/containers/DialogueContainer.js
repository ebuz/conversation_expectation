import React from 'react';
import { connect } from 'react-redux';

import RemovePartnerContainer from './RemovePartnerContainer';
import IceBreakerRecallContainer from './IceBreakerRecallContainer';
import TopicsSelectContainer from './TopicsSelectContainer';
import RecallContainer from './RecallContainer';
import DialogueBreakContainer from './DialogueBreakContainer';
import PreDialogueContainer from './PreDialogueContainer';
import ConversationContainer from './ConversationContainer';
import { finishTask, startTask, taskAction } from '../actions';

const taskToContainer = new Map([
    ['findPartner', PreDialogueContainer],
    ['dialogueIcebreakers', PreDialogueContainer],
    ['dialogue1', ConversationContainer],
    ['dialogue2', ConversationContainer],
    ['dialogue3', ConversationContainer],
    ['potentialTopics', TopicsSelectContainer],
    ['potentialTopicsRecall', TopicsSelectContainer],
    ['dialogueBreak', DialogueBreakContainer],
    ['icebreakersRecall', IceBreakerRecallContainer],
    ['dialogue1Recall', RecallContainer],
    ['removePartner', RemovePartnerContainer]
]);

class Dialogue extends React.Component {
    componentDidMount() {
        this.props.onStarted(this.props.id)();
        if(this.props.dialogueTasksById[this.props.currentTask].started === false){
            this.props.onAction(this.props.id)(startTask(this.props.currentTask))();
        }
    };
    componentDidUpdate(prevProps) {
        if(this.props.currentTask && this.props.dialogueTasksById[this.props.currentTask].started === false){
            this.props.onAction(this.props.id)(startTask(this.props.currentTask))();
        }
        if(this.props.dialogueTasks.every(task => this.props.dialogueTasksById[task].finished)){
            if(!prevProps.dialogueTasks.every(task => prevProps.dialogueTasksById[task].finished)){
                this.props.onFinished(this.props.id)();
            }
        }
    };
    componentWillUnmount() {
    };

    render() {
        if(this.props.currentTask){
            return(
                <div className="Dialogue-box">
                    {this.props.currentContainer ? <this.props.currentContainer dispatchAction={this.props.onAction(this.props.id)} wrappedTaskAction={this.props.wrapTaskAction(this.props.id)} {...this.props.dialogueTasksById[this.props.currentTask]}/>: null}
                </div>
            )
        }
        return(
            <div className="Dialogue-box">
                <p>
                    no tasks left
                </p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { ...state.experimentTasksById['dialogue'],
        currentTask: state.experimentTasksById['dialogue'].dialogueTasks.find(block => state.experimentTasksById['dialogue'].dialogueTasksById[block].finished === false),
        currentContainer: taskToContainer.get(state.experimentTasksById['dialogue'].dialogueTasks.find(block => state.experimentTasksById['dialogue'].dialogueTasksById[block].finished === false)),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: id => () => dispatch(finishTask(id)),
        onStarted: id => () => dispatch(startTask(id)),
        wrapTaskAction: id => action => taskAction(id, action),
        onAction: id => action => () => dispatch(taskAction(id, action))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialogue);
