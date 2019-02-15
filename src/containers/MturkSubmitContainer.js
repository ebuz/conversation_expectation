import React from 'react';
import { connect } from 'react-redux';
import { mapToJSON } from '../actions';

const MturkSubmit = ({turkSubmitTo, assignmentId, experimentalData}) => {
    return (
        <div className="MturkSubmit-box">
            <p>Thank you for participating in this study, your conversation will directly contribute to our understanding of human interaction. If after the study you have any questions about the study or our findings, do not hesitate to contact us.</p>
            <p>We know that MTurkers like to share their experiences with other MTurkers about the HITs and requesters they have work with. If you plan to share your experience, we request that you not divulge too many details about this study. We want to better understand how people converse based on their expectations about the conversation and their partners. Sharing too many details about our studies with others who may participate in the future may affect the expectations they have in ways that would influence the usefulness of the data we collect. Thank you for your understanding.</p>
            <form action={turkSubmitTo} method='post'>
                    <input type='hidden' id='assignmentId' name='assignmentId' value={assignmentId} />
                    <input type='hidden' id='data' name='data' value={JSON.stringify(experimentalData)} />
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
    )
};



const extractData = ({studyName, studyCondition, studyIdCode,
    dialogueTimeExpectations, dialogueTimeLimit, preDialogueAnswersById,
    preDialoguePartnerAnswersById, dialogueStatus, dialogueFileName, recallData,
    surveyData, otherData}) => ({
        studyName, studyCondition, studyIdCode,
        dialogueTimeExpectations, dialogueTimeLimit,
        preDialogueAnswersById: mapToJSON(preDialogueAnswersById),
        preDialoguePartnerAnswersById: mapToJSON(preDialoguePartnerAnswersById),
        dialogueFileName, recallData, surveyData,
        otherData
});

const mapStateToProps = (state) => {
    return {
        turkSubmitTo: state.mturkData.turkSubmitTo,
        assignmentId: state.mturkData.assignmentId,
        experimentalData: {
            ...state.mturkData,
            selfId: state.switchboardData.selfId,
            peerId: state.switchboardData.candidatePeerId,
            ...extractData(state.experimentalData),
        }
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MturkSubmit)
