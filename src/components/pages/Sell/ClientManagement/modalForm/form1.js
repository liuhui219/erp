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
          <Form ref="form1" >

              <div className="form_main">
                <div className="form_list">

                  <FormItem
                     label="联系人"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('contacts', {
                       rules: [
                         { required: true, message: '请填写联系人!' },
                       ],
                     })(
                       <Input placeholder="请填写联系人" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                     label="部门"
                   >
                     {getFieldDecorator('department', {
                       rules: [{
                         required: true, message: '请填写部门!',
                       }],
                     })(
                       <Input placeholder="请填写部门" />
                     )}
                  </FormItem>
                  <FormItem
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                     label="默认联系人"
                   >
                     {getFieldDecorator('isEmergencyContact' )(
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
                     label="联系电话"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }}
                   >
                     {getFieldDecorator('phone', {
                       rules: [
                         { required: true, message: '请填写联系电话!' },
                       ],
                     })(
                       <Input placeholder="请填写联系电话" />
                     )}
                  </FormItem>
                  <FormItem
                     label="职务"
                     labelCol={{ span: 7 }}
                     wrapperCol={{ span: 17 }} 
                   >
                     {getFieldDecorator('duty', {
                       rules: [
                         { required: true, message: '请填写职务!' },
                       ],
                     })(
                       <Input placeholder="请填写职务" />
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
