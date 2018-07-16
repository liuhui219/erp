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

 class form4 extends Component {
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
                     label="基本工资"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('major', {
                       rules: [{
                         required: false, message: '请输入基本工资!',
                       }],
                     })(
                       <Input placeholder="请输入基本工资" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="绩效工资"
                   >
                     {getFieldDecorator('major', {
                       rules: [{
                         required: false, message: '请输入绩效工资!',
                       }],
                     })(
                       <Input placeholder="请输入绩效工资" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="代缴代扣"
                   >
                     {getFieldDecorator('major', {
                       rules: [{
                         required: false, message: '请输入代缴代扣!',
                       }],
                     })(
                       <Input placeholder="请输入代缴代扣" />
                     )}
                  </FormItem>
                </div>
                <div className="form_list">

                  <FormItem
                     label="其他工资"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('Academic', {
                       rules: [
                         { required: false, message: '请输入其他工资!' },
                       ],
                     })(
                       <Input placeholder="请输入其他工资" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="应发工资"
                   >
                     {getFieldDecorator('certificate', {
                       rules: [{
                         required: false, message: '请输入应发工资!',
                       }],
                     })(
                       <Input placeholder="请输入应发工资" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="实发工资"
                   >
                     {getFieldDecorator('certificate', {
                       rules: [{
                         required: false, message: '请输入实发工资!',
                       }],
                     })(
                       <Input placeholder="请输入实发工资" />
                     )}
                  </FormItem>
                </div>
              </div>
             
          </Form>
      </div>
    );
  }
}

export default Form.create()(form4);
