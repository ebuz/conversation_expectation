import React from 'react';
import { connect } from 'react-redux';

const msToTime = s => {
    // Pad to 2 or 3 digits, default is 2
    const pad = (n, z = 2) => ('00' + n).slice(-z);
    const hr = pad(s/3.6e6|0);
    return `${hr < 1 ? '' : hr + ':'}${pad((s%3.6e6)/6e4 | 0)}:${pad((s%6e4)/1000|0)}`;
}

const digitToOrd = new Map([
    [1, 'first'],
    [2, 'second'],
    [3, 'third'],
    [4, 'fourth'],
]);

const digitToAdj = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
    [4, 'four'],
]);

const dialogueCountMsg = (current, dialogues) => {
    if(dialogues.length === 1)
        return 'This will be your only conversation with your partner. ';
    return `This is the ${digitToOrd.get(dialogues.indexOf(current) + 1)} of ${digitToAdj.get(dialogues.length)} conversations with your partner. `;
}

class DialogueTimer extends React.Component {
    componentDidUpdate(prevProps) {
    }

    render() {
        return <div className="DialogueTimer-box">
                {dialogueCountMsg(this.props.id, this.props.dialogueTaskIds)}Time left for talking: {msToTime(this.props.dialogueTimeLeft)}
        </div>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        dialogueTimeLeft: ownProps.dialogueTimeLimit - ownProps.dialogueTime,
        dialogueTaskIds: state.experimentTasksById['dialogue'].dialogueTasks.filter(t => t.search(/dialogue\d$/) === 0)
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogueTimer);
