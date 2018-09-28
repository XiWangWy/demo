/**
 * Created by wangxi on 18/9/19.
 */
import React from 'react';
import { Component } from 'react';
import '../CSS/Task.css';
// import MyTable from  './MyTable'
import Fetch from '../../Fetch.js'
import TaskList from  './TaskList';
import Contants from  '../../Constants'
import {Modal,Input, Button, Checkbox,Select, } from 'antd';
const Option = Select.Option
const confirm = Modal.confirm;

class Task extends Component{

    EntityTypeData = Contants.getAllEntityType();

    constructor(props){
        super(props);
        console.log(this.EntityTypeData)
        this.state = {
            currentEntityType:"空",
            currentNature: "空",
            boxId: "",
            type: "boxId",
            projectName: ""
        };
    }

    componentWillMount(){
        console.log(this.state)
        this._isMounted = true;
        var url = "/manage/projects";

        Fetch.get(url,(Obj)=>{
            if (this._isMounted){
                this.setState({
                    list: this.initData(Obj)
                });
            }
        })
    }


    componentWillUnmount(){
        this._isMounted = false;
    }


    render(){
        return(

            <div className="parent">
                {/*<div>*/}
                    {/*<Input placeholder = "项目名称" style={{ width:150,margin:"10px" }} onChange = {this.projectNameChange.bind(this)}></Input>*/}
                {/*</div>*/}

                <div>
                    <Select defaultValue = "boxId" style={{ width:150,margin:"10px" }} onSelect = {this.selectIdType.bind(this)}>
                        {
                            (()=>{
                                let array = [];
                                let ids = ["boxId","PPID"];
                                for(var i = 1 ;i < ids.length ;i++){
                                    array.push(<Option key = {ids[i]} value={ids[i]}>{ids[i]}</Option>)
                                }
                                return array;
                            })()
                        }
                    </Select>
                    <Input className="boxIdStyle" placeholder = "boxId" onChange={this.BoxIdChange.bind(this)}></Input>
                    <Select defaultValue = {this.state.currentEntityType} style={{ width:150,margin:"10px" }} onSelect = {this.entityType.bind(this)}>
                        {
                            (()=>{
                                let array = [];
                                for(var i = 0 ;i < this.EntityTypeData.length ;i++){
                                    array.push(<Option key = {this.EntityTypeData[i]} value={this.EntityTypeData[i]}>{this.EntityTypeData[i]}</Option>)
                                }
                                return array;
                            })()
                        }
                    </Select>
                    <Select defaultValue = {this.state.currentNature} style={{ width: 150,margin:"10px" }} onSelect = {this.entityNature.bind(this)}>
                        {
                            (()=>{
                                let array = [];
                                var natures = Contants.getName(this.state.currentEntityType);
                                for(var i = 0 ;i < natures.length ;i++){
                                    array.push(<Option key = {natures[i]} value={natures[i]}>{natures[i]}</Option>)
                                }
                                return array;
                            })()
                        }
                    </Select>
                    <Button type = "primary" onClick={this.getSoure.bind(this)}>获取对齐素材</Button>
                </div>

                <div className = "taskList">
                    <TaskList list = {this.state.list} {...this.props}></TaskList>
                </div>
            </div>
        );
    }

    /**
     * 暂时弹框
     * @returns {Promise.<T>}
     */
    showConfirm(params,callBack) {
        confirm({
            title: '已经存在相同的项目',
            content: '点击确认将覆盖当前项目',
            onOk() {
                var replaceUrl = "/manage/replace/project";
                Fetch.fetchPost(replaceUrl,params,(Obj)=>{
                    console.log(Obj)
                    var url = "/manage/projects";
                    Fetch.get(url,(Obj)=>{
                        callBack(Obj)
                    })
                })
            },
            onCancel() {},
        });
    }

    /**
     * 按钮点击事件
     * @param event
     */
    getSoure(event){
        console.log("你点击了获取对齐素材按钮！")
        console.log(this.state)
        var boxIds = [];
        if (this.state.boxId.split(/[,，]/).length !== 0){
            boxIds = this.state.boxId.split(/[,，]/);
        }else {
            boxIds.push(this.state.boxId)
        }
        console.log("boxIds ==> " + boxIds);

        //调服务器接口 返回参数 传给列表UI

        var params = {};
        params['boxIds'] = boxIds;
        params['entityType'] = this.state.currentEntityType;
        params['field'] = this.state.currentNature;
        params['dataBase'] = 'DPS';

        var url = "/manage/create/project";
        Fetch.fetchPost(url,params,(Obj)=>{
            console.log(Obj)
            if(Obj === "2"){
                this.showConfirm(params,(Obj)=>{
                    this.setState({
                        list:this.initData(Obj)
                    });
                });
            }else {
                //重新获取所有数据
                var url = "/manage/projects";
                Fetch.get(url,(Obj)=>{
                    this.setState({
                        list: this.initData(Obj)
                    });
                })
            }
        })
    }

    refreshData(Obj){
        this.setState({
            list: this.initData(Obj)
        });
    }

    initData(Obj){
        var arry = [];
        var jsonArray = JSON.parse(Obj)
        for(let i = 0;i < jsonArray.length;i++){
            var job = jsonArray[i];
            arry.push(
                {
                    key: `${i+1}`,
                    boxId: job['projectName'],
                    tasks: job['taskCount'],
                    state: this.statusToStr(job['status']),
                    wordCount: job['wordCount'],
                    taskBatchNo: job['taskBatchNo']
                }
            );
        }
        return arry;
    }

    /**
     * 状态转换
     * @param status
     */
    statusToStr(status){
        switch (status){
            case "CREATE":
                return "未发布";
            case "AVAILABLE":
                return "未完成";
            case  "COMPLETE":
                return "已完成";
            case  "REFUSE":
                return "已拒绝";
            case "EXPIRE":
               return "已过期";
            case "DUPLICATE":
            default:
                return "";
        }
    }

    /**
     * boxId 变化触发
     * @param event
     * @constructor
     */
    BoxIdChange(event){
        var value = event.target.value

        console.log("BoxId是==>  " + event.target.value);
        this.setState({
            boxId: value
        })
    }

    /**
     * 实体类型选择
     * @param value
     */
    entityType(type){
        console.log("实体类型是==>  " + type);
        this.setState({
            currentEntityType:type
        });
    }

    /**
     * 实体字段名选择
     * @param nature
     */
    entityNature(nature){
        console.log("字段名是==>  " + nature);
        this.setState({
            currentNature:nature
        });
    }

    /**
     * 选择boxId还是ppid
     *
     * @param type
     */
    selectIdType(type){
        console.log("boxId类型是==>  " + type);
        this.setState(
            {
                type: type
            }
        );
    }

    /**
     * 填写项目名称
     * @param name
     */
    projectNameChange(name){
        console.log("项目名称是==>  " + name);
        this.setState(
            {
                projectName: name
            }
        );
    }
}

export default Task;