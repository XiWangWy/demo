/**
 * Created by wangxi on 18/9/21.
 */
import React from 'react';
import { Component } from 'react';
import '../CSS/SourceMaterial.css';
import MyTable from  './MyTable'
import Fetch from '../../Fetch.js'
import { message, Input, Button, Checkbox,Select, } from 'antd';
import Tools from '../../Tools'
const Option = Select.Option

class Examine extends Component{

    constructor(props){
        super(props);
        this.state = {
            centerWord:"",
            allData:[],
            projectName: Tools.getStoryageItem('projectName')
        };
    }


    componentWillMount(){
        console.log(this.state)
        this._isMounted = true;
            var url = "/manage/accurate/getAccurateTask" + "?batchNo=" + Tools.getStoryageItem('taskBatchNo');
            Fetch.get(url,(Obj)=>{
                if (this._isMounted){
                    this.setState({
                        allData:this.initData(JSON.parse(Obj)),
                        synonymsCount: JSON.parse(Obj)['synonymsHit']['hitCount'] ,
                        synonymsSum: JSON.parse(Obj)['synonymsHit']['sum'] ,
                        centralHit: JSON.parse(Obj)['centralHit']['hitCount'] ,
                        centralHitSum: JSON.parse(Obj)['centralHit']['sum'] ,
                        staticData: JSON.parse(Obj)
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
                <div>
                    <label className="centerLv">中心词精准率：{this.state.centralHit} / {this.state.centralHitSum}</label>
                    <label className="equalLv">同义词精准率：{this.state.synonymsCount} / {this.state.synonymsSum}</label>
                </div>

                <div>
                    <Input placeholder = "新的中心词" className= "newCenterWord" onChange = {this.centerWordChange.bind(this)}/>
                    <Button type="primary" style={{margin:"10px"}} onClick={this.getNewWordList.bind(this)}>增加</Button>
                </div>

                <div className="tableCenter">
                    <MyTable data = {this.state.allData} dataChange = {this.tableDataChange.bind(this)}/>
                </div>

                <Button type="primary" style={{margin:"10px 0px 0px 310px"}} onClick={this.finaSubmit.bind(this)}>确认</Button>
            </div>
        );
    }

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

        var subData = {};
        var json = this.state.staticData;
        json['origWords'] = orinalData;
        json['centralWord'] = centerData;

        var url = "/manage/accurate/doAccurateTask";
        Fetch.fetchPost(url,json,(Obj)=>{
            console.log(Obj)
            message.info('提交成功');

            var url = "/manage/accurate/getAccurateTask" + "?batchNo=" + Tools.getStoryageItem('taskBatchNo');
            Fetch.get(url,(Obj)=>{
                console.log(Obj)
                if (Obj !== ""){
                    this.setState({
                        allData:this.initData(JSON.parse(Obj)),
                        synonymsCount: JSON.parse(Obj)['synonymsHit']['hitCount'] ,
                        synonymsSum: JSON.parse(Obj)['synonymsHit']['sum'] ,
                        centralHit: JSON.parse(Obj)['centralHit']['hitCount'] ,
                        centralHitSum: JSON.parse(Obj)['centralHit']['sum'] ,
                        staticData: JSON.parse(Obj)

                    })
                }else {
                    this.setState({
                        synonymsCount: JSON.parse(Obj)['synonymsHit']['hitCount'] ,
                        synonymsSum: JSON.parse(Obj)['synonymsHit']['sum'] ,
                        centralHit: JSON.parse(Obj)['centralHit']['hitCount'] ,
                        centralHitSum: JSON.parse(Obj)['centralHit']['sum'] ,
                        staticData: {},
                        allData: []
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
        if (origWords){
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
        }

        return arry;
    }

    tableDataChange(data){
        console.log("回调data===>" + data)
        this.setState({
            allData: data
        });
    }

    centerWordChange(event){
        console.log("新词是：===>   " + event.target.value)
        this.setState({
            centerWord: event.target.value
        })
    }
}

export default Examine;