/**
 * Created by wangxi on 18/9/20.
 */
import React from 'react';
import { Component } from 'react';
import '../CSS/TaskDetail.css';
import Fetch from '../../Fetch.js'
import ListItem from './ListItem.js'
import {message, Button,Select, List} from 'antd';
import Tools from '../../Tools'
const Option = Select.Option

class TaskDetail extends Component {

    modeList =   ["多人模式","单人模式"];

    constructor(props){
        super(props);
        this.state = {
            doctors: [],
            boxId: "",
            type: "boxId",
            projectName: Tools.getStoryageItem('projectName'),
            mode:"多人模式",
            list:[]
        };
    }

    componentWillMount(){
        console.log(this.state)
        this._isMounted = true;

        // var projectName = Tools.getStoryageItem('projectName');
        var batchNo = Tools.getStoryageItem('taskBatchNo');
        //获取医生列表
        var url = "/manage/list/project/user" + "?batchNo=" + batchNo ;

        Fetch.get(url,(Obj)=>{
            var docObj = JSON.parse(Obj);
            if (this._isMounted){
                this.setState({
                    allDoctors: docObj['allUsers'],
                    doctors: docObj['projectUser'].length === 0 ? ['选择医生']:docObj['projectUser']
                });
            }
        })

        //获取项目进度
        var url = "/manage/progress" + "?batchNo=" + batchNo;
        Fetch.get(url,(Obj)=>{
            var list = [];
            Obj = JSON.parse(Obj);
            list.push({
                index:this.state.list.length + 1,
                taskCount: Obj['taskCount'],
                hasCompleteDouble: Obj['twiceDoneCount'],
                hasCompleteOnece: Obj['onceDoneCount'],
                notComplete: Obj['zeroDoneCount'],
                status: Obj['batchNo']['status']
            });
            if (this._isMounted){
                console.log("调用获取进度完成。。。。")
                this.setState({
                    list: list
                });
            }
        })

    }

    componentWillReceiveProps(props){

    }

    componentWillUpdata(){
    }


    componentWillUnmount(){
        this._isMounted = false;
        Tools.reMoveStoryageItem('projectName');
        Tools.reMoveStoryageItem('taskBatchNo');
        console.log("退出详情界面！")
    }


    render(){
       return(
           <div className="parent">
               <div className="divStyle">
                   <label className="projectNameValue">项目名称：{this.state.projectName}</label>
               </div>

               <div className="divStyle">
                   <Select className="selectMode"  value = {this.state.mode} onSelect={this.selectMod.bind(this)}>
                       {
                           (()=>{
                               var typeArray = [] ;
                               var dataList = this.modeList;
                               for(var key in dataList){
                                   typeArray.push(<Option key = {key} value={dataList[key]} >{dataList[key]}</Option>)
                               }
                               return typeArray;
                           })()
                       }
                   </Select>
                   <Select className="selectDoc" mode ={this.state.mode === "多人模式" ? 'multiple' : ""}   value = {this.state.doctors} onDeselect={this.deleteDoc.bind(this)} onSelect={this.selectDoc.bind(this)}>
                       {
                           (()=>{
                               var obj = this.state.allDoctors;
                               var typeArray = [];

                               for(var key in obj){
                                   typeArray.push(<Option key = {key} value={obj[key]} >{obj[key]}</Option>)
                               }
                               return typeArray;
                           })()
                       }
                   </Select>
                   <Button type = "primary" onClick={this.docConfirm.bind(this)}>确认</Button>
               </div>

               <div className="listDivStyle">
                    <List  bordered split itemLayout="vertical" dataSource={this.state.list} renderItem={(item,index) => (
                        <ListItem item = {item} {...this.props} info = {this.state} index = {index+1} dataChange = {this.dataChange.bind(this)}>
                        </ListItem>
                    )}/>
               </div>
           </div>
       );
    }

    /**
     * 数据变化
     * @param data
     */
    dataChange(data){
        // this.setState({
        //     BtnStatus:data
        // });
        //获取项目进度
        var batchNo = Tools.getStoryageItem('taskBatchNo');
        var url = "/manage/progress" + "?batchNo=" + batchNo;
        Fetch.get(url,(Obj)=>{
            var list = [];
            Obj = JSON.parse(Obj);
            list.push({
                index:this.state.list.length + 1,
                taskCount: Obj['taskCount'],
                hasCompleteDouble: Obj['twiceDoneCount'],
                hasCompleteOnece: Obj['onceDoneCount'],
                notComplete: Obj['zeroDoneCount'],
                status: Obj['batchNo']['status']
            });
            if (this._isMounted){
                console.log("调用获取进度完成。。。。")
                this.setState({
                    list: list
                });
            }
        })
    }

    /**
     * 选择任务模式
     * @param value
     */
    selectMod(value){
        this.setState({
            mode:value,
            doctors:["选择医生"]
        });

    }

    /**
     * 删除医生
     * @param value
     */
    deleteDoc(value){
        var docs = Tools.deleteObjInArray(value,this.state.doctors);
        if (docs.length == 0){
            docs = ["选择医生"];
        }
        this.setState({
            doctors:docs
        });
    }

    /**
     * 选择医生
     * @param value
     */
    selectDoc(value){
        var docs =  this.state.doctors;
        if (this.state.mode != "多人模式"){
            this.setState({
                doctors:[value]
            });
        }else {
            docs.push(value);
            this.setState({
                doctors:Tools.deleteObjInArray("选择医生",docs)
            });
        }

    }

    /**
     * 确定医生
     * @param event
     */
    docConfirm(event){
        console.log(this.state)
        var url = "/manage/assign/users";
        var params = {};
        params['batchNo'] = Tools.getStoryageItem('taskBatchNo');
        params['mode'] = this.state.mode === "多人模式" ? "MULTIPLE" : "SINGLE";
        params['userNames'] = this.state.doctors;
        if (this.state.doctors.length == 1 && this.state.doctors.indexOf("选择医生") != -1){
            message.error("请先选择医生！")
            return;
        }
        Fetch.fetchPost(url,params,(Obj)=>{
            console.log(Obj)
            message.success("添加医生成功！")
        })
    }
}

export  default TaskDetail;