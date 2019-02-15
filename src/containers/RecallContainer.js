import React from 'react';
import { connect } from 'react-redux';

import throttle from 'lodash.throttle';

import { finishBlock, recallData } from '../actions';

const throttleValidityChecker = throttle((recallData) => {
    if(recallData === null || recallData === '') return false;
    return true;
}, 1000, {leading: true, trailing: true});

const Recall = ({instructions, recallData, recallDataValid, handleOnChange, onFinish}) => {
    return (
        <div className="Recall-box">
            <div className="RecallInstructions-box">
                <p>We have intentionally cut short your conversation. We apologize if that was unexpected but we want to understand the dynamics of your conversation given how much time you believe it will last.</p>
                <p>Now that the conversation is over, please transcribe it in the box below to the best of your ability. Try to write out what you and your partner said as close as possible to how you remember it. Start each line with who is speaking, using "me:" and "them:" to denote who is talking. Do not write a summary, we want as close to a word-for-word transcript as you can recall. Here is an example:</p>
                <blockquote>
                    <p>me: Well I prefer to drink water though sometimes the tap water doesn't taste very good</p>
                    <p>them: I know what you mean, mine doesn't taste very good so I use one of those filters</p>
                    <p>me: Oh I should buy one too</p>
                    <p>[...]</p>
                </blockquote>
            </div>
            <p>Provide your transcript:</p>
            <textarea wrap="soft" cols={60} rows={6} value={recallData} onChange={handleOnChange} />
            <br />
            <button type='button' onClick={onFinish} disabled={!recallDataValid}
                className="Recall-button"
            >
                {recallDataValid ? 'Finished with recall' : 'Please type what you remember'}
            </button>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        instructions: state.blocksById['recall'].instructions,
        recallData: state.experimentalData.recallData,
        recallDataValid: throttleValidityChecker(state.experimentalData.recallData)
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleOnChange: (event) => dispatch(recallData(event.target.value)),
        onFinish: () => dispatch(finishBlock('recall')),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recall);
