/**
 * Created by wangxi on 18/9/4.
 */

import React from 'react';
import { Component } from 'react';
import '../App.css';
import { Button,Upload,Icon,message,Select,Input} from 'antd';
import Fetch from '../Fetch.js'
import Tools from '../Tools'
import Contants from  '../Constants'
const Dragger = Upload.Dragger
const Option = Select.Option
class Login extends Component {

    constructor(props){
        super(props);

    }

    onClick(e){

    }

    render() {
        return (
            <div className="App">
                {/*ddddddddddddddd*/}
                {/*<Button type="primary" onClick={()=>{this.onClick(this)}}>Primary</Button>*/}


            </div>
        );
    }
}

export default Login;