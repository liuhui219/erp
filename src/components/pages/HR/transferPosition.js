/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
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
class TransferPosition extends Component {
  constructor() {
    super();
    this.state={
      spinning:true,
      departmentTypeList:[{}],
      positionTypeList:[{}],
      imgs:'',
      main:{},
      mainData:[],
      data:{},
      userId:'',
    }
  }

  componentDidMount(){
    this.getDatas(1,20);
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

  getDatas(page,num){
    var that = this;
    fetch(globals.url.url+'/hr/employee/listPass?pageNum='+page+'&pageSize='+num, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      var arr = [];
      if(result.code == 0){
         that.setState({
           mainData:result.result.object,
           spinning:false,
         })
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

  handleSubmit = (e) => {
    e.preventDefault();
    var that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var obj = {
          applyDate:values.applyDate.format('YYYY-MM-DD'),
          employeeId:that.state.userId,
          expectDate:values.expectDate.format('YYYY-MM-DD'),
          newDepartmentId:values.newDepartmentId,
          newPositionId:values.newPositionId,
          oldDepartmentId:that.state.data['oldDepartmentId'],
          oldPositionId:that.state.data['oldPositionId'],
          startWorkTime:values.hiredate.format('YYYY-MM-DD'),
          transferReason:values.transferReason,
          transferType:values.transferType,
          workingDay:values.workingDay,
          remark:values.remark
        }
        that.modalSend(obj);
      }
    })
  }

  modalSend(obj){
    var that = this;
    fetch(globals.url.url+'/hr/transfer/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        obj
      )
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        message.success('保存成功');
        that.props.form.resetFields();
      }else{
        message.warning(result.message);

      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');

    });
  }

  handleChange(value,option){
    if(value.length>0){
      this.getUserName(value)
    }else{
      this.getDatas(1,20);
    }
    this.state.mainData.map((data,i)=>{
      if(data.id == option.key){
        this.getList(option.key)
        this.setState({
          userId:option.key
        })
      }
    })
  }

  getUserName(name){
    var that = this;
    fetch(globals.url.url+'/hr/employee/findByName?name='+name, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        console.log('xxxx0000',result)
        if(result.result == '没有符合条件的记录'){
          that.setState({
             mainData:[]
          })
        }else{
          that.setState({
             mainData:result.result
          })
        }

      }else{
        message.warning(result.message);
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
    });
  }

  getList(id){
    var that = this;
    fetch(globals.url.url+'/hr/transfer/edit?employeeId='+id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        that.setState({
          data:result.result,
          departmentTypeList:result.result.departmentTypeList,
          positionTypeList:result.result.positionTypeList,
        })
      }else{
        message.warning(result.message);
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
    });
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
           <Form className="page_from" style={{width: '100%'}} onSubmit={this.handleSubmit}>
             <div className="page_add_input_btn">
                <li style={{fontSize:14,color:'#333'}}>调岗申请</li>
                <div className="page_add_input_btn_right">

                    <Button type="primary" htmlType="submit" icon="save">
                      保存
                    </Button>
                </div>
             </div>
             <div className="page_add_input_main">
                    <div className="page_add_input_main_form" style={{width:'28%'}}>

                        <FormItem
                           {...formItemLayout}
                           label="姓名"
                         >
                           {getFieldDecorator('name', {
                             rules: [{
                               required: true,whitespace:true, message: '请选择姓名!',
                             }],
                             initialValue:this.state.main.employeeName
                           })(
                             <Select
                              mode="combobox"
                              placeholder="请选择姓名"
                              onChange={this.handleChange.bind(this)}
                              style={{ width: 170 }}
                            >
                               {this.state.mainData.length > 0 ? this.state.mainData.map((data,i)=>{
                                 return <Option value={data.name+'--'+data.number} key={data.id}>{data.name}--{data.number}</Option>
                               }) : null}
                            </Select>
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="现部门"
                         >
                           {getFieldDecorator('oldDepartmentId', {
                             rules: [{
                               required: false,whitespace:true, message: '请先选择姓名!',
                             }],
                             initialValue:this.state.data.oldDepartmentName
                           })(
                             <Input disabled placeholder="请先选择姓名" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="现岗位"
                         >
                           {getFieldDecorator('oldPositionId', {
                             rules: [{
                               required: false,whitespace:true, message: '请先选择姓名!',
                             }],
                             initialValue:this.state.data.oldPositionName
                           })(
                             <Input disabled placeholder="请先选择姓名" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="入职日期"
                         >
                           {getFieldDecorator('hiredate', {
                             rules: [{
                               required: true, message: '请选择入职日期!',
                             }],
                             initialValue:moment(this.state.data.startWorkTime)
                           })(
                             <DatePicker disabled placeholder="选择入职日期" />
                           )}
                        </FormItem>
                    </div>
                    <div className="page_add_input_main_form" style={{width:'35%'}}>

                        <FormItem
                           {...formItemLayout}
                           label="调岗类型"
                         >
                         {getFieldDecorator('transferType', {
                           rules: [
                             { required: true, message: '请选择调岗类型!' },
                           ],
                         })(
                           <Select placeholder="请选择调岗类型">
                             <Option value='1'>部门内部调岗</Option>
                             <Option value='2'>部门外部调岗</Option>
                             <Option value='3'>职务升迁</Option>
                             <Option value='4'>其他</Option>
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="调后部门"
                         >
                         {getFieldDecorator('newDepartmentId', {
                           rules: [
                             { required: true, message: '请选择入职部门!' },
                           ],
                         })(
                           <Select placeholder="请选择入职部门">
                             {this.state.departmentTypeList.map((data,i)=>{
                               return <Option key={i} value={data.id}>{data.name}</Option>
                             })}
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="调后岗位"
                         >
                         {getFieldDecorator('newPositionId', {
                           rules: [
                             { required: true, message: '请选择入职岗位!' },
                           ],
                         })(
                           <Select placeholder="请选择入职岗位">
                             {this.state.positionTypeList.map((data,i)=>{
                               return <Option key={i} value={data.id}>{data.postName}</Option>
                             })}
                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="在岗时间"
                         >
                           {getFieldDecorator('workingDay', {
                             rules: [{
                               required: false, message: '请先选择姓名!',
                             }],
                             initialValue:this.state.data.workingDay
                           })(
                             <Input disabled placeholder="请先选择姓名" />
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
                               required: false, message: '请先选择姓名!',
                             }],
                             initialValue:this.state.data.employeeNumber
                           })(
                             <Input disabled placeholder="请先选择姓名" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="调岗原因"
                         >
                           {getFieldDecorator('transferReason', {
                             rules: [{
                               required: true, message: '请输入调岗原因!',
                             }],
                           })(
                             <Input placeholder="请输入调岗原因" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="申请日期"
                         >
                           {getFieldDecorator('applyDate', {
                             rules: [{
                               required: true, message: '请选择申请日期!',
                             }],
                           })(
                             <DatePicker placeholder="选择申请日期" />
                           )}
                        </FormItem>

                        <FormItem
                           {...formItemLayout}
                           label="预计调岗日期"
                         >
                           {getFieldDecorator('expectDate', {
                             rules: [{
                               required: true, message: '请选择调岗日期!',
                             }],
                           })(
                             <DatePicker placeholder="选择调岗日期" />
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
                     {getFieldDecorator('bz', {
                       rules: [{
                         required: false, message: '请输入备注!',
                       }],
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

export default Form.create()(TransferPosition);
