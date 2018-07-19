import React, { Component } from 'react';
import Welcome from './Welcome';
import Four from './Four';
import './App.css';
import Fetch from './Fetch';
// import history from './history';
import { Button,Layout,Menu, Icon,Breadcrumb,Input} from 'antd';
// const {Header,Footer,Sider,Content} = Layout
// const { SubMenu } = Menu;
const Search = Input.Search;

class App extends Component {
    relationship = new Array("且","或","伴随");

    constructor(props) {
        super(props);
        this.state = {
            diag:"",
            count:0,
            data:{},
            symbols:{}
        }

    }


    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    isEmptyObject(obj){
    if (JSON.stringify(obj) == '{}' || obj == undefined) {
        return true;
    } else {
        return false;
    }
}

    handleKeyDown = (e) => {
        console.log(e.keyCode);
        switch (e.keyCode){
            case 13:
                console.log("你按了 回车键！！")
                this.newParentLine("症状");
                break;
            case 9:
                console.log("你按了 Tab！！")
                break;
            case 37:
                console.log("你按了 Left！！")
                break;

        }
    }


    newParentLine(type){
        var index = Object.keys(this.state.data).length;
        console.log(this.state)

        var childIndex;

        if(this.isEmptyObject(this.state.data[index])){
            this.state.data[index] = {};
        }

        if(this.isEmptyObject(this.state.symbols[index])){
            this.state.symbols[index] = {};
        }

        childIndex = Object.keys(this.state.data[index]).length;

        var tmpData = {name:"",type:type,degree:"",decorate:"",value:"",unit:"",symbol:""};

        this.state.data[index][childIndex] = tmpData;
        this.state.symbols[index][childIndex] = this.relationship[0];
        this.setState({
            diag:this.state.diag,
            count:1,
            data:this.state.data,
            symbols:this.state.symbols
        })
        console.log(this.state)
    }



    // onClick(e){
    //     console.log(history)
    //     history.push('/login');
    //   //   history.replace('/login');
    // }


    press(input){
        console.log(input.currentTarget.value);
        // this.state.data.push({aa:"hahh",bb:"ddd",cc:"wwww"})
        // this.setState({
        //     count:1,
        //     data:this.state.data
        // })
    }

    onChange(event){
        console.log(event.target.value)
        this.state.diag = event.target.value;
    }


    handleChange(input) {
        // console.log(input);
        console.log("APP.js -->   ChangeA   " + "index:  " + input.childIndex + " key:  " + input.key + " value:  " + input.value)
        var childIndex = input.childIndex;
        var parentIndex = input.parentIndex;
        var value = input.value;
        var key = input.key;

        var objc = this.state.data[parentIndex][childIndex];
        objc[key] = value;
        console.log(this.state.data[parentIndex])
    }

    newChildLine(childIndex,parentIndex,value,type){
        //需要新增一个子行
        if(type == "新增症状"){
            type = "症状";
        }
        if(value == "新增化验"){
            type = "化验";
        }


            childIndex++;
            var index = parentIndex;

            var ob = this.state.data[parentIndex][childIndex];
            var tmpData = {name:"",type:type,degree:"",decorate:"",value:"",unit:"",symbol:""};
            if(this.isEmptyObject(ob)){
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
                diag:this.state.diag,
                count:1,
                data:this.state.data,
                symbols:this.state.symbols
            })
            console.log(this.state)
        console.log(this.state.symbols)
    }

    handleChangeType(select){
        var childIndex = select.childIndex;
        var parentIndex = select.parentIndex;
        var value = select.type;

        this.newChildLine(parseInt(childIndex),parseInt(parentIndex),value,select.type);
    }

    handleSelectChange(select){
        console.log("APP.js -->   Select   " + "index:  " + select.index + " value:  " + select.value)
        var childIndex = select.childIndex;
        var parentIndex = select.parentIndex;
        var value = select.value;

        this.state.symbols[parentIndex][childIndex] = value;

        console.log(this.state.symbols)

    }

    save(){
        console.log(this.state)
    }

    onSearch(text){
        console.log("点击：===》" + text);
        var param = {
          word:text
        };
        Fetch.fetchPost('/prompt',param,(obj) => {
            console.log("收到返回结果：===》" + obj['type']);
            var type = obj['type'];
            if(type == '症状' || '化验'){
                this.newParentLine(type);
            }
        })
    }


  render() {

        if(this.state.count == 0){
            return (
                <div>
                    <div>
                        <Input className='InputStyle' placeholder = '诊断' onChange={this.onChange.bind(this)}/>
                        <Button onClick={this.save.bind(this)}>保存</Button>
                    </div>
                        <Search className='InputStyle' enterButton onSearch={this.onSearch.bind(this)}>

                        </Search>
                </div>
                );
        }else {
            let d = []
            d.push(
                <div>
                    <Input className='InputStyle' placeholder = '诊断' onPressEnter = {this.press.bind(this)} defaultValue={this.state.diag}/>
                    <Button onClick={this.save.bind(this)}>保存</Button>
                </div>
            );

            for (var patentKey in this.state.data){
                console.log("index==>"+ patentKey);
                var obje = this.state.data[patentKey];

                var count = 0;
                for (var childKey in obje){
                    var childItem = obje[childKey];
                    var type = obje[childKey]["type"];
                    if (type == "化验"){
                        d.push(<Four indexParent = {patentKey}  indexChild = {childKey} childCount = {count} item={childItem} handleChangeType = {this.handleChangeType.bind(this)} handleChange={this.handleChange.bind(this)}  handleSelectChange={this.handleSelectChange.bind(this)}/>)
                    }else {
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
