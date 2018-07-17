import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Login from './routes/Login';
// import MyTest from './routes/Test';

import {
    Router,
    Route,
    Link
} from 'react-router-dom'

import history from './history';

ReactDOM.render(
    <Router history={history}>
        <div>
            <Route exact path="/" component={App} />
            <Route path='/login' component={Login} >


            </Route>




        </div>
        {/*<App/>*/}
    </Router>
    , document.getElementById('root'));
registerServiceWorker();
