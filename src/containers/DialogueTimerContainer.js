import React from 'react';
import { connect } from 'react-redux';

const msToTime = (s) => {
    // Pad to 2 or 3 digits, default is 2
    const pad = (n, z = 2) => ('00' + n).slice(-z);
    const hr = pad(s/3.6e6|0);
    return `${hr < 1 ? '' : hr + ':'}${pad((s%3.6e6)/6e4 | 0)}:${pad((s%6e4)/1000|0)}`;
}

class DialogueTimer extends React.Component {
    componentDidUpdate(prevProps) {
    }

    render() {
        return <div className="DialogueTimer-box">Time left to talk: {msToTime(this.props.dialogueTimeLeft)}</div>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        dialogueTimeLeft: ownProps.dialogueTimeLimit - ownProps.dialogueTime
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogueTimer);
