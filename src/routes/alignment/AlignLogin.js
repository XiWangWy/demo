/**
 * Created by wangxi on 18/9/19.
 */
import React from 'react';
import { Component } from 'react';
import '../CSS/AlinLogin.css';
// import SourceMaterial from './SourceMaterial'
import Fetch from '../../Fetch.js'
import { message,Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class AlignLogin extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                //执行登录操作
                    var url = "/login";
                    var params = {
                        "userName":values['userName'],
                        "passWord":values['password']
                    };
                    Fetch.fetchPost(url,params,(Obj)=>{

                        Obj = JSON.parse(Obj)
                        if (Obj['status'] == undefined || Obj['status'] === null || Obj['status'] === 200){
                            this.saveUserInlocal(JSON.stringify(Obj));
                            this.props.history.clear
                            var route = Obj['role'] === "USER" ? "/source" : "/task"
                            this.props.history.replace({
                                pathname:route,
                                data:Obj
                            });
                        }else {
                            message.error(Obj['message'])
                        }

                    })
            }
        });
    }

    saveUserInlocal(data){
        if (window.localStorage) {
            // console.log("支持localStoryage")
            var storage = window.localStorage;
            storage.setItem('data', data);
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="ParentApp">
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入你的用户名!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入你的密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
            </div>
        );
    }

}




export default AlignLogin;