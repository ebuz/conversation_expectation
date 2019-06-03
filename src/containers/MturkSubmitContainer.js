import React from 'react';
import { connect } from 'react-redux';

class MturkSubmit extends React.Component {
    componentDidMount() {
        let form = new FormData();
        form.append('assignmentId', this.props.assignmentId);
        form.append('data', this.props.experimentalData);
        let postURL = process.env.PUBLIC_URL;
        if(postURL === null)
            postURL = '/';
        if(postURL.endsWith('/'))
            postURL = `${postURL}mturk/externalSubmit`;
        else
            postURL = `${postURL}/mturk/externalSubmit`;
        fetch(postURL,
            {
            method: 'POST',
            body: form
        });
    };
    componentDidUpdate(prevProps) {
    };
    componentWillUnmount() {
    };

    render() {
        let adjustTurkSubmit = this.props.turkSubmitTo.endsWith('/') ? `${this.props.turkSubmitTo}mturk/externalSubmit` : `${this.props.turkSubmitTo}/mturk/externalSubmit`;
        return <div className="MturkSubmit-box">
            <p>Thank you for participating in this study, your conversation will directly contribute to our understanding of human interaction. If after the study you have any questions about the study or our findings, do not hesitate to contact us.</p>
            <p>We know that MTurkers like to share their experiences with other MTurkers about the HITs and requesters they have work with. If you plan to share your experience, we request that you not divulge too many details about this study. We want to better understand how people converse based on their expectations about the conversation and their partners. Sharing too many details about our studies with others who may participate in the future may affect the expectations they have in ways that would influence the usefulness of the data we collect. Thank you for your understanding.</p>
            <form action={adjustTurkSubmit} method='post'>
                    <input type='hidden' id='assignmentId' name='assignmentId' value={this.props.assignmentId} />
                    <input type='hidden' id='data' name='data' value={this.props.experimentalData} />
                    <label htmlFor='comment'>
                        Please leave any comments you might have for us. For example, how well did the study website work for you or how do you think it can be improved? Is there something we might want to know about yourself or your partner?
                        <br />
                        <textarea cols={60} rows={4} id='comment' name='comment' />
                    </label>
                    <br />
                    <input type='submit' value="Submit data & finish HIT"
                        className="MturkSubmit-button GreenButton CenterButton"
                    />
            </form>
        </div>
    }
}

const extractDialogueData = dialogue => {
    return {
        dialogueCondition: dialogue.dialogueCondition,
        studyIdCode: dialogue.studyIdCode,
        taskData: dialogue.dialogueTasks.map(taskId => {
            let parsedTask = dialogue.dialogueTasksById[taskId];
            if(parsedTask.data.hasOwnProperty('answersById'))
                parsedTask.data.answersById = [...parsedTask.data.answersById];
            if(parsedTask.data.hasOwnProperty('partnerAnswersById'))
                parsedTask.data.partnerAnswersById = [...parsedTask.data.partnerAnswersById];
            return parsedTask
        })
    };
};

const mapStateToProps = (state) => {
    return {
        turkSubmitTo: state.mturkData.turkSubmitTo || '/',
        assignmentId: state.mturkData.assignmentId,
        experimentalData: JSON.stringify({
            ...state.mturkData,
            ...state.experimentalData,
            selfId: state.switchboardData.selfId,
            peerId: state.switchboardData.candidatePeerId,
            dialogueData: extractDialogueData(state.experimentTasksById['dialogue']),
            switchboardMessages: state.switchboardData.messages,
            selfSignalData: state.switchboardData.selfSignalData,
            peeringConstraints: state.switchboardData.peeringConstraints,
            peeringData: state.switchboardData.peeringData,
        })
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MturkSubmit)
