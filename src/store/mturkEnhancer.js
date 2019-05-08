import ReduxQuerySync from 'redux-query-sync';
import * as types from '../actionTypes'

export default ReduxQuerySync.enhancer({
    params: {
        workerId: {
            selector: state => state.mturkData.workerId,
            action: value => ({type: types.MTURKWORKERID, workerId: value}),
            defaultValue: 'bar'
        },
        hitId: {
            selector: state => state.mturkData.hitId,
            action: value => ({type: types.MTURKHITID, hitId: value}),
            defaultValue: 'foo'
        },
        assignmentId: {
            selector: state => state.mturkData.assignmentId,
            action: value => ({type: types.MTURKASSIGNMENTID, assignmentId: value}),
            defaultValue: 'ASSIGNMENT_ID_NOT_AVAILABLE'
        },
        turkSubmitTo: {
            selector: state => state.mturkData.turkSubmitTo,
            action: value => ({type: types.MTURKSUBMITTO, turkSubmitTo: value}),
            defaultValue: process.env.PUBLIC_URL
        },
    },
    initialTruth: 'location',
    replaceState: true

});
