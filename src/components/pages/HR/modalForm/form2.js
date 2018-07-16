/* @flow */

import React, { Component } from 'react';
import '../hr.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

 class form2 extends Component {
 constructor() {
   super();
   this.state={

   }
 }

 componentDidMount(){

 }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="modals">
          <Form ref="form" >
              <div style={{padding:'0 21px 0 0',marginBottom: 0,marginTop: 20}}>
                <FormItem
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  style={{marginBottom: 0}}
                   label="选择时间"
                 >
                   {getFieldDecorator('time', {
                     rules: [{
                       required: true, message: '请选择时间!',
                     }],
                   })(
                     <RangePicker  />
                   )}
                </FormItem>
              </div>
              <div className="form_main">
                <div className="form_list">

                  <FormItem
                     label="公司"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('company', {
                       rules: [
                         { required: true, message: '请填写公司名称!' },
                       ],
                     })(
                       <Input placeholder="请填写公司名称" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="职位"
                   >
                     {getFieldDecorator('job', {
                       rules: [{
                         required: true, message: '请输入职位名称!',
                       }],
                     })(
                       <Input placeholder="请输入职位名称" />
                     )}
                  </FormItem>
                </div>
                <div className="form_list">

                  <FormItem
                     label="离职原因"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('master', {
                       rules: [
                         { required: true, message: '请输入离职原因!' },
                       ],
                     })(
                       <Input placeholder="请输入离职原因" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="证明人"
                   >
                     {getFieldDecorator('reterence', {
                       rules: [{
                         required: false, message: '请输入证明人!',
                       }],
                     })(
                       <Input placeholder="请输入证明人" />
                     )}
                  </FormItem>
                </div>
              </div>
              <div style={{padding:'0 27px',paddingRight: 21}}>
                <FormItem
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                   label="联系电话"
                 >
                   {getFieldDecorator('phoneNumber', {
                     rules: [{
                       required: true, message: '请输入联系电话!',
                     }],
                   })(
                     <Input placeholder="请输入联系电话" />
                   )}
                </FormItem>
              </div>
          </Form>
      </div>
    );
  }
}

export default Form.create()(form2);
