/**
 * Created by wangxi on 18/9/21.
 */
import React from 'react';
import { Component } from 'react';
import '../CSS/ListItem.css';
import Fetch from '../../Fetch.js'
import {Upload,message, Button} from 'antd';
import Tools from '../../Tools'
// const Option = Select.Option

class  ListItem extends Component {
    constructor(props){
        super(props);
        console.log(props.item)
        this.dataChange = this.props.dataChange
        this.state ={
            item:props.item,
            projectName: props.info['projectName']
        }
    }

    componentWillReceiveProps(props){
        this.setState(
            {
                item:props.item,
                projectName: props.info['projectName']
            }
        )
    }

    render(){
        return (
            <div>
                <div className="tittleStyle">
                    <label className="tittleLabel">任务数{this.state.item.taskCount}</label>
                    <Button disabled = {this.statusCompare(this.state.item.status,"精准审核")} className="firstButton" type="primary" onClick={this.taskExamin.bind(this,this.state.item)}>精准审核</Button>
                    <Button disabled = {this.statusCompare(this.state.item.status,"召回审核")} className="rightButton" type="primary">召回审核</Button>
                    <Button disabled = {this.statusCompare(this.state.item.status,"发布任务")} className="rightButton" type="primary" onClick={this.releaseTask.bind(this,this.state.item)}>发布任务</Button>
                    <Button disabled = {this.statusCompare(this.state.item.status,"拒绝任务")} className="rightButton" type="primary" onClick={this.refuseTask.bind(this,this.state.item)}>拒绝任务</Button>
                </div>

                <div className="centerStyle">
                    <label style={{margin:"10px"}}>已完成双盲任务数：{this.state.item.hasCompleteDouble}</label>
                    <label style={{margin:"20px 30px 20px 40px"}}>已完成一次的任务数：{this.state.item.hasCompleteOnece}</label>
                    <label style={{margin:"10px"}}>一次未完成的任务数：{this.state.item.notComplete}</label>
                </div>

                <div className="bottomStyle">
                    <Button disabled = {this.statusCompare(this.state.item.status,"比对入库")} style={{margin:"10px"}} type="primary" onClick={this.compareTodb.bind(this,this.state.item)}>比对入库</Button>



                    {/*<Button style={{margin:"10px"}} type="primary" onClick={this.uploadTask.bind(this,this.state.item)}>上传审核结果</Button>*/}

                    <Button disabled = {this.statusCompare(this.state.item.status,"下载审核任务")}  style={{margin:"10px"}}  type="primary" onClick={this.downloadTask.bind(this,this.state.item)}>下载审核任务</Button>
                    <Upload  style={{margin:"10px"}} {...this.upload}>
                        <Button type="primary" disabled = {this.statusCompare(this.state.item.status,"上传审核结果")} >
                            上传审核结果
                        </Button>
                    </Upload>
                    <Button  disabled = {this.statusCompare(this.state.item.status,"重新导出素材")} style={{margin:"10px"}} type="primary" onClick={this.reExport.bind(this,this.state.item)}>重新导出素材</Button>
                </div>

                <div className="line">

                </div>
            </div>
        );
    }

    statusCompare(status,btnName){
        var createBtn = ["精准审核", "召回审核", "发布任务", "拒绝任务", "重新导出素材"];
        var availableBtn = ["比对入库","重新导出素材","下载审核任务","上传审核结果"];
        var completeBtn = ["比对入库","重新导出素材","下载审核任务","上传审核结果"];
        var refuseBtn = ["重新导出素材"];
        var expireBtn = [];
        var duplicateBtn = [];

        switch(status)
        {
            case "CREATE":
                if (createBtn.indexOf(btnName) != -1){
                    return false;
                }
                return true;
            case "AVAILABLE":
                if (availableBtn.indexOf(btnName) != -1){
                    return false;
                }
                return true;
            case  "COMPLETE":
                if (completeBtn.indexOf(btnName) != -1){
                    return false;
                }
                return true;
            case  "REFUSE":
                if (refuseBtn.indexOf(btnName) != -1){
                    return false;
                }
                return true;
            case "EXPIRE":
                if (expireBtn.indexOf(btnName) != -1){
                    return false;
                }
                return true;
            case "DUPLICATE":
                if (duplicateBtn.indexOf(btnName) != -1){
                    return false;
                }
                return true;
            default:
                return true;
        }

    }


    upload = {
        name:'file',
        action:Fetch.baseUrl + '/manage/upload/material',
        headers: {
            authorization: 'authorization-text',
            'token':Tools.getStoryageItem('data') == null ? "" : JSON.parse(Fetch.storage.getItem('data'))['token']
        },
        multiple:false,
        showUploadList:false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name}   上传成功！`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name}     上传失败！`);
            }
        }
    }

    /**
     * 上传审核结果
     * @param item
     */
    uploadTask(item){

    }

    /**
     * 下载审核任务
     * @param item
     */
    downloadTask(item){
        var url = "/manage/export/conflict" + "?batchNo=" + Tools.getStoryageItem('taskBatchNo');
        Fetch.get(url,(downpath)=>{
            Fetch.download(downpath,downpath.substring(downpath.lastIndexOf('/') + 1,downpath.length))
        })
    }


    /**
     * 重新导出素材
     * @param item
     */
    reExport(item){
        var url = "/manage/reload/project";
        var params = {};
        params['batchNo'] =  Tools.getStoryageItem('taskBatchNo');
        Fetch.fetchPost(url,params,(Obj)=>{
            message.success("重新导出素材成功！")
            this.dataChange("重新导出素材成功");
        })
    }

    /**
     *比对入库按钮点击处理
     */
    compareTodb(item){
        console.log("比对入库点击的是第" + item.index + "行   ")
        console.log(item)
        var url = "/manage/submit/pendingRule";
        var params = {};
        params['batchNo'] =  Tools.getStoryageItem('taskBatchNo');
        Fetch.fetchPost(url,params,(Obj)=>{
            message.success("比对入库成功！")
        })
    }

    /**
     *发布任务处理
     * @param index
     */
    releaseTask(item){
        console.log("发布任务点击的是第" + item.index + "行   " )
        console.log(item)
        var url = "/manage/publish/project";
        var params = {};
        params['batchNo'] =  Tools.getStoryageItem('taskBatchNo');
        Fetch.fetchPost(url,params,(Obj)=>{
            message.success("发布任务成功！")

            this.dataChange("发布任务");
        })
    }

    /**
     * 拒绝任务
     * @param item
     */
    refuseTask(item){
        console.log("拒绝任务点击的是第" + item.index + "行   " )
        console.log(item)
        var url = "/manage/refuse/project";
        var params = {};
        params['batchNo'] =  Tools.getStoryageItem('taskBatchNo');
        Fetch.fetchPost(url,params,(Obj)=>{
            message.success("拒绝任务成功！")
            this.dataChange("拒绝任务");
        })
    }

    /**
     * 审核不一致任务
     */
    // taskNotEquals(item){
    //     console.log("审核任务点击的是第" + item.index + "行   " )
    //     console.log(item)
        // var url = "/manage/refuse/project";
        // var params = {};
        // params['projectName'] = this.state.projectName;
        // Fetch.fetchPost(url,params,(Obj)=>{
        //     message.success("发布任务成功！")
        // })
    // }

    /**
     * 精准审核
     * @param item
     */
    taskExamin(item){
        console.log("精准审核任务点击的是第" + item.index + "行   " )
        console.log(item)
        this.props.history.push({
            pathname:"/exam",
            projectName: this.state.projectName
        });
    }
}

export default ListItem;