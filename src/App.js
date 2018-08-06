import React, { Component } from 'react';
import Welcome from './Welcome';
import Four from './Four';
import './App.css';
import Fetch from './Fetch';
import Tools from "./Tools"
// import history from './history';
import { Button,Input,message} from 'antd';
const Search = Input.Search;

class App extends Component {
    relationship = ["且","或","伴随"];
    IsTouchched = false;
    constructor(props) {
        super(props);
        this.state = {
            projectId:Tools.guid(),
            id:"",
            diag:"",
            count:0,
            data:{},
            symbols:{}
        }

    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }



    /**
     * 键盘事件的监听
     * @param e
     */
    handleKeyDown = (e) => {
        // console.log(e.keyCode);
        switch (e.keyCode){
            case 13:
                console.log("你按了 回车键！！")
                if (this.IsTouchched){
                    this.IsTouchched = false;
                    break;
                }
                this.newParentLine("");
                break;
            case 9:
                console.log("你按了 Tab！！")
                break;
            case 37:
                console.log("你按了 Left！！")
                break;
            default:
                console.log("你按了 不需要处理的键！！")
                break;
        }
    }


    newDetailLine(type,childIndex,parentIndex,name){
        var index = parentIndex;
        if (type === "症状" || type === "化验"){
            var tmpData = {name:name,type:type,degree:"",decorate:"",value:"",unit:"",symbol:""};
            var nextIndex = childIndex + 1;
            var ob = this.state.data[parentIndex][nextIndex];
            if(Tools.isEmptyObject(ob)){
                this.state.data[index][childIndex] = tmpData;
                this.state.symbols[index][childIndex] = this.relationship[0];
            }else {
                var newOBj = {};
                for ( var childKey in this.state.data[index]){
                    childKey = parseInt(childKey)
                    if (childKey != childIndex){
                        newOBj[childKey] = this.state.data[index][childKey]
                    }else {
                        newOBj[childIndex] = tmpData;
                    }
                }

                var newSymbols = {};
                for ( var childKey in this.state.symbols[index]){
                    childKey = parseInt(childKey)
                    if (childKey < childIndex){
                        newSymbols[childKey] = this.state.symbols[index][childKey]
                    }else {
                        newSymbols[childIndex+1] = this.state.symbols[index][childKey];
                    }
                    newSymbols[childIndex] = this.state.symbols[index][childIndex];

                }

                this.state.data[index] = newOBj;
                this.state.symbols[index] = newSymbols;
            }

            // this.state.data[index][childIndex] = tmpData;

            this.setState({
                id:this.state.id,
                diag:this.state.diag,
                count:1,
                data:this.state.data,
                symbols:this.state.symbols
            })
            console.log(this.state)
        }

    }

    /**
     * 新增一行父项
     * @param type
     */
    newParentLine(type){
        var index = Object.keys(this.state.data).length;
        console.log(this.state)

        var childIndex;

        if(Tools.isEmptyObject(this.state.data[index])){
            this.state.data[index] = {};
        }

        if(Tools.isEmptyObject(this.state.symbols[index])){
            this.state.symbols[index] = {};
        }

        childIndex = Object.keys(this.state.data[index]).length;
        var tmpData = {};
        if (type === "症状" || type === "化验"){
            tmpData = {name:"",type:type,degree:"",decorate:"",value:"",unit:"",symbol:""};
        }

        this.state.data[index][childIndex] = tmpData;
        this.state.symbols[index][childIndex] = this.relationship[0];
        this.setState({
            id:this.state.id,
            diag:this.state.diag,
            count:1,
            data:this.state.data,
            symbols:this.state.symbols
        })
        console.log(this.state)
    }

    press(input){
        console.log(input.currentTarget.value);
    }

    onChange(event){
        console.log(event.target.value)
        this.state.diag = event.target.value;
    }

    /**
     * 监听输入框的变化 设置不同的数据
     * @param input
     */
    handleChange(input) {
        // console.log(input);
        console.log("APP.js -->   ChangeA   " + "parentIndex:  " + input.parentIndex + "   childIndex:  " + input.childIndex + " key:  " + input.key + " value:  " + input.value)
        var childIndex = input.childIndex;
        var parentIndex = input.parentIndex;
        var value = input.value;
        var key = input.key;

        var objc = this.state.data[parentIndex][childIndex];
        objc[key] = value;
        console.log(this.state.data[parentIndex])
    }


    /**
     * 删除一个子项目
     * @param childIndex
     * @param parentIndex
     * TODO 还未验证正确性 需要调试才能知道是否可用
     */
    removeChildLine(childIndex,parentIndex){
        //需要删除一个子行
        var newOBj = {};
        for ( var childKey in this.state.data[parentIndex]){
            childKey = parseInt(childKey)
            var tmpkey = childKey;
            if (childKey < childIndex){
                newOBj[childKey] = this.state.data[parentIndex][childKey]
            }else {
                if (tmpkey++ < Object.keys(this.state.data[parentIndex])){
                    newOBj[childKey] = this.state.data[parentIndex][tmpkey++]
                }
            }
        }
        this.state.data[parentIndex] = newOBj;
    }

    /**
     * 曾加一个子项目
     * @param childIndex
     * @param parentIndex
     * @param value
     * @param type
     */
    newChildLine(childIndex,parentIndex,value,type,iskong){
        //需要新增一个子行
        if(type === "新增症状"){
            type = "症状";
        }
        if(value === "新增化验"){
            type = "化验";
        }

            childIndex++;
            var index = parentIndex;

            var ob = this.state.data[parentIndex][childIndex];

            var tmpData = {};
            //初始化一个空按钮
            if (!iskong){
                tmpData  = {name:"",type:type,degree:"",decorate:"",value:"",unit:"",symbol:""};
            }


            if(Tools.isEmptyObject(ob)){
                this.state.data[index][childIndex] = tmpData;
                this.state.symbols[index][childIndex] = this.relationship[0];
            }else {
                var newOBj = {};
                for ( var childKey in this.state.data[index]){
                    childKey = parseInt(childKey)
                    if (childKey < childIndex){
                        newOBj[childKey] = this.state.data[index][childKey]
                    }else {
                        newOBj[childKey+1] = this.state.data[index][childKey]
                    }
                }
                newOBj[childIndex] = tmpData;
                this.state.data[index] = newOBj;
            }

            this.setState({
                id:this.state.id,
                diag:this.state.diag,
                count:1,
                data:this.state.data,
                symbols:this.state.symbols
            })
        console.log(this.state)
        console.log(this.state.symbols)
    }

    /**
     * 按钮新增一行
     * @param select
     */
    handleChangeType(select){
        var childIndex = select.childIndex;
        var parentIndex = select.parentIndex;
        var value = select.type;

        this.newChildLine(parseInt(childIndex),parseInt(parentIndex),value,select.type,true);
    }

    /**
     * 监听关系的选择
     * @param select
     */
    handleSelectChange(select){
        console.log("APP.js -->   Select   " + "parentIndex:  " + select.parentIndex  + "   childIndex:  " + select.childIndex + " value:  " + select.value)
        var childIndex = select.childIndex;
        var parentIndex = select.parentIndex;
        var value = select.value;

        this.state.symbols[parentIndex][childIndex] = value;

        console.log(this.state.symbols)
    }

    /**
     * 按钮保存
     */
    save(){
        //组装数据调用接口保存数据至服务器
        var saveObj = {};
        saveObj['诊断'] = this.state.diag;
        saveObj['id'] = this.state.id;
        saveObj['projectId']  =  this.state.projectId;


        var data = this.state.data;
        var symbols = this.state.symbols;




        var normal = {};
        for (var pKey in data){
            var keyObj = {};
            var oneSentenTables = [];
            var oneRelationShip = [];

            var childObj = data[pKey];
            for (var cKey in  childObj){
                oneSentenTables.push(childObj[cKey]);
            }

            var symbolsObj = symbols[pKey];
            var symbolIndex = 0;
            for (var cKey in symbolsObj){
                if (symbolIndex < Object.keys(symbolsObj).length -1){
                    oneRelationShip.push(symbolsObj[cKey]);
                }
                symbolIndex++;
            }
            keyObj['表型的关系'] = oneRelationShip;
            keyObj['表型'] = oneSentenTables;
            normal[parseInt(pKey) + 1] = keyObj;
        }
        saveObj['一般表型'] = normal;

        Fetch.fetchPost('/test',saveObj,(returnObj)=>{
            this.state.id = returnObj['id'];
            console.log("保存成功返回数据:====>" + JSON.stringify(returnObj))
            message.success("数据保存成功！");

        })

        console.log(this.state)

        console.log(saveObj)
    }

    /**
     * 调用服务器搜索
     * @param text
     */
    onSearch(item){

        var act = document.activeElement.id;
        this.IsTouchched = true;

        var text = item.value;
        var childIndex = item.childIndex;
        var parentIndex = item.parentIndex;
        console.log("点击：===》" + text);
        var param = {
          word:text
        };
        Fetch.fetchPost('/prompt',param,(obj) => {
            console.log("收到返回结果：===》" + obj['type']);
            var type = obj['type'];
            if(type === '症状' || type === '化验'){
                this.newDetailLine(type,parseInt(childIndex),parseInt(parentIndex),text);
            }
        })
    }


  render() {

        if(this.state.count === 0){
            return (
                <div>
                    <div>
                        <Input className='InputStyle' placeholder = '诊断' onChange={this.onChange.bind(this)}/>
                        <Button onClick={this.save.bind(this)}>保存</Button>

                        <Input className='ProjectId' defaultValue={this.state.projectId} onChange={this.onChange.bind(this)}/>


                    </div>

                </div>
                );
        }else {
            let d = []
            d.push(
                <div>
                    <Input className='InputStyle' placeholder = '诊断' onPressEnter = {this.press.bind(this)} defaultValue={this.state.diag}/>
                    <Button onClick={this.save.bind(this)}>保存</Button>
                    <Input className='ProjectId' defaultValue={this.state.projectId} onChange={this.onChange.bind(this)}/>
                </div>
            );

            for (var patentKey in this.state.data){
                console.log("index==>"+ patentKey);
                var obje = this.state.data[patentKey];

                var count = 0;
                for (var childKey in obje){
                    var childItem = obje[childKey];
                    var type = obje[childKey]["type"];
                    if (type === "化验" || type === undefined){
                        d.push(<Four indexParent = {patentKey}  indexChild = {childKey} childCount = {count} item={childItem} handleChangeType = {this.handleChangeType.bind(this)} handleChange={this.handleChange.bind(this)}  handleSelectChange={this.handleSelectChange.bind(this)} onSearch = {this.onSearch.bind(this)}/>)
                    }else if (type === "症状"){
                        d.push(<Welcome indexParent = {patentKey} indexChild = {childKey} childCount = {count} item={childItem} handleChangeType = {this.handleChangeType.bind(this)} handleChange={this.handleChange.bind(this)}  handleSelectChange={this.handleSelectChange.bind(this)}/>)
                    }
                    count++;
                }

            }

            return d;

        }

  }

}

export default App;
