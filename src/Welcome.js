/**
 * Created by wangxi on 18/7/18.
 */
import React, { Component } from 'react';
import './App.css';
// import history from './history';
import { Button,Input,Select} from 'antd';
import Tools from './Tools';
const Option = Select.Option;
const Search = Input.Search;

class Four extends Component {

    constructor(props) {
        super(props);

    }

    handleSelectChangeItem(value) {
        // console.log(`selected ${value}`);
        // console.log(value)
        var item = {
            value:value,
            childIndex:this.props.indexChild,
            parentIndex:this.props.indexParent
        }
        this.props.handleSelectChange(item);
    }


    handleChangeItem(input) {
        console.log(input.target.value)
        var item = {
            key:input.target.name,
            value:input.target.value,
            childIndex:this.props.indexChild,
            parentIndex:this.props.indexParent
        }
        this.props.handleChange(item);
    }

    handleSelectChangeTypeItem(value){
        var item = {
            type:value,
            childIndex:this.props.indexChild,
            parentIndex:this.props.indexParent
        }
        this.props.handleChangeType(item);
    }

    onSearch(value){
        var item = {
            value:value,
            childIndex:this.props.indexChild,
            parentIndex:this.props.indexParent
        }
        this.props.onSearch(item);
    }


    render(){
        if (Tools.isEmptyObject(this.props.item)){
            //为空 出现一个搜索框
            return(
                <div>
                    <Search className='InputStyle' enterButton onSearch = {this.onSearch.bind(this)}>

                    </Search>
                </div>
            )
        }else {
            if (this.props.indexChild == 0){
                return (
                    <div>
                        <Button className='InputStyle' style={{width:"20px"}}>{parseInt(this.props.indexParent) + 1}</Button>
                        <Input  className='InputStyle' defaultValue={this.props.item.name} name = "name" onChange={this.handleChangeItem.bind(this)}/>
                        <Input  className='InputStyle' defaultValue={this.props.item.degree} name = "degree" onChange={this.handleChangeItem.bind(this)}/>
                        <Input  className='InputStyle' defaultValue={this.props.item.decorate} name = "decorate" onChange={this.handleChangeItem.bind(this)}/>
                        <Select defaultValue="且" style={{ width: 120 }} name = "relationShip" onSelect={this.handleSelectChangeItem.bind(this)}>
                            <Option value="且">且</Option>
                            <Option value="或">或</Option>
                            <Option value="伴随">伴随</Option>
                        </Select>
                        {/*<Select defaultValue="新增症状" style={{ width: 120 ,margin:'10px 10px 10px 50px'}} name = "type" onSelect={this.handleSelectChangeTypeItem.bind(this)}>*/}
                            {/*<Option value="新增症状">新增症状</Option>*/}
                            {/*<Option value="新增化验">新增化验</Option>*/}
                        {/*</Select>*/}
                        <Button style={{ width: 120 ,margin:'10px 10px 10px 50px'}} name = "type" type="primary" onClick={this.handleSelectChangeTypeItem.bind(this)}>添加子项</Button>
                    </div>
                )
            }else {
                return (
                    <div>
                        <Input  className='SpInputStyle' defaultValue={this.props.item.name} name = "name" onChange={this.handleChangeItem.bind(this)}/>
                        <Input  className='InputStyle' defaultValue={this.props.item.degree} name = "degree" onChange={this.handleChangeItem.bind(this)}/>
                        <Input  className='InputStyle' defaultValue={this.props.item.decorate} name = "decorate" onChange={this.handleChangeItem.bind(this)}/>
                        <Select defaultValue="且" style={{ width: 120 }} name = "relationShip" onSelect={this.handleSelectChangeItem.bind(this)}>
                            <Option value="且">且</Option>
                            <Option value="或">或</Option>
                            <Option value="伴随">伴随</Option>
                        </Select>
                        {/*<Select defaultValue="新增症状" style={{ width: 120 ,margin:'10px 10px 10px 50px'}} name = "type" onSelect={this.handleSelectChangeTypeItem.bind(this)}>*/}
                            {/*<Option value="新增症状">新增症状</Option>*/}
                            {/*<Option value="新增化验">新增化验</Option>*/}
                        {/*</Select>*/}
                        <Button style={{ width: 120 ,margin:'10px 10px 10px 50px'}} name = "type" type="primary" onClick={this.handleSelectChangeTypeItem.bind(this)}>添加子项</Button>
                    </div>
                )
            }
        }


    }

}

export default Four;