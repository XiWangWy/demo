/**
 * Created by wangxi on 18/9/20.
 */
import React from 'react';
import { Component } from 'react';
import {Table} from 'antd';
import Tools from  '../../Tools'

class TaskList extends Component {


    constructor(props){
        super(props);
        this.state = {
            list: props.list
        }
    }

    componentWillReceiveProps(props){
        this.setState(
            {
                list: props.list
            }
        )
    }

    columns = [
        {
            title: '项目名称',
            dataIndex: 'boxId',
            key: 'boxId',
            render: text => <a href="javascript:;">{text}</a>,
        },
        {
            title: '任务数',
            dataIndex: 'tasks',
            key: 'tasks',
            render: text => <a href="javascript:;">{text}</a>,
        },
        {
            title: '词数量',
            dataIndex: 'wordCount',
            key: 'wordCount',
            render: text => <a href="javascript:;">{text}</a>,
        },
        {
            title: '完成状态',
            dataIndex: 'state',
            key: 'state',
            render: text => <a href="javascript:;">{text}</a>,
        },
        // {
            // title: '完成状态',
            // dataIndex: 'userIds',
            // key: 'userIds',
            // render: text => <a href="javascript:;">{text}</a>,
        // }
    ]

    render(){

        return(
            <Table bordered  columns={this.columns} dataSource={this.state.list} onRow={this.onRow.bind(this)}/>
        );
    }

    onRow(record){
        return {
            onClick: ()=>{
                console.log(record)
                // this.props.history.push("/task/detail");
                this.props.history.push({
                    pathname:"/task/detail",
                    // projectName:record['boxId'],
                    users:record['userIds']
                });
                Tools.setStoryageItem('projectName',record['boxId'])
                Tools.setStoryageItem('taskBatchNo',record['taskBatchNo'])
            }
        }
    }


}

export default TaskList;