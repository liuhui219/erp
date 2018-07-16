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

 class form6 extends Component {
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
   console.log(e.target.checked)
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
    return (
      <div className="modals">
          <Form ref="form" >

              <div className="form_main">
                <div className="form_list">

                  <FormItem
                     label="关系"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('relation', {
                       rules: [
                         { required: true, message: '请填写关系!' },
                       ],
                     })(
                       <Input placeholder="请填写关系" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="职业"
                   >
                     {getFieldDecorator('profession', {
                       rules: [{
                         required: true, message: '请填写职业!',
                       }],
                     })(
                       <Input placeholder="请填写职业" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                     label="紧急联系人"
                   >
                     {getFieldDecorator('isEmergencyContact', {
                       rules: [{
                         required: false, message: '请填写职业!',
                       }],
                       initialValue:this.state.checkNick
                     })(
                       <Checkbox
                          onChange={this.handleChange}
                        >
                          {this.state.isEmergencyContact}
                        </Checkbox>
                     )}
                  </FormItem>
                </div>
                <div className="form_list">

                  <FormItem
                     label="姓名"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('name', {
                       rules: [
                         { required: true, message: '请填写姓名!' },
                       ],
                     })(
                       <Input placeholder="请填写姓名" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="工作单位"
                   >
                     {getFieldDecorator('job', {
                       rules: [{
                         required: false, message: '请填写工作单位!',
                       }],
                     })(
                       <Input placeholder="请填写工作单位" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="电话"
                   >
                     {getFieldDecorator('phoneNumber', {
                       rules: [{
                         required: false, message: '请填写电话!',
                       }],
                     })(
                       <Input placeholder="请填写电话" />
                     )}
                  </FormItem>
                </div>
              </div>
          </Form>
      </div>
    );
  }
}

export default Form.create()(form6);
