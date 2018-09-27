import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Form } from 'antd';
import AlignLogin from  './routes/alignment/AlignLogin';
import SourceMaterial from  './routes/alignment/SourceMaterial';
import Task from  './routes/alignment/Task';
import TaskDetail from  './routes/alignment/TaskDetail';
import Examine from  './routes/alignment/Examine';

import registerServiceWorker from './registerServiceWorker';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import {
    Router,
    Route
} from 'react-router-dom'

import history from './history';

const WrappedNormalLoginForm = Form.create()(AlignLogin);

ReactDOM.render(
    <Router history={history}>
        <div>
            <Route exact path="/login" component={WrappedNormalLoginForm} />



            <CacheSwitch>
                <CacheRoute exact path="/task" component={Task} when="always"/>
                <Route path='/source' component={SourceMaterial} />
                <Route path='/exam' component={Examine}  />
                <CacheRoute exact path='/task/detail'  component={TaskDetail} when="forward"/>
            </CacheSwitch>



        </div>
    </Router>
    , document.getElementById('root'));
registerServiceWorker();
