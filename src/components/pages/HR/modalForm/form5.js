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

 class form5 extends Component {
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
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="合同类型"
                   >
                     {getFieldDecorator('contractType', {
                       rules: [{
                         required: true, message: '请输入合同类型!',
                       }],
                     })(
                       <Input placeholder="请输入合同类型" />
                     )}
                  </FormItem>
                </div>
                <div className="form_list">


                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="合同期限"
                   >
                     {getFieldDecorator('contractPeriod', {
                       rules: [{
                         required: true, message: '请输入合同期限!',
                       }],
                     })(
                       <Input placeholder="请输入合同期限" />
                     )}
                  </FormItem>
                </div>
              </div>
              <div style={{padding:'0 27px',paddingRight: 21}}>
                <FormItem
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                   label="合同状态"
                 >
                   {getFieldDecorator('contractStatus', {
                     rules: [{
                       required: false, message: '请输入合同状态!',
                     }],
                   })(
                     <Input placeholder="请输入合同状态" />
                   )}
                </FormItem>
              </div>
          </Form>
      </div>
    );
  }
}

export default Form.create()(form5);
