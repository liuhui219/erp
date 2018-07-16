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

 class form3 extends Component {
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
                     label="部门"
                   >
                     {getFieldDecorator('major', {
                       rules: [{
                         required: false, message: '请输入部门!',
                       }],
                     })(
                       <Input placeholder="请输入部门" />
                     )}
                  </FormItem>
                </div>
                <div className="form_list">

                  <FormItem
                     label="岗位"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('Academic', {
                       rules: [
                         { required: false, message: '请输入岗位!' },
                       ],
                     })(
                       <Input placeholder="请输入岗位" />
                     )}
                  </FormItem>

                </div>
              </div>
              <div style={{padding:'0 27px',paddingRight: 21}}>
                <FormItem
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                   label="备注"
                 >
                   {getFieldDecorator('schools', {
                     rules: [{
                       required: true, message: '请输入备注!',
                     }],
                   })(
                     <Input placeholder="请输入备注" />
                   )}
                </FormItem>
              </div>
          </Form>
      </div>
    );
  }
}

export default Form.create()(form3);
