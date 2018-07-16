/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm } from 'antd';
import { connect } from 'react-redux';
import globals from '../../../unit';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
class formbl extends Component {
  constructor() {
    super();
    this.state={
      spinning:true,
      departmentTypeList:[{}],
      positionTypeList:[{}],
      imgs:'',
      main:{},
    }
  }

  componentWillMount (){
      // this.getData()
  }

  toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
      var val = obj[key];
      if (Array.isArray(val)) {
        return val.sort().map(function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/hr/employee/findEmployeeName', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
 
      if(result.code == 0){
        that.props.modalData['employeeList'] = result.result
      }else if(result.code == 100500){
          that.props.history.push({pathname: '/login',});
          message.warning('登录失效，请重新登录');
      }else{
        message.warning(result.message);
        that.setState({
          spinning:false,
        })
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning:false,
      })
    });
  }

  cancel(){
    this.props.history.push({pathname: '/erp/hr-entryjob-injob'});
    var obj = {name:'在职档案',menuKey:'hr-entryjob-injob',key:'hr-entryjob-injob'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  handleSubmit(){

  }

  render() {
    const { getFieldDecorator } = this.props.form;
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'upload'} />
        <div className="ant-upload-text"></div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
       <div className="PageMain">
         <div className='page_add_input'>
           <Form className="page_from" style={{width: '100%'}} ref="form">
             <div className="page_add_input_main">
                    <div className="page_add_input_main_form" style={{width:'28%'}}>
                      <FormItem
                           {...formItemLayout}
                           label="资料交接"
                         >
                         {getFieldDecorator('transferDataType', {
                           rules: [
                             { required: true, message: '请选择资料交接状态' },
                           ],
                         })(
                           <Select placeholder="请选择资料交接状态">
                             <Option value='1'>完成</Option>
                             <Option value='2'>未完成</Option>
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="财务交接"
                         >
                         {getFieldDecorator('transferFinanceType', {
                           rules: [
                             { required: true, message: '请选择财务交接状态' },
                           ],
                         })(
                           <Select placeholder="请选择财务交接状态">
                             <Option value='1'>完成</Option>
                             <Option value='2'>未完成</Option>
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="物品交接"
                         >
                         {getFieldDecorator('transferGoodsType', {
                           rules: [
                             { required: true, message: '请选择物品交接状态' },
                           ],
                         })(
                           <Select placeholder="请选择物品交接状态">
                             <Option value='1'>完成</Option>
                             <Option value='2'>未完成</Option>
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="工作交接"
                         >
                         {getFieldDecorator('transferWorkType', {
                           rules: [
                             { required: true, message: '请选择工作交接状态' },
                           ],
                         })(
                           <Select placeholder="请选择工作交接状态">
                             <Option value='1'>完成</Option>
                             <Option value='2'>未完成</Option>
                           </Select>
                         )}
                        </FormItem>

                    </div>
                    <div className="page_add_input_main_form" style={{width:'35%'}}>
                        <FormItem
                           {...formItemLayout}
                           label="交接人"
                         >
                         {getFieldDecorator('transferDataEmployeeId', {
                           rules: [
                             { required: true, message: '请选择资料交接人' },
                           ],
                         })(
                           <Select placeholder="请选择资料交接人">
                             {this.props.modalData['employeeList'].map((data,i)=>{
                               return <Option key={i} value={data.id}>{data.name}</Option>
                             })}
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="交接人"
                         >
                         {getFieldDecorator('transferFinanceEmployeeId', {
                           rules: [
                             { required: true, message: '请选择财务交接人' },
                           ],
                         })(
                           <Select placeholder="请选择资料交接人">
                             {this.props.modalData['employeeList'].map((data,i)=>{
                               return <Option key={i} value={data.id}>{data.name}</Option>
                             })}
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="交接人"
                         >
                         {getFieldDecorator('transferGoodsEmployeeId', {
                           rules: [
                             { required: true, message: '请选择物品交接人' },
                           ],
                         })(
                           <Select placeholder="请选择资料交接人">
                             {this.props.modalData['employeeList'].map((data,i)=>{
                               return <Option key={i} value={data.id}>{data.name}</Option>
                             })}
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="交接人"
                         >
                         {getFieldDecorator('transferWorkEmployeeId', {
                           rules: [
                             { required: true, message: '请选择工作交接人' },
                           ],
                         })(
                           <Select placeholder="请选择工作交接人">
                             {this.props.modalData['employeeList'].map((data,i)=>{
                               return <Option key={i} value={data.id}>{data.name}</Option>
                             })}
                           </Select>
                         )}
                        </FormItem>
                    </div>
                    <div className="page_add_input_main_form" style={{width:'37%'}}>
                        <FormItem
                           {...formItemLayout}
                           label="交接日期"
                         >
                           {getFieldDecorator('transferDataTime', {
                             rules: [{
                               required: true, message: '请选择申请日期!',
                             }],
                           })(
                             <DatePicker placeholder="选择申请日期" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="交接日期"
                         >
                           {getFieldDecorator('transferFinanceTime', {
                             rules: [{
                               required: true, message: '请选择申请日期!',
                             }],
                           })(
                             <DatePicker placeholder="选择申请日期" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="交接日期"
                         >
                           {getFieldDecorator('transferGoodsTime', {
                             rules: [{
                               required: true, message: '请选择申请日期!',
                             }],
                           })(
                             <DatePicker placeholder="选择申请日期" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="交接日期"
                         >
                           {getFieldDecorator('transferWorkTime', {
                             rules: [{
                               required: true, message: '请选择申请日期!',
                             }],
                           })(
                             <DatePicker placeholder="选择申请日期" />
                           )}
                        </FormItem>
                    </div>
                </div>
           </Form>
         </div>
       </div>
    );
  }
}

export default Form.create()(formbl);
