/**
 * Created by wangxi on 18/7/13.
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

class Alignment extends Component {
    data = {}
    type = 'boxId';
    typeSub = 'boxId';
    idStr = '';
    idStrSub = '';
    subData = {}
    dataHave = {}
    constructor(props){
        super(props);
        // console.log(this.props.location.state.aa);

    }

    onClick(eve){


        if (this.type === 'PPID'){
            delete this.data["boxId"];
        }else {
            delete this.data["PPID"];
        }
        console.log(this.data)
        console.log(eve)
        var params =  '';
        var count = 0;
        for(var key in this.data){
            if (!Tools.isEmptyObject(this.data[key])){
                if(count === 0){
                    params += "?"  + key + '=' + this.data[key];
                }else {
                    params += "&"  + key + '=' + this.data[key];
                }
                count++;
            }
        }

        var url = '';
        if (this.type === 'PPID'){
            console.log("类型是PPID的接口")
            url = '/align/export/materialByPPID';
        }else {
            console.log("类型是BoxId的接口")
            url = '/align/export/materialByBoxId';
        }

       Fetch.get(url + params,(obj)=>{
            console.log("下载链接111====>" + obj);
           // Fetch.download();
           Fetch.download(obj,obj.substring(obj.lastIndexOf('/') + 1,obj.length))
        });



    }

    upload = {
        name:'file',
        action:Fetch.baseUrl + '/align/upload/material',
        headers: {
            authorization: 'authorization-text',
        },
        multiple:true,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    }


    handleSelectChangeItemEntityType(value){
        console.log("选择的实体类型是===>" + value);
        this.data['entityType'] = value;
        console.log(this.data);
    }

    handleSelectChangeItemNature(value){
        console.log("选择的词性是===>" + value);
        this.data['nature'] = value;
        console.log(this.data);
    }

    onChange(event){
        this.data['filed'] = event.target.value;
        console.log(event.target.value)
        console.log(this.data);
        console.log(this.type);
    }

    onChangeId(event){
        var data = event.target.value;

        this.idStr = data;
        if (this.type === 'PPID'){
            this.data['PPID'] = this.idStr;
        }else {
            this.data['boxId'] = this.idStr;
        }

        console.log(event.target.value)
        console.log(this.data);
        console.log(this.type);
    }

    onChangeBatchNo(event){
        this.subData['alignBatchNo'] = event.target.value;
        console.log(event.target.value)
        console.log(this.subData);
    }

    onChangeIdSub(event){
        var subData = event.target.value;
        this.idStrSub = subData;
        if (this.typeSub === "PPID"){
            this.subData['PPID'] = subData;
        }else {
            this.subData['boxId'] = subData;
        }
        console.log(event.target.value)
        console.log(this.subData);
    }

    onClickExcute(){
        var obj = {};
        obj['alignBatchNo'] = this.subData['alignBatchNo'];
        var id = "";
        var url = '';
        var key = 'boxId=';
        if (this.typeSub === 'PPID'){
            console.log("类型是PPID的接口")
            url = '/align/addAlignByPPID';
            id  = this.subData['PPID'];
            key = 'PPID=';
        }else {
            console.log("类型是BoxId的接口")
            url = '/align/addAlignByBoxId';
            id  = this.subData['boxId'];
            key = 'boxId=';
        }

        var newUrl = url + "?" + key + id + "&alignBatchNo=" + obj['alignBatchNo'];
        Fetch.get(newUrl,()=>{
            console.log("执行完成")
            message.success("提交执行接口成功");
        })
    }

    handleSelectChangeItemIdType(value){
        console.log("选择的Id类型是===>" + value);

        if(value === 'BoxId'){
            this.type = 'boxId';
            this.data['boxId'] = this.idStr;
        }else {
            this.type = "PPID";
            this.data['PPID'] = this.idStr;
        }

        console.log(this.data);
    }


    handleSelectChangeIdType(value){
        console.log("选择的Id类型是===>" + value);

        if(value === 'BoxId'){
            this.typeSub = 'boxId';
            this.subData['boxId'] = this.idStrSub;
        }else {
            this.typeSub = "PPID";
            this.subData['PPID'] = this.idStrSub;
        }

        console.log(this.subData);
    }

    handleSelectChangeItemEntityTypeHave(value){
        console.log("选择的实体类型是===>" + value);
        this.dataHave['entityType'] = value;
        console.log(this.data);
    }

    handleSelectChangeItemNatureHave(value){
        console.log("选择的实体类型是===>" + value);
        this.dataHave['nature'] = value;
        console.log(this.data);
    }

    onClickHave(eve){
        var params =  '';
        var count = 0;
        for(var key in this.dataHave){
            if (!Tools.isEmptyObject(this.dataHave[key])){
                if(count === 0){
                    params += "?"  + key + '=' + this.dataHave[key];
                }else {
                    params += "&"  + key + '=' + this.dataHave[key];
                }
                count++;
            }
        }

        var url = '/align/export/alignRule';

        Fetch.get(url + params,(obj)=>{
            console.log("下载链接111====>" + obj);
            // Fetch.download();
            Fetch.download(obj,obj.substring(obj.lastIndexOf('/') + 1,obj.length))
        });
    }

    render() {
        return (
            <div className="App">

                <Select defaultValue = "BoxId" style={{ width: 120,margin:"10px"}} name = "IdType" onSelect={this.handleSelectChangeItemIdType.bind(this)}>
                    <Option value='BoxId'>BoxId</Option>
                    <Option value='PPID'>PPID</Option>
                </Select>

                <Input className="AlignmentInputStyle" placeholder="BoxId/PPID" onChange={this.onChangeId.bind(this)}/>
                <Select defaultValue = "实体类型" style={{ width: 120 }} name = "entityType" onSelect={this.handleSelectChangeItemEntityType.bind(this)}>
                    {
                        (()=>{
                            let typeArray = [];
                           var obj =  Contants.getAllType();
                           for(var key in obj){
                               typeArray.push(<Option value={key}>{key}</Option>)
                           }
                           return typeArray;
                        })()
                    }
                </Select>

                <Select defaultValue = "词性" style={{ width: 120,margin:"10px" }} name = "nature" onSelect={this.handleSelectChangeItemNature.bind(this)}>
                    {
                        (()=>{
                            let array = [];
                            var obj =  Contants.getAllType();
                            for(var key in obj){
                                var children = obj[key];
                                for (var childObj in children){
                                    array.push(<Option value={children[childObj]}>{children[childObj]}</Option>)
                                }

                            }
                          return array;
                        })()
                    }

                </Select>
                <Button type="primary" style={{margin:"10px"}} onClick={this.onClick.bind(this)}>下载素材</Button>
                <div className="InputStyle">
                    <Dragger  {...this.upload}>
                        <Button>
                            <Icon type = "upload" />
                            可拖拽上传
                        </Button>

                    </Dragger>
                </div>

                <Select defaultValue = "BoxId" style={{ width: 120,margin:"10px"}} name = "IdType" onSelect={this.handleSelectChangeIdType.bind(this)}>
                    <Option value='BoxId'>BoxId</Option>
                    <Option value='PPID'>PPID</Option>
                </Select>
                <Input className="AlignmentInputStyle" placeholder="BoxId/PPID" onChange={this.onChangeIdSub.bind(this)}/>
                <Input className="AlignmentInputStyle" placeholder="alignBatchNo" onChange={this.onChangeBatchNo.bind(this)}/>
                <Button type="primary" onClick={this.onClickExcute.bind(this)}>执行对齐操作</Button>

                <div style={{margin:"10px"}}>
                    <Select defaultValue = "实体类型" style={{ width: 120 }} name = "entityType" onSelect={this.handleSelectChangeItemEntityTypeHave.bind(this)}>
                        {
                            (()=>{
                                let typeArray = [];
                                var obj =  Contants.getAllType();
                                for(var key in obj){
                                    typeArray.push(<Option value={key}>{key}</Option>)
                                }
                                return typeArray;
                            })()
                        }
                    </Select>

                <Select defaultValue = "词性" style={{ width: 120,margin:"10px" }} name = "nature" onSelect={this.handleSelectChangeItemNatureHave.bind(this)}>
                    {
                        (()=>{
                            let array = [];
                            var obj =  Contants.getAllType();
                            for(var key in obj){
                                var children = obj[key];
                                for (var childObj in children){
                                    array.push(<Option value={children[childObj]}>{children[childObj]}</Option>)
                                }

                            }
                            return array;
                        })()
                    }

                </Select>
                <Button type="primary" style={{margin:"10px"}} onClick={this.onClickHave.bind(this)}>下载已有规则素材</Button>
                </div>
            </div>
        );
    }
}

export default Alignment;