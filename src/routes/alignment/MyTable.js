/**
 * Created by wangxi on 18/9/19.
 */
import React from 'react';
import { Component } from 'react';
import '../CSS/MyTable.css';
import {Checkbox,Table,Radio} from 'antd';
// const Option = Select.Option

class MyTable extends Component {

    constructor(props){
        super(props);
        this.dataChange = this.props.dataChange
        this.state = {
            data: props.data
        }
    }

    componentWillReceiveProps(props){
        this.setState(
            {
                data: props.data
            }
        )
    }

    columns = [
        {
            title: '是否为同义词',
            dataIndex: 'equalWord',
            key: 'equalWord',
            render: (text, record) => <Checkbox mykey = {record.key} checked = {record.equalWord} onChange={this.CheckBoxClick.bind(this)}></Checkbox>
        },
        {
            title: '词',
            dataIndex: 'word',
            key: 'word',
            render: text => <a href="javascript:;">{text}</a>,
        },
        {
            title: '是否是中心词',
            dataIndex: 'centerWord',
            key: 'centerWord',
            render: (text, record) => <Radio mykey = {record.key} checked = {record.word === record.centerWord} onChange={this.RadioButtonClick.bind(this)}></Radio>,
        }
    ]

    render(){
        return (
            <Table bordered  className= "tableStyle" columns={this.columns} dataSource={this.state.data} />
        );
    }

    /**
     * 同义词勾选
     * @param event
     * @constructor
     */
    CheckBoxClick(event){
        var key = event.target.mykey;
        console.log("CheckBoxClick你点击的行是" + key)
        this.toggleCheckState(key);
    }

    /**
     * 中心词勾选
     * @param event
     * @constructor
     */
    RadioButtonClick(event){
        var key = event.target.mykey;
        console.log("RadioButtonClick你点击的行是" + event.target.mykey)
        this.toggleRadioButtonState(key);
    }

    /**
     * 反置同义词勾选状态
     * @param key
     */
    toggleCheckState(key){
        var newData =  this.props.data
        newData.map((value) => {
            if (value['key'] === key){
                value['equalWord'] = !value['equalWord'];
                if (!value['equalWord']){
                    value['centerWord'] = "";
                }
            }
        })
        this.setState({
            data: newData
        })

        this.dataChange(newData);
    }

    /**
     * 反置同中心词勾选状态
     * @param key
     */
    toggleRadioButtonState(key){
        var newData =  this.props.data
        newData.map((value) => {
            if (value['key'] === key){
                value['centerWord'] = value['word'];
            }else {
                value['centerWord'] = "";
            }
        })
        this.setState({
            data: newData
        })

        this.dataChange(newData);
    }


}

export default MyTable;