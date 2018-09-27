/**
 * Created by wangxi on 18/9/19.
 */
import React from 'react';
import { Component } from 'react';
import '../CSS/SourceMaterial.css';
import MyTable from  './MyTable'
import Fetch from '../../Fetch.js'
import { message, Input, Button, Checkbox,Select, } from 'antd';
const Option = Select.Option

class SourceMaterial extends Component {

    _isMounted = false;

    constructor(props){
        super(props);


        if (window.localStorage){
            // console.log("支持localStoryage")
            var storage = window.localStorage;
            var data = storage.getItem('data');

            if (data === {} || data === null || data === "undefined" || data === undefined){
                this.props.history.replace('/login')
            }

            this.state = {
                centerWord:"",
                allData:[],
                user: storage['data'],
                projectNames:[],
                currentName: "选择项目"
            };
        }

    }

    componentWillMount(){
        console.log(this.state)
        this._isMounted = true;
            var url = "/operate/project";

            Fetch.get(url,(array)=>{
                if (this._isMounted){
                    this.setState({
                        projectNames:JSON.parse(array)
                    });
                }
            })
    }

    componentWillUnmount(){
        this._isMounted = false;
    }


    render(){
        return(
            <div>
                <div>
                    <label style={{margin:"10px"}}>选择任务</label>
                    <Select value = {this.state.currentName} style={{ width: 300,margin:"10px" }} onChange = {this.selectTask.bind(this)}>
                        {
                            (()=>{
                                let array = [];
                                var names = this.state.projectNames;
                                for(var i = 0 ;i < names.length ;i++){
                                    array.push(<Option key = {i} value={names[i]}>{names[i]}</Option>)
                                }
                                return array;
                            })()
                        }
                    </Select>
                </div>

                <div>
                    <Input placeholder = "新的中心词" className= "newCenterWord" onChange = {this.centerWordChange.bind(this)}/>
                    <Button type="primary" style={{margin:"10px"}} onClick={this.getNewWordList.bind(this)}>增加</Button>
                </div>

                <MyTable data = {this.state.allData} dataChange = {this.tableDataChange.bind(this)}/>
                <Button type="primary" style={{margin:"10px 0px 0px 320px"}} onClick={this.finaSubmit.bind(this)}>确认</Button>
            </div>

        );
    }

    /**
     * 确认提交
     * @param event
     */
    finaSubmit(event){
        console.log("点击了最后提交按钮")
        console.log(this.state)

        var orinalData = [];
        var centerData = "";
        var tmpData = this.state.allData;
        tmpData.map((item)=>{
            if (item['equalWord']){
                orinalData.push(item['word'])
            }
            if (item['centerWord'] !== ""){
                centerData = item['centerWord']
            }
        })

        var Json = this.state.staticData;
        var subData = {};
        Json['origWords'] = orinalData;
        Json['centralWord'] = centerData;

        var url = "/operate/submit/aTask";
        Fetch.fetchPost(url,Json,(Obj)=>{
            console.log(Obj)
            message.info('提交成功');

            var url = "/operate/get/aTask" + "?projectName=" + this.state.currentName;
            Fetch.get(url,(Obj)=>{
                console.log(Obj)
                if (Obj !== ""){
                    this.setState({
                        currentName:this.state.currentName,
                        allData: this.initData(JSON.parse(Obj)),
                        staticData: JSON.parse(Obj),
                        centerWord:""
                    })
                }else {
                    this.setState({
                        currentName:this.state.currentName,
                        allData: [],
                        staticData: {},
                        centerWord:""
                    })
                }

            })
        })
    }

    getNewWordList(event){
        console.log("点击了增加新中心词按钮")
        var count = this.state.allData.length + 1;
        var addData = {
            key: `${count}`,
            equalWord: true,
            word: this.state.centerWord,
            centerWord: this.state.centerWord,
        }

        var newData = this.state.allData;
        newData.map((item)=>{
            item['centerWord'] = ''
        })

        this.setState({
            allData: [...newData,addData]
        });
    }

    initData(Obj){
        var arry = [];
        var origWords = Obj['origWords'];
        var centerWord = Obj['centralWord'];
        for(let i = 0;i<origWords.length;i++){
            var word = origWords[i];
            arry.push(
                {
                    key: `${i+1}`,
                    equalWord: true,
                    word: word,
                    centerWord: centerWord,
                }
            );
        }
        return arry;
    }

    tableDataChange(data){
        console.log("回调data===>" + data)
        this.setState({
            allData: data
        });
    }

    selectTask(value){
        if (this.state.user){
            var url = "/operate/get/aTask" + "?userName=" + JSON.parse(this.state.user).userName + "&projectName=" + value;
            Fetch.get(url,(Obj)=>{
                console.log(Obj)
                if (Obj !== ""){
                    this.setState({
                        currentName:value,
                        allData: this.initData(JSON.parse(Obj)),
                        staticData: JSON.parse(Obj)
                    })
                }else {
                    this.setState({
                        currentName:value,
                        allData: [],
                        staticData: {}
                    })
                }
            })
        }

    }

    centerWordChange(event){
        console.log("新词是：===>   " + event.target.value)
        this.setState({
            centerWord: event.target.value
        })
    }
}

export default SourceMaterial;