import React from 'react';
import { connect } from 'react-redux';

const ErrorDetails = ({studyIdCode}) => {
    return(
        <div className="ErrorDetails-box">
            <p>The study has gotten into an unusual state and it cannot continue.</p>
            <p>please contact the HIT requester for help. Include reference code {studyIdCode}.</p>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        ...state.experimentalData,
        studyIdCode: state.experimentalTasksById['dialogue'].studyIdCode
    }
};

export default connect(mapStateToProps)(ErrorDetails);
