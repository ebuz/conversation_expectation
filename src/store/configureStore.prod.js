import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import websocket from '@giantmachines/redux-websocket';
import { middleware as rpcMiddleWare } from '@ebuz/redux-peer-connection';

import reducer from '../reducers';

import mturkEnhancer from './mturkEnhancer';

export default function configureStore(initialState) {
    return createStore(
        reducer,
        initialState,
        compose(mturkEnhancer, applyMiddleware(websocket, rpcMiddleWare, thunk, createLogger()))
    );
};
