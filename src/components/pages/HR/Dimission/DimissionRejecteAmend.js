/* @flow */

import React, { Component } from 'react';
import { Form,AutoComplete , Icon, Input, Button, message, Spin,DatePicker,Select,Table,Modal,Tooltip,Popconfirm } from 'antd';
import { connect } from 'react-redux';
import globals from '../../../unit';
import moment from 'moment';
import 'src/style/pages.less';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
const OptionA = AutoComplete.Option;
const OptGroupA = AutoComplete.OptGroup;

const { TextArea } = Input;
class TransferPositionLzMenu extends Component {
  constructor() {
    super();
    this.state={
        dataSource: [],
        modalDataLz:{},
        selectNameData:{},
    }
  }
  componentDidMount(){
    this.getData();
 }
  getData(){
    var that = this;
    fetch(globals.url.url+'/hr/dimission/showExamine?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        switch (result.result.dimissionType) {
          case 1:
          result.result.dimissionType = '离职'
              break;
          case 2:
          result.result.dimissionType = '合同到期'
              break;
          case 3:
          result.result.dimissionType = '试用期不及格'
              break;
          case 4:
          result.result.dimissionType = '自动离职'
              break;
          case 5:
          result.result.dimissionType = '急辞'
              break;
          case 6:
          result.result.dimissionType = '开除'
              break;
          case 7:
          result.result.dimissionType = '其他'
              break;
        }

        that.setState({
          modalDataLz:result.result
        })
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
  handleSubmit = (e) =>{
    let that = this
    e.preventDefault();
    that.props.form.validateFields((err, values) => {
        if (!err) {
          delete values.oldDepartmentId;

        values.applyTime = values.applyTime.format('YYYY-MM-DD')
        values.expectDimissionTime = values.expectDimissionTime.format('YYYY-MM-DD')
        for (const item in values) {
          console.log(item)
          if(!values[item]){
            values[item] = ''
          }
        }
        let obj = {
          employeeId:that.state.modalDataLz.id,
          dimissionType:values.dimissionType,
          applyTime:values.applyTime,
          expectDimissionTime:values.expectDimissionTime,
          dimissionReason:values.dimissionReason,
          remark:values.remark
        }

        that.modalSendLz(obj);
        }
    });
  }
  modalSendLz(obj){
    var that = this;
    fetch(globals.url.url+'/dimission/updateReject', {
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
        console.log(result)
        message.success('保存成功');
        that.props.history.push({pathname: '/erp/DimissionReject'});


      }else{
        message.warning(result.message);

      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');

    });
  }
  cancel = () =>{
    let that = this;
    that.props.history.push({pathname: '/erp/DepartureAuditInfo/'+that.state.modalDataLz.id});
    // var obj = {name:'离职驳回-'+that.state.modalDataLz.employeeName,menuKey:'DepartureAuditInfo',key:'DepartureAuditInfo'};
    // that.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }
  onSelect= (value) => {
    let selectNameData = this.state.selectNameData;
    value = JSON.parse(value);
    this.props.form.setFieldsValue({number:value.number})
    // setFieldsValue
    this.setState({
      modalDataLz:value
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const modalDataLz = this.state.modalDataLz;
    const { dataSource } = this.state;
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
       <div className="w_content">
           <Form className="page_from" style={{width: '100%'}} ref="form" onSubmit={this.handleSubmit}>
           <div className="w_header clearfix border1_bottom">
                <div className="f_right ">
                <Button type="primary" className="mr8" onClick={this.cancel} icon="save">
                        取消
                  </Button>
                  <Button type="primary" htmlType="submit" icon="save">
                        保存
                  </Button>
                </div>
            </div>
             <div className="page_add_input_main">
                    <div className="page_add_input_main_form" style={{width:'28%'}}>
                        <FormItem
                           {...formItemLayout}
                           label="离职单号"
                         >
                           {getFieldDecorator('oldDepartmentId', {
                             initialValue:modalDataLz.dimissionNumber
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
                           initialValue:modalDataLz.dimissionType
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
                             initialValue:moment(modalDataLz.applyTime)
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
                           {getFieldDecorator('employeeName', {
                             rules: [{
                               required: true,whitespace:true, message: '请输入姓名!',
                             }],
                             initialValue:modalDataLz.employeeName
                           })(
                             <Input disabled  placeholder="请输入姓名" />

                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="部门"
                         >
                         {getFieldDecorator('departmentName', {
                          //  rules: [
                          //    { required: true, message: '请选择部门!',whitespace:true },
                          //  ],
                           initialValue:modalDataLz.departmentName
                         })(
                           <Select disabled placeholder="请选择部门" >

                           </Select>
                         )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="离职原因"
                         >
                           {getFieldDecorator('dimissionReason', {
                               rules: [{
                                required: true, message: '请输入离职原因',whitespace:true,
                              }],
                              initialValue:modalDataLz.dimissionReason
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
                             initialValue:moment(modalDataLz.expectDimissionTime)
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
                           {getFieldDecorator('employeeNumber', {
                               rules: [{
                                required: true, message: '请输入工号',
                              }],
                             initialValue:modalDataLz.employeeNumber
                           })(
                             <Input disabled placeholder="工号" />
                           )}
                        </FormItem>

                        <FormItem
                           {...formItemLayout}
                           label="岗位"
                         >
                         {getFieldDecorator('postionName', {
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
                           {getFieldDecorator('hiredate', {

                           initialValue:modalDataLz.hiredate

                           })(
                            <Input disabled placeholder="请选择在职时间" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="在职时间"
                         >
                           {getFieldDecorator('workDay', {
                             initialValue:modalDataLz.workDay
                           })(
                            //  <DatePicker  placeholder="请选择在职时间!" />
                            <Input disabled placeholder="请选择在职时间" />

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
                       initialValue:modalDataLz.remark
                     })(
                       <TextArea placeholder="请输入备注" />
                     )}
                  </FormItem>
                </div>
           </Form>
         </div>
    );
  }
}

export default Form.create()(TransferPositionLzMenu);
