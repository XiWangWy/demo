/**
 * Created by wangxi on 18/7/13.
 */
import React from 'react';
import { Component } from 'react';
import '../App.css';
import { Button } from 'antd';



class Test extends Component {

    constructor(props){
        super(props);
        // console.log(this.props.location.state.aa);
    }


    render() {
        return (
            <div className="App">
                ddddddddddddddd
                <Button type="primary">MyTest</Button>
            </div>
        );
    }
}

export default Test;