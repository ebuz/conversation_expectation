import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../reducers';

import mturkEnhancer from './mturkEnhancer';

export default function configureStore(initialState) {
    return createStore(
        reducer,
        initialState,
        compose(mturkEnhancer, applyMiddleware(thunk))
    );
};
