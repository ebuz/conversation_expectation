import React from 'react';
import { connect } from 'react-redux';

import { finishTask } from '../actions';

class Recall extends React.Component {
    componentDidMount() {
    };
    componentDidUpdate(prevProps) {
    };
    componentWillUnmount() {
    };
    render() {
        return(
            <div className="Break-box">
                <p>This is just a short break before the next conversation. When you are ready to continue please press the button below.</p>
                <button type='button' onClick={this.props.onFinished} className="Recall-button"
                >
                        End break
                </button>
        </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        onFinished: ownProps.dispatchAction(finishTask(ownProps.id)),
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recall);
