import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import websocket from '@giantmachines/redux-websocket';
import { middleware as rpcMiddleWare } from '@ebuz/redux-peer-connection';

import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from '../reducers';

import mturkEnhancer from './mturkEnhancer';

export default function configureStore(initialState) {
    const store = createStore(
        reducer,
        initialState,
        composeWithDevTools(
            mturkEnhancer,
            applyMiddleware(websocket, rpcMiddleWare, thunk, createLogger()),
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};
