/**
 * Created by wangxi on 18/7/20.
 */

import React from 'react';
import { Component } from 'react';
import './App.css';
import Fetch from './Fetch';
import { Button,Input,Select,message} from 'antd';

const Option = Select.Option;


class Add extends Component {

    constructor(props){
        super(props);
        this.state = {
            word:"",
            type:""
        }
    }

    onChange(e){
        this.state.word = e.target.value;
    }

    onClick(e){
        var obj = {};
        obj['type'] = this.state.type;
        obj['word'] = this.state.word;
        Fetch.fetchPost('/insertType',obj,(reObj)=>{
            if(reObj['msg'] === "数据插入成功！"){
                message.success("添加成功")
                this.setState({
                    word:"",
                    type:""
                })
            }else {
                message.error("添加失败")
            }

        })
    }

    handleSelectChangeItem(value){
        this.state.type = value;
    }

    render() {
        return (
            <div className="App">
                <div>
                    <Button type="primary" style={{margin:"10px"}}>词</Button>
                    <Input className='ProjectId'  onChange={this.onChange.bind(this)}/>
                    <Select  style={{ width: 120 }}  onSelect={this.handleSelectChangeItem.bind(this)}>
                        <Option value="症状">症状</Option>
                        <Option value="化验">化验</Option>
                    </Select>
                </div>


                <Button type="primary" style={{margin:"10px"}} onClick={()=>{this.onClick(this)}}>添加至数据库</Button>

            </div>
        );
    }
}

export default Add;