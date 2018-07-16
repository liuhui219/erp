import React from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin  } from 'antd';
import globals from '../unit';
import md5 from 'md5';
const FormItem = Form.Item;
var reg = /^1[3|4|5|7|8][0-9]{9}$/;
class Login extends React.Component {

    constructor() {
      super();
      this.state={
        isLogin:true,
        login:true,
        logins:true,
        codes:true,
        getTime:'获取验证码',
        code:globals.url.url+'/common/validate/get/0'
      }
    }

    componentDidMount(){
      globals.setCookies('data','',-1)
      globals.setCookies('isLogin','',-1)
      var that = this;
      fetch(globals.url.url+'/common/index/logout', {
        method: 'GET',
        credentials: 'include'
      }).then(function(response) {
        return response.json();
      }).then(function(result) {
        console.log(result)
        if(result.code == 0){
           console.log(result)
        }else if(result.code == 100500){

        }else{
          message.warning(result.message);
        }
      }).catch((error) => {
        message.warning('加载失败，请刷新重试');
      });
    }



    Login(values){
      var that = this;
      const { history } = this.props;
      fetch(globals.url.url+'/common/index/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "phoneNumber": values.userName,
          "password": md5(values.password),
          'validationCode': values.code
        })
      }).then(function(response) {
        return response.json();
      }).then(function(result) {
        console.log(result)
        if(result.code == 0){
          that.setState({
            login:true
          })
          globals.setCookies('data',encodeURIComponent(JSON.stringify(result.result)),5)
          history.push('/erp/home');
          if(values.remember){
             globals.setCookies('isLogin','true',5)
          }
        }else{
          message.warning(result.message);
          that.setState({
            login:true
          })
        }
      }).catch((error) => {
        message.warning('加载失败，请刷新重试');
        that.setState({
          login:true
        })
      });
    }

    handleSubmit = (e) => {
        var that = this;
        e.preventDefault();
        const { history } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
              that.setState({
                login:false
              })
              console.log(values)
              that.Login(values);
            }
        });
    };

    handleSubmits = (e) => {
        var that = this;
        e.preventDefault();
        const { history } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
              that.setState({
                logins:false
              })
              console.log(values)
              that.updatePass(values)
            }
        });
    };

    updatePass(values){
      var that = this;
      const { history } = this.props;
      fetch(globals.url.url+'/common/index/updatePassword', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "phoneNumber": values.userNames,
          "password": md5(values.newPassword),
          "passwordConfirm":md5(values.newPasswords),
          'identifyCode': values.codes
        })
      }).then(function(response) {
        return response.json();
      }).then(function(result) {
        console.log(result)
        if(result.code == 0){
          that.setState({
            logins:true,
            isLogin:true
          })
          message.success('提交成功');
        }else{
          message.warning(result.message);
          that.setState({
            logins:true
          })
        }
      }).catch((error) => {
        message.warning('加载失败，请刷新重试');
        that.setState({
          logins:true
        })
      });
    }

    forGet(bool){
      this.setState({
        isLogin:bool
      })
    }

    changeName = (rule, value, callback) => {
      if(!value){
        callback('账号不能为空');
      }
      else if(reg.test(value) || value == 'admin'){
        callback();
        return;
      }else{
        callback('手机号格式不对');
      }
    }

    changeNames = (rule, value, callback) => {
      console.log(value)
      if(!value){
        callback('账号不能为空');
      }
      else if(reg.test(value)){
        callback();
        return;
      }else{
        callback('手机号格式不对');
      }
    }

    changgeNewPassword = (rule, value, callback) => {
      if(!value){
        callback('请输入新密码');
      }else if(value.length < 8){
        callback('密码长度至少8位');
      }else if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)){
        callback('密码必须包含英文字母，数字或字符串');
      }else{
        callback();
      }
    }

    changgeNewPasswords = (rule, value, callback) => {
      console.log(value)
      if(!value){
        callback('请输入新密码');
      }
      else if(value != this.props.form.getFieldValue('newPassword')){
        callback('两次密码不一致，请重新输入');
        return;
      }else{
        callback();
      }
    }

    getCode(){
      this.setState({
        code:globals.url.url+'/common/validate/get/'+Math.random()
      })
    }

    getCodes(){
      var that = this;
      console.log(this.props.form.getFieldValue('userNames'))
      if(!reg.test(this.props.form.getFieldValue('userNames'))){
        message.warning('手机号格式不对');
      }else{
        fetch(globals.url.url+'/common/message/send?phoneNumber='+this.props.form.getFieldValue('userNames'), {
          method: 'GET',
          credentials: 'include'
        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          console.log(result)
          if(result.code == 0){
            that.setState({
              codes:false,
            })
            var Time = 60;
            that.Countdown = setInterval(() =>{
                   Time = Time-1;
                   that.setState({
                     getTime:Time+'s后获取'
                   })
                   if(Time < 1){
                     clearInterval(that.Countdown);
                     that.setState({
                       getTime:'获取验证码',
                       codes:true
                     })
                   }
            },1000);
          }else{
            message.warning(result.message);
          }
        }).catch((error) => {
          message.warning('加载失败，请刷新重试');
        });
      }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                {this.state.isLogin ? <div className="login-form" >
                    <div className="login-logo">
                        <span>登录</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px',width: '100%'}}>
                        <FormItem label="账号">
                            {getFieldDecorator('userName', {
                                rules: [{ required: true,max:11,whitespace:true,validator:this.changeName }],
                                initialValue:''
                            })(
                                <Input maxLength='11'  prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入手机号" />
                            )}
                        </FormItem>
                        <FormItem label="密码" >
                            {getFieldDecorator('password', {
                                rules: [{ required: true,whitespace:true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入登录密码" />
                            )}
                        </FormItem>
                        <div className="login_code">
                            <FormItem label="验证码" >
                                {getFieldDecorator('code', {
                                    rules: [{ required: true,whitespace:true, message: '请输入验证码!' }],
                                })(
                                    <Input prefix={<Icon type="tags-o" style={{ fontSize: 13 }} />}placeholder="请输入验证码" />
                                )}
                            </FormItem>
                            <span onClick={this.getCode.bind(this)} className="code"><img src={this.state.code} /></span>
                        </div>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>自动登录</Checkbox>
                            )}
                            <a className="login-form-forgot" href="javascipt:"  onClick={this.forGet.bind(this,false)} style={{float: 'right'}}>忘记密码</a>
                            {this.state.login ? <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button> : <Button type="primary" className="login-form-button"  loading style={{width: '100%'}}>
                                登录中...
                            </Button>}

                        </FormItem>
                    </Form>
                </div>
                :
                <div className="login-form" >
                    <div className="login-logo">
                        <span>找回密码</span>
                    </div>
                    <Form onSubmit={this.handleSubmits}  style={{maxWidth: '300px',width: '100%'}}>
                        <FormItem label="账号" >
                            {getFieldDecorator('userNames', {
                                rules: [{ required: true,whitespace:true,validator:this.changeNames}],
                            })(
                                <Input maxLength='11' prefix={<Icon type="user" style={{ fontSize: 13 }} />}  placeholder="请输入手机号" />
                            )}
                        </FormItem>
                        <div className="login_code">
                            <FormItem label="短信验证码" >
                                {getFieldDecorator('codes', {
                                    rules: [{ required: true,whitespace:true, message: '请输入短信验证码!' }],
                                })(
                                    <Input prefix={<Icon type="tags-o" style={{ fontSize: 13 }} />}placeholder="请输入短信验证码" />
                                )}
                            </FormItem>
                            <span onClick={this.getCodes.bind(this)} style={{width:102,}} className="code">
                              {this.state.codes ? <Button size='default'>获取验证码</Button> : <Button style={{width:102}} size='default' disabled>{this.state.getTime}</Button>}
                            </span>
                        </div>
                        <FormItem label="新密码" >
                            {getFieldDecorator('newPassword', {
                                rules: [{ required: true,whitespace:true,validator:this.changgeNewPassword }],
                            })(
                                <Input  maxLength='20' prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入新密码" />
                            )}
                        </FormItem>
                        <FormItem label="确认新密码" >
                            {getFieldDecorator('newPasswords', {
                                rules: [{ required: true,whitespace:true,validator:this.changgeNewPasswords }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入新密码" />
                            )}
                        </FormItem>
                        <FormItem>

                            <a className="login-form-forgot" href="javascipt:" onClick={this.forGet.bind(this,true)} style={{float: 'right'}}>继续登录</a>
                            {this.state.logins ? <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                确定
                            </Button> : <Button type="primary" className="login-form-button"  loading style={{width: '100%'}}>
                                提交中...
                            </Button>}

                        </FormItem>
                    </Form>
                </div>}


            </div>

        )
    }
}

export default (Form.create()(Login));
