import React from 'react';
import { connect } from 'react-redux';

import { finishBlock } from '../actions';

const isInPreview = ({assignmentId, workerId, hitId, turkSubmitTo}) => {
    let result = ['ASSIGNMENT_ID_NOT_AVAILABLE', 'assignment_id_not_available']
                .indexOf(assignmentId) >= 0
    let missingParams = [workerId, turkSubmitTo].filter(
        (param) => param === undefined || param === null || ''
    )
    return result || missingParams.length > 0
}

const Consent = ({instructions, blockId, consentFileURL, onFinished, inPreview}) => {
    return(
        <div className="Consent-box">
            <p>Please read our <a href={consentFileURL} target="_blank" rel="noopener noreferrer">consent form</a>.</p>
            <p>{instructions}</p>
            <button type='button' onClick={onFinished(blockId)} disabled={inPreview}
                className="Consent-button"
            >
                {inPreview ? 'Please accept hit if you would like to participate' : 'I consent to participate'}
            </button>
        </div>
    )
};

const mapStateToProps = (state) => {
    return { ...state.blocksById['consent'],
        inPreview: isInPreview(state.mturkData)
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onFinished: (blockId) => () => dispatch(finishBlock(blockId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Consent);
