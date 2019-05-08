import React from 'react';
import { connect } from 'react-redux';

// import DialogueBlocksContainer from './DialogueBlocksContainer';
import { removePartner } from '../actions';

class RemovePartner extends React.Component {
    componentDidMount() {
        this.props.onMount();
    };
    componentDidUpdate(prevProps) {
    };
    componentWillUnmount() {
    };

    render() {
        return(
            <div className="RemovePartner-box">
                <p>
                    Removing partner
                </p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMount: () => dispatch(removePartner())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemovePartner);
