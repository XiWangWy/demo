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
        this.state={
            dataEntity:["全部"],
            dataNature:["全部"],
            dataFiled:["全部"],
            dataHaveEntity:["全部"],
            dataHaveNature:["全部"],
            dataHaveFiled:["全部"]
        }
    }


    onClick(eve){

        var rParams = {};
        var idParams = {};
        var params = {};
        var ids = [];
        if (this.type === 'PPID'){
            if (Tools.isEmptyObject(this.data['PPID'])){
                message.error("参数未填写完整");
                return;
            }
            delete this.data["boxId"];
            if(this.data['PPID'].split(/[,，]/).length !== 0){
                ids = this.data['PPID'].split(/[,，]/);
                idParams['projectProcessId'] = ids;
            }

        }else {
            if (Tools.isEmptyObject(this.data['boxId'])){
                message.error("参数未填写完整");
                return;
            }
            delete this.data["PPID"];
            // params['boxId'] = this.data['boxId'];
            if(this.data['boxId'].split(/[,，]/).length !== 0){
                ids = this.data['boxId'].split(/[,，]/);
                idParams['boxId'] = ids;
            }
        }
        console.log(this.data)
        console.log(eve)

        rParams['entityType'] = Tools.removeErrorStr(this.state.dataEntity);
        rParams['nature'] =  Tools.removeErrorStr(this.state.dataNature);
        rParams['field'] =  Tools.removeErrorStr(this.state.dataFiled);

        params['elQuery'] = idParams;
        params['ruleQuery'] = rParams;
        // var count = 0;


        // for(var key in this.data){
        //     if (!Tools.isEmptyObject(this.data[key]) && this.data[key] !== '' && this.data[key] !== '全部'){
        //         if(count === 0){
        //             params += "?"  + key + '=' + this.data[key];
        //         }else {
        //             params += "&"  + key + '=' + this.data[key];
        //         }
        //         count++;
        //     }
        // }

        // var url = '';
        // if (this.type === 'PPID'){
        //     console.log("类型是PPID的接口")
        //     url = '/align/export/materialByPPID';
        // }else {
        //     console.log("类型是BoxId的接口")
        //     url = '/align/export/materialByBoxId';
        // }

       // Fetch.get(url + params,(obj)=>{
       //      console.log("下载链接111====>" + obj);
       //     // Fetch.download();
       //     Fetch.download(obj,obj.substring(obj.lastIndexOf('/') + 1,obj.length))
       //  });

        var url = '/align/export/material';
        Fetch.fetchPost(url,params,(obj)=>{
            console.log("下载链接111====>" + obj);
            Fetch.download(obj,obj.substring(obj.lastIndexOf('/') + 1,obj.length))
        })


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

        var  arry =  this.state.dataEntity;
        var  filed = this.state.dataFiled;
        var index = arry.indexOf("全部");
        //只存在全部
        if (index !== -1 && arry.length == 1){
            arry.splice(index,1)
        }

        if( value !== "全部"){
            arry.push(value);
        }else {
            arry = ["全部"];
            filed = ["全部"];
        }

        this.setState({
            dataEntity:arry,
            dataNature:this.state.dataNature,
            dataFiled:filed
        });
        console.log(this.state);
    }

    handleDeSelectChangeItemEntityType(value){
        console.log("选择的删除实体类型是===>" + value);
        var  arry =  this.state.dataEntity;
        var  filed = this.state.dataFiled;
        if (value === "全部" && arry.length === 1){
            return;
        }

        Tools.deleteObjInArray(value,arry)

        if (arry.length > 0){
            //同时删除该实体下所有的已选字段不存在与其他实体中的字段
            var currentFileds = [];
            arry.forEach((item)=>{
                var fileds = Contants.getTypeData(item)['实体字段名'];
                currentFileds = Tools.unique(currentFileds,fileds)
            })


            var tmpLeftFiled = filed.concat();
            filed.forEach((item)=>{
                var index = currentFileds.indexOf(item);
                if (index === -1){
                    tmpLeftFiled.splice(tmpLeftFiled.indexOf(item),1)
                }
            })

            filed = tmpLeftFiled;
        }



        if(arry.length === 0){
            arry = ["全部"];
            filed = ["全部"];
        }

        if(filed.length === 0){
            filed = ["全部"];
        }

        this.setState({
            dataEntity:arry,
            dataNature:this.state.dataNature,
            dataFiled:filed
        });
        console.log(this.state);
    }

    handleSelectEntiKey(value){
        console.log("选择的实体字段名是===>" + value);

        var arry = this.state.dataFiled;
        var index = arry.indexOf("全部");
        //只存在全部
        if (index !== -1 && arry.length == 1){
            arry.splice(index,1)
        }

        if( value !== "全部"){
            arry.push(value);
        }else {
            arry = ["全部"];
        }
        this.setState({
            dataEntity:this.state.dataEntity,
            dataNature:this.state.dataNature,
            dataFiled:arry
        });
        console.log(this.state);
    }

    handleDeSelectEntiKey(value){
        console.log("选择的删除实体字段是===>" + value);
        var  arry =  this.state.dataFiled;
        if (value === "全部" && arry.length === 1){
            return;
        }

        Tools.deleteObjInArray(value,arry)
        if(arry.length === 0){
            arry = ["全部"];
        }
        this.setState({
            dataEntity:this.state.dataEntity,
            dataNature:this.state.dataNature,
            dataFiled:arry
        });
        console.log(this.state);
    }


    // handleChangeItemEntityType(value){
    //     console.log(value);
    // }

    handleSelectChangeItemNature(value){
        console.log("选择的词性是===>" + value);

        var arry = this.state.dataNature;
        var index = arry.indexOf("全部");
        //只存在全部
        if (index !== -1 && arry.length == 1){
            arry.splice(index,1)
        }

        if( value !== "全部"){
            arry.push(value);
        }else {
            arry = ["全部"];
        }

        this.setState({
            dataEntity:this.state.dataEntity,
            dataNature:arry,
            dataFiled:this.state.dataFiled
        });
        console.log(this.state);
    }

    handleDeSelectChangeItemNature(value){
        console.log("选择的删除词性是===>" + value);
        var  arry =  this.state.dataNature;
        if (value === "全部" && arry.length === 1){
            return;
        }

        Tools.deleteObjInArray(value,arry)
        if (arry.length === 0){
            arry = ["全部"]
        }

        this.setState({
            dataEntity:this.state.dataEntity,
            dataNature:arry,
            dataFiled:this.state.dataFiled
        });

    }



    // onChange(event){
    //     this.data['filed'] = event.target.value;
    //     console.log(event.target.value)
    //     console.log(this.data);
    //     console.log(this.type);
    // }

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

    // onChangeBatchNo(event){
    //     this.subData['alignBatchNo'] = event.target.value;
    //     console.log(event.target.value)
    //     console.log(this.subData);
    // }

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
        var rParams = {};
        var params = {};
        var ids = [];
        var url = '/align/genAlignEntity';
        if (this.typeSub === 'PPID'){
            console.log("类型是PPID的接口")
            if(Tools.isEmptyObject(this.subData['PPID'])){
                message.error("参数未填写完整");
                return;
            }


            if(this.subData['PPID'].split(/[,，]/).length !== 0){
                ids = this.subData['PPID'].split(/[,，]/);
                params['projectProcessId'] = ids;
            }
        }else {
            console.log("类型是BoxId的接口")
            if(Tools.isEmptyObject(this.subData['boxId'])){
                message.error("参数未填写完整");
                return;
            }
            if(this.subData['boxId'].split(/[,，]/).length !== 0){
                ids = this.subData['boxId'].split(/[,，]/);
                params['boxId'] = ids;
            }
        }

        // var newUrl = url + "?" + key + id + "&alignBatchNo=" + obj['alignBatchNo'];
        // Fetch.get(newUrl,()=>{
        //     console.log("执行完成")
        //     message.success("提交执行接口成功");
        // })
        rParams = params;

        Fetch.fetchPost(url,rParams,(obj)=>{
            message.success("提交执行接口成功");
        })
    }

    handleSelectChangeItemIdType(value){
        console.log("选择的Id类型是===>" + value);

        if(value === 'BoxId'){
            this.type = 'boxId';
            this.data['boxId'] = this.idStr;
            delete  this.data['PPID']
        }else {
            this.type = "PPID";
            this.data['PPID'] = this.idStr;
            delete  this.data['boxId']
        }

        console.log(this.data);
    }


    handleSelectChangeIdType(value){
        console.log("选择的Id类型是===>" + value);

        if(value === 'BoxId'){
            this.typeSub = 'boxId';
            this.subData['boxId'] = this.idStrSub;
            delete this.subData['PPID']
        }else {
            this.typeSub = "PPID";
            this.subData['PPID'] = this.idStrSub;
            delete this.subData['boxId']
        }

        console.log(this.subData);
    }

    handleSelectChangeItemEntityTypeHave(value){
        console.log("选择的实体类型是===>" + value);

        var  arry =  this.state.dataHaveEntity;
        var  filed = this.state.dataHaveFiled;
        var index = arry.indexOf("全部");
        //只存在全部
        if (index !== -1 && arry.length == 1){
            arry.splice(index,1)
        }

        if( value !== "全部"){
            arry.push(value);
        }else {
            arry = ["全部"];
            filed = ["全部"];
        }

        this.setState({
            dataHaveEntity:arry,
            dataHaveNature:this.state.dataHaveNature,
            dataHaveFiled:filed
        });
        // console.log(this.state);
    }

    handleDeSelectChangeItemEntityTypeHave(value){
        console.log("选择的删除实体类型是===>" + value);
        var  arry =  this.state.dataHaveEntity;
        var  filed = this.state.dataHaveFiled;
        if (value === "全部" && arry.length === 1){
            return;
        }

        Tools.deleteObjInArray(value,arry)

        if (arry.length > 0){
            //同时删除该实体下所有的已选字段不存在与其他实体中的字段
            var currentFileds = [];
            arry.forEach((item)=>{
                var fileds = Contants.getTypeData(item)['实体字段名'];
                currentFileds = Tools.unique(currentFileds,fileds)
            })


            var tmpLeftFiled = filed.concat();
            filed.forEach((item)=>{
                var index = currentFileds.indexOf(item);
                if (index === -1){
                    tmpLeftFiled.splice(tmpLeftFiled.indexOf(item),1)
                }
            })

            filed = tmpLeftFiled;
        }



        if(arry.length === 0){
            arry = ["全部"];
            filed = ["全部"];
        }

        if(filed.length === 0){
            filed = ["全部"];
        }

        this.setState({
            dataHaveEntity:arry,
            dataHaveNature:this.state.dataHaveNature,
            dataHaveFiled:filed
        });
    }


    handleSelectChangeItemNatureHave(value){
        console.log("选择的词性是===>" + value);

        var arry = this.state.dataHaveNature;
        var index = arry.indexOf("全部");
        //只存在全部
        if (index !== -1 && arry.length == 1){
            arry.splice(index,1)
        }

        if( value !== "全部"){
            arry.push(value);
        }else {
            arry = ["全部"];
        }

        this.setState({
            dataHaveEntity:this.state.dataHaveEntity,
            dataHaveNature:arry,
            dataHaveFiled:this.state.dataHaveFiled
        });

    }


    handleSelectEntiKeyHave(value){
        console.log("选择的实体字段名是===>" + value);

        var arry = this.state.dataHaveFiled;
        var index = arry.indexOf("全部");
        //只存在全部
        if (index !== -1 && arry.length == 1){
            arry.splice(index,1)
        }

        if( value !== "全部"){
            arry.push(value);
        }else {
            arry = ["全部"];
        }
        this.setState({
            dataHaveEntity:this.state.dataHaveEntity,
            dataHaveNature:this.state.dataHaveNature,
            dataHaveFiled:arry
        });
    }


    handleDeSelectEntiKeyHave(value){
        console.log("选择的删除实体字段是===>" + value);
        var  arry =  this.state.dataHaveFiled;
        if (value === "全部" && arry.length === 1){
            return;
        }

        Tools.deleteObjInArray(value,arry)
        if(arry.length === 0){
            arry = ["全部"];
        }
        this.setState({
            dataHaveEntity:this.state.dataHaveEntity,
            dataHaveNature:this.state.dataHaveNature,
            dataHaveFiled:arry
        });
        console.log(this.state);
    }


    handleDeSelectChangeItemNatureHave(value){
        console.log("选择的删除词性是===>" + value);
        var  arry =  this.state.dataHaveNature;
        if (value === "全部" && arry.length === 1){
            return;
        }

        Tools.deleteObjInArray(value,arry)
        if(arry.length === 0){
            arry = ["全部"];
        }
        this.setState({
            dataHaveEntity:this.state.dataHaveEntity,
            dataHaveNature:arry,
            dataHaveFiled:this.state.dataHaveFiled
        });
    }

    onClickHave(eve){
        var rParams = {};
        var params = {};
        console.log(this.data)
        console.log(eve)

        params['entityType'] = Tools.removeErrorStr(this.state.dataHaveEntity);
        params['nature'] = Tools.removeErrorStr(this.state.dataHaveNature);
        params['field'] = Tools.removeErrorStr(this.state.dataHaveFiled);


        var url = '/align/export/alignRule';

        Fetch.fetchPost(url,params,(obj)=>{
            Fetch.download(obj,obj.substring(obj.lastIndexOf('/') + 1,obj.length))
        })

    }

    downloadAll(eve){
        var url = "/align/export/history";
        var params = "?operateType=EXPORT_RULE";
        Fetch.downloadWithPath(url+params,"EXPORT_RULE_History.txt")

        // Fetch.downloadWithPath("http://localhost:8000/download","EXPORT_RULE_History.txt")
    }

    downloadSome(eve){
        var url = "/align/export/history";
        var params = "?operateType=GEN_RULE";

        Fetch.downloadWithPath(url+params,"GEN_RULE_History.txt")
    }

    downloadUpdate(eve){
        var url = "/align/export/history";
        var params = "?operateType=UPDATE_ALIGN";
        Fetch.downloadWithPath(url+params,"UPDATE_ALIGN_History.txt")
    }


    render() {
        console.log(this.state);
        return (
            <div className="App">

                <Select defaultValue = "BoxId" style={{ width: 120,margin:"10px"}} name = "IdType" onSelect={this.handleSelectChangeItemIdType.bind(this)}>
                    <Option value='BoxId'>BoxId</Option>
                    <Option value='PPID'>PPID</Option>
                </Select>

                <Input className="AlignmentInputStyle" placeholder="BoxId/PPID" onChange={this.onChangeId.bind(this)}/>
                    <label style={{margin:"10px"}}>实体类型:</label>
                    <Select mode = 'multiple' value = {this.state.dataEntity} style={{ width: 120 }} name = "entityType"  onDeselect={this.handleDeSelectChangeItemEntityType.bind(this)} onSelect={this.handleSelectChangeItemEntityType.bind(this)}>
                        {
                            (()=>{
                                var obj = Contants.getAllType();
                                var typeArray = [];

                                typeArray.push(<Option value="全部">全部</Option>)
                                for(var key in obj){
                                    typeArray.push(<Option value={key} >{key}</Option>)
                                }
                                return typeArray;
                            })()
                        }
                    </Select>

                <label style={{margin:"10px 0 10px 10px"}}>实体字段名:</label>
                <Select mode = 'multiple' value =  {this.state.dataFiled} style={{ width: 120,margin:"10px" }} name = "实体字段名"  onDeselect={this.handleDeSelectEntiKey.bind(this)} onSelect={this.handleSelectEntiKey.bind(this)}>
                    {
                        (()=>{
                            let array = [];
                            var value =  this.state.dataEntity;
                            if (value === undefined || (value.length ===1 && value.indexOf('全部') !== -1)){
                                return array;
                            }

                           var selectNatures = [];
                           value.forEach((key)=>{
                               var obj = Contants.getTypeData(key);
                               var natures = obj['实体字段名'];
                               selectNatures = Tools.unique(selectNatures,natures);
                           })
                            array.push(<Option value="全部">全部</Option>)
                            selectNatures.forEach((item) =>{
                                array.push(<Option value={item}>{item}</Option>)
                            })
                            return array;
                        })()
                    }

                </Select>

                     <label style={{margin:"10px 0 10px 10px"}}>词性:</label>
                <Select  mode = 'multiple' value = {this.state.dataNature} style={{ width: 120,margin:"10px" }} name = "nature" onDeselect={this.handleDeSelectChangeItemNature.bind(this)} onSelect={this.handleSelectChangeItemNature.bind(this)}>
                    {
                        (()=>{
                            let array = [];
                            var value =  this.state.dataEntity;
                            if (value === undefined || (value.length ===1 && value.indexOf('全部') !== -1)){
                                return array;
                            }

                            var natures = Contants.getAllNatures();
                            {/*var natures = obj['词性'];*/}
                            array.push(<Option value="全部">全部</Option>)
                            natures.forEach((item) =>{
                                array.push(<Option value={item}>{item}</Option>)
                            })

                            return array;
                        })()

                    }

                </Select>


                <Button type="primary" style={{margin:"10px"}} onClick={this.onClick.bind(this)}>下载素材</Button>
                <Button type="primary" style={{margin:"10px"}} onClick={this.downloadSome.bind(this)}>下载操作记录</Button>

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
                {/*<Input className="AlignmentInputStyle" placeholder="alignBatchNo" onChange={this.onChangeBatchNo.bind(this)}/>*/}
                <Button type="primary" onClick={this.onClickExcute.bind(this)}>执行对齐操作</Button>
                <Button type="primary" style={{margin:"10px"}} onClick={this.downloadUpdate.bind(this)}>下载操作记录</Button>

                <div style={{margin:"10px"}}>
                    <label style={{margin:"10px"}}>实体类型:</label>
                    <Select mode = 'multiple' value = {this.state.dataHaveEntity} style={{ width: 120 }} name = "entityType"  onDeselect={this.handleDeSelectChangeItemEntityTypeHave.bind(this)}  onSelect={this.handleSelectChangeItemEntityTypeHave.bind(this)}>
                        {
                            (()=>{
                                let typeArray = [];
                                var obj =  Contants.getAllType();
                                typeArray.push(<Option value="全部">全部</Option>)
                                for(var key in obj){
                                    typeArray.push(<Option value={key}>{key}</Option>)
                                }
                                return typeArray;
                            })()
                        }
                    </Select>
                    <label style={{margin:"10px 0 10px 10px"}}>实体字段名:</label>
                    <Select mode = 'multiple' value = {this.state.dataHaveFiled} style={{ width: 120,margin:"10px" }} name = "实体字段名" onDeselect={this.handleDeSelectEntiKeyHave.bind(this)} onSelect={this.handleSelectEntiKeyHave.bind(this)}>
                        {
                            (()=>{
                                let array = [];
                                var value =  this.state.dataHaveEntity;
                                if (value === undefined || (value.length ===1 && value.indexOf('全部') !== -1)){
                                    return array;
                                }

                                var selectNatures = [];
                                value.forEach((key)=>{
                                    var obj = Contants.getTypeData(key);
                                    var natures = obj['实体字段名'];
                                    selectNatures = Tools.unique(selectNatures,natures);
                                })
                                array.push(<Option value="全部">全部</Option>)
                                selectNatures.forEach((item) =>{
                                    array.push(<Option value={item}>{item}</Option>)
                                })
                                return array;
                            })()
                        }

                    </Select>


                    <label style={{margin:"10px 0 10px 10px"}}>词性:</label>
                    <Select mode = 'multiple' value = {this.state.dataHaveNature} style={{ width: 120,margin:"10px" }} name = "nature" onDeselect={this.handleDeSelectChangeItemNatureHave.bind(this)} onSelect={this.handleSelectChangeItemNatureHave.bind(this)}>
                        {
                            (()=>{
                                let array = [];
                                var value =  this.state.dataHaveEntity;
                                if (value === undefined || (value.length ===1 && value.indexOf('全部') !== -1)){
                                    return array;
                                }

                                var natures = Contants.getAllNatures();
                                {/*var natures = obj['词性'];*/}
                                array.push(<Option value="全部">全部</Option>)
                                natures.forEach((item) =>{
                                    array.push(<Option value={item}>{item}</Option>)
                                })

                                return array;
                            })()

                        }

                    </Select>
                <Button type="primary" style={{margin:"10px"}} onClick={this.onClickHave.bind(this)}>下载已有规则素材</Button>
                    <Button type="primary" style={{margin:"10px"}} onClick={this.downloadAll.bind(this)}>下载操作记录</Button>
                </div>
            </div>
        );
    }
}

export default Alignment;