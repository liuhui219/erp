/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox,Spin, message,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm } from 'antd';
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
class TransferPositionLz extends Component {
  constructor() {
    super();
    this.state={
      spinning:true,
      departmentTypeList:[{}],
      positionTypeList:[{}],
      imgs:'',
      modalDataLz:{},
      main:{},
    }
  }
  componentWillReceiveProps (nextPorops){
      this.setState({
        modalDataLz:nextPorops.modalDataLz[0]
      })
  }
  componentWillMount (){

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
    fetch(globals.url.url+'/hr/transfer/edit?employeeId='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
        that.setState({
          departmentTypeList:result.result.departmentTypeList,
          positionTypeList:result.result.positionTypeList,
          imgs:globals.url.url+'/common/file/download?key='+result.result.headResourceKey,
          main:result.result,
        })
        var obj = {name:'调岗申请-'+result.result.employeeName,menuKey:'hr-TransferPosition/'+ that.props.match.params.id,key:'hr-TransferPosition'};
        that.props.dispatch({ type: 'INCREMENT' ,text:obj});
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
    const modalDataLz = this.state.modalDataLz;
    
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
                        <div className="ant-row ant-form-item" style={{marginBottom:15}}>
                           <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                              <label className="ant-form-item-required" title="头像">头像</label>
                           </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                               <div className="page_info_image"><img style={{height:115}} src={globals.url.url+'/common/file/download?key='+modalDataLz['headResourceKey']} /></div>
                           </div>
                        </div>

                        <FormItem
                           {...formItemLayout}
                           label="离职单号"
                         >
                           {getFieldDecorator('oldDepartmentId', {
                           })(
                             <Input disabled  />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="离职类型"
                         >
                         {getFieldDecorator('dimissionType', {
                           rules: [
                             { required: true, message: '请选择离职类型!' },
                           ],
                         })(
                           <Select placeholder="请选择离职类型">
                             <Option value='1'>辞职</Option>
                             <Option value='2'>合同到期</Option>
                             <Option value='3'>试用期不合格</Option>
                             <Option value='4'>自动离职</Option>
                             <Option value='5'>急辞</Option>
                             <Option value='6'>开除</Option>
                             <Option value='7'>其他</Option>
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="申请日期"
                         >
                           {getFieldDecorator('applyTime', {
                             rules: [{
                               required: true, message: '请选择申请日期!',
                             }],
                           })(
                             <DatePicker placeholder="选择申请日期" />
                           )}
                        </FormItem>
                    </div>
                    <div className="page_add_input_main_form" style={{width:'35%'}}>
                        <FormItem
                           {...formItemLayout}
                           label="姓名"
                         >
                           {getFieldDecorator('name', {
                             rules: [{
                               required: true,whitespace:true, message: '请输入姓名!',
                             }],
                             initialValue:modalDataLz.name
                           })(
                             <Input disabled placeholder="请输入姓名" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="部门"
                         >
                         {getFieldDecorator('departmentName', {
                           rules: [
                             { required: true, message: '部门!' },
                           ],
                           initialValue:modalDataLz.departmentName
                         })(
                           <Select disabled  >
                             
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="离职原因"
                         >
                           {getFieldDecorator('dimissionReason', {
                               rules: [{
                                required: true, message: '请输入离职原因',
                              }],
                             
                           })(
                             <Input  placeholder="请输入离职原因" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="预计离职日期："
                         >
                           {getFieldDecorator('expectDimissionTime', {
                             rules: [{
                               required: true, message: '请选择预计离职日期',
                             }],
                           })(
                             <DatePicker placeholder="请选择预计离职日期" />
                           )}
                        </FormItem>
                    </div>

                    <div className="page_add_input_main_form" style={{width:'37%'}}>

                        <FormItem
                           {...formItemLayout}
                           label="工号"
                         >
                           {getFieldDecorator('number', {
                             rules: [{
                               required: false, message: '工号!',
                             }],
                             initialValue:modalDataLz.number
                           })(
                             <Input disabled placeholder="工号" />
                           )}
                        </FormItem>

                        <FormItem
                           {...formItemLayout}
                           label="岗位"
                         >
                         {getFieldDecorator('postionName', {
                           rules: [
                             { required: true, message: '请选择岗位!' },
                           ],
                           initialValue:modalDataLz.postionName
                           
                         })(
                           <Select  disabled placeholder="请选择岗位">
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="入职日期"
                         >
                           {getFieldDecorator('applyDate', {
                             rules: [{
                               required: true, message: '请选择入职日期!',
                             }],
                           initialValue:modalDataLz.hiredate
                             
                           })(
                            <Input disabled placeholder="在职时间" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="在职时间"
                         >
                           {getFieldDecorator('applyDate', {
                             rules: [{
                               required: true, message: '请输入!',
                             }],
                             initialValue:modalDataLz.workDate
                           })(
                            //  <DatePicker  placeholder="请选择在职时间!" />
                            <Input disabled placeholder="在职时间" />
                            
                           )}
                        </FormItem>

                        
                    </div>
                </div>
                <div style={{padding:'0 20px 0 9px'}}>
                  <FormItem
                     labelCol={{ span: 2 }}
                     wrapperCol={{ span: 22 }}
                     label="备注"
                   >
                     {getFieldDecorator('remark', {
                      
                     })(
                       <TextArea placeholder="请输入备注" />
                     )}
                  </FormItem>
                </div>
           </Form>
         </div>
       </div>
    );
  }
}

export default Form.create()(TransferPositionLz);
