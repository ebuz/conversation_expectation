import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import Ad from './containers/Ad';
import Hit from './containers/Hit';
// import App from './containers/App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux'

import configureStore from './store/configureStore';

const store = configureStore();

const rootElement = document.getElementById('root')
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path='/hit' component={Hit} />
                <Route exact path='/' component={Ad} />
                <Redirect to={'/' + window.location.search} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    rootElement
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
