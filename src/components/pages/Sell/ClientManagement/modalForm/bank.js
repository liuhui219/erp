/* @flow */

import React, { Component } from 'react';
import '../../../HR/hr.less';

import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

 class form1 extends Component {
 constructor() {
   super();
   this.state={
      isEmergencyContact:'否',
      checkNick: false,
   }
 }

 componentDidMount(){

 }

 handleChange = (e) => {
   if(e.target.checked){
     this.setState({
       checkNick: e.target.checked,
       isEmergencyContact:'是'
     });
   }else{
     this.setState({
       checkNick: e.target.checked, 
       isEmergencyContact:'否'
     });
   }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const data = this.props.data; 
    // const { contact } = this.props.contact;
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    return (
      <div className="w_page">
          <Form  className="page_from" style={{ width: '100%' }} onSubmit={this.props.information}>
              <div className="w_header clearfix border1_bottom">
                  <div className="f_right ">
                      <Button type="primary" htmlType="submit" icon="save">
                          保存
                      </Button>
                  </div>
              </div>
              <div className="page_add_input_main">
                  <div className="page_add_input_main_form" style={{ width: '28%' }}>
                      <FormItem
                          {...formItemLayout}
                          label="开户银行"
                      >
                          {getFieldDecorator('bankId', {
                              rules: [{
                                  required: true, message: '请选择开户银行',
                              }]
                          })(
                              <Select placeholder="请选择业务区域">
                                {data.bankList.map((data,i)=>{
                                    return <Option key={i} value={data.id}>{data.name}</Option>
                                })}
                               </Select>
                          )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="银行账户"
                      >
                          {getFieldDecorator('bankAccount', {
                              rules: [{
                                  required: true, whitespace: true, message: '请输入银行账户!',
                              }]
                          })(
                              <Input placeholder="请输入银行账户" />
                          )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="财户名称"
                      >
                          {getFieldDecorator('accountName', {
                              rules: [{
                                  required: true, whitespace: true, message: '请选择财户名称!',
                              }]
                          })(
                              <Input placeholder="请选择财户名称" />
                          )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="币种"
                      >
                          {getFieldDecorator('currencyId', {
                              rules: [{
                                  required: true, message: '请选择币种!',
                              }]
                          })(
                            <Select placeholder="请选择币种">
                            {data.currencyList.map((data,i)=>{
                                return <Option key={i} value={data.id}>{data.name}</Option>
                            })}
                           </Select>
                          )}
                      </FormItem>
                  </div>
                  <div className="page_add_input_main_form" style={{ width: '35%' }}>
                      <FormItem
                          {...formItemLayout}
                          label="开票抬头"
                      >
                          {getFieldDecorator('ticketHead', {
                              rules: [{
                                  required: true, whitespace: true, message: '请输入开票抬头!',
                              }]
                          })(
                              <Input placeholder="请输入开票抬头" />
                          )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="开户行"
                      >
                          {getFieldDecorator('openingBank', {
                              rules: [{
                                  required: false, message: '请选择开户行!',
                              }]
                          })(
                              <Input placeholder="请选择开户行" />
                          )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="开户账号"
                      >
                          {getFieldDecorator('openingNumber', {
                              rules: [{
                                  required: true, message: '请输入开户账号!',
                              }]
                          })(
                              <Input placeholder="请输入开户账号" />
                          )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="纳税人识别号"
                      >
                          {getFieldDecorator('identificationNumber', {
                              rules: [{
                                  required: true, message: '请输入纳税人识别号!',
                              }]
                          })(
                              <Input placeholder="请输入纳税人识别号" />
                          )}
                      </FormItem>
                  </div>
                  <div className="page_add_input_main_form" style={{ width: '37%' }}>
                      <FormItem
                          {...formItemLayout}
                          label="结算方式"
                      >
                          {getFieldDecorator('settleWayId', {
                              rules: [{
                                  required: false,  message: '请选择结算方式!',
                              }]
                          })(
                            <Select placeholder="请选择结算方式">
                            {data.settleWayList.map((data,i)=>{
                                return <Option key={i} value={data.id}>{data.name}</Option>
                            })}
                           </Select>
                          )}
                      </FormItem>
                      <FormItem
                          {...formItemLayout}
                          label="收款条件"
                      >
                          {getFieldDecorator('receiveWayId')(
                              // <Input placeholder="请选择行业" />
                              <Select placeholder="请选择收款条件">
                                    {data.receiveWayList.map((data,i)=>{
                                        return <Option key={i} value={data.id}>{data.name}</Option>
                                    })}
                                </Select>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
                          )}
                      </FormItem>
                  </div>
              </div>
          </Form>
      </div>
    );
  }
}

export default Form.create()(form1);
