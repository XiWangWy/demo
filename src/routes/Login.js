/**
 * Created by wangxi on 18/7/10.
 */
import React from 'react';
import { Component } from 'react';
import '../App.css';
import { Button } from 'antd';
import history from '../history';
import Fetch from '../Fetch.js'

class Login extends Component {

   constructor(props){
       super(props);
       // this.state = {
       //
       //     dd:this.props.dd
       // }
       // console.log(this.props.location.state.aa);
   }

    onClick(e){
        // history.push(this.props.match.url + "/mytest");
        var obj = {'username':"wx"}
        Fetch.testPost("http://localhost:8000/findUser",obj,(obj)=>{
            console.log(obj.toString())
        })
    }

    render() {
        return (
            <div className="App">
                ddddddddddddddd
                <Button type="primary" onClick={()=>{this.onClick(this)}}>Primary</Button>

            </div>
        );
    }
}

export default Login;