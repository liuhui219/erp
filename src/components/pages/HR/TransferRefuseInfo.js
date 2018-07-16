/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Form7 from './modalForm/form7';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
class TransferRefuseInfo extends Component {
  constructor() {
    super();
    this.state={
      spinning:false,
      departmentTypeList:[{}],
      positionTypeList:[{}],
      imgs:'',
      main:{},
      visible1:false,
    }
  }

  componentDidMount(){
     this.getData();
  }



  getData(){
    var that = this;
    fetch(globals.url.url+'/hr/transfer/showReject?id='+this.props.match.params.id, {
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
        var obj = {name:'调岗驳回-'+result.result.employeeName,menuKey:'hr-transferjob-transFerRefuseInfo/'+ that.props.match.params.id,key:'hr-transferjob-transFerRefuseInfo'};
        that.props.dispatch({ type: 'INCREMENT' ,text:obj});
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
    this.setState({
      visible:true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
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

  handleOk(){
    const {history} = this.props;
    var that = this;
    that.setState({
      spinning:true,
      visible:false
    })
    fetch(globals.url.url+'/hr/transfer/updatePend', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:that.toQueryString({
        "ids": that.props.match.params.id,
        'refuseReason': that.state.input
      })
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){

         that.setState({
           spinning:false
         })
         message.success('重新提交');
         that.props.history.push({pathname: '/erp/hr-transferjob-refuse'});
         var obj = {name:'调岗审核',menuKey:'hr-transferjob-refuse',key:'hr-transferjob-refuse'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
         var objs = {menuKey:'hr-transferjob-transFerRefuseInfo',key:'hr-transferjob-transFerRefuseInfo'};
         that.props.dispatch({ type: 'header' ,text:objs});
      }else{
        message.warning(result.message);
        that.setState({
          spinning:false
        })
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning:false
      })
    });
  }

  sure(){
    var that = this;
    that.setState({
      spinning:true,
      visible:false
    })
    fetch(globals.url.url+'/hr/transfer/delete', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:that.toQueryString({
        "ids": that.props.match.params.id,
        'refuseReason': ''
      })
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
         that.setState({
           spinning:false
         })
         message.success('删除成功');
         that.props.history.push({pathname: '/erp/hr-transferjob-refuse'});
         var obj = {name:'调岗审核',menuKey:'hr-transferjob-refuse',key:'hr-transferjob-refuse'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
         var objs = {menuKey:'hr-transferjob-transFerRefuseInfo',key:'hr-transferjob-transFerRefuseInfo'};
         that.props.dispatch({ type: 'header' ,text:objs});
      }else{
        message.warning(result.message);
        that.setState({
          spinning:false
        })
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning:false
      })
    });
  }

  onChangeInput(e){
    this.setState({
       input:e.target.value
    })
  }

  revise(){
     this.setState({
       visible1:true
     })
  }

  dgCancel = () => {
    this.setState({
      visible1:false
    })
  }

  dgOk = () => {
    var that = this;
    this.refs.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)

        var obj = {
          applyDate:values.applyDate.format('YYYY-MM-DD'),
          employeeId:Number(that.state.main.employeeId),
          id:Number(that.props.match.params.id),
          expectDate:values.expectDate.format('YYYY-MM-DD'),
          newDepartmentId:values.newDepartmentId,
          newPositionId:values.newPositionId,
          oldDepartmentId:that.state.main['oldDepartmentId'],
          oldPositionId:that.state.main['oldPositionId'],
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
    fetch(globals.url.url+'/hr/transfer/updateTranReject', {
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
      console.log(result)
      if(result.code == 0){
        message.success('保存成功');
        that.setState({
          visible1:false
        })
        that.getData();
      }else{
        message.warning(result.message);

      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');

    });
  }

  render() {

    return (
      <div className="PageMain">
       <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
        <div className='page_add_input' style={{height:'100%'}}>
          <div className="page_from" style={{width: '100%'}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14,color:'#333'}}>调岗详情</li>
               <div className="page_add_input_btn_right">
                   <Button onClick={this.cancel.bind(this)} type="primary" icon="reload">
                     重新提交
                   </Button>
                   <Button onClick={this.sure.bind(this)}  style={{marginLeft:15}} type="primary" icon="close">
                     删除
                   </Button>
                   <Button onClick={this.revise.bind(this)} style={{marginLeft:15}}  type="primary" icon="dvt-salesOrder">
                     修改
                   </Button>
               </div>
            </div>
            <div className="page_add_input_main">
                   <div className="page_add_input_main_form" style={{width:'28%'}}>
                       <div className="ant-row ant-form-item" style={{marginBottom:15}}>
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>头像</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="page_info_image"><img style={{height:110}} src={this.state.imgs} /></div>
                          </div>
                       </div>

                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>姓名</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.employeeName}
                                  </span>
                              </div>
                          </div>
                       </div>

                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>现部门</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.oldDepartmentName}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>现岗位</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.oldPositionName}
                                  </span>
                              </div>
                          </div>
                       </div>
                   </div>
                   <div className="page_add_input_main_form" style={{width:'35%'}}>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>入职日期</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.startWorkTime}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>调岗类型</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">

                                    {this.state.main.transferType == 1 ? '部门内部调岗' : null}
                                    {this.state.main.transferType == 2 ? '部门外部调岗' : null}
                                    {this.state.main.transferType == 3 ? '职务升迁' : null}
                                    {this.state.main.transferType == 4 ? '其他' : null}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>调后部门</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.newDepartmentName}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>调后岗位</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.newPositionName}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>在岗时间</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.workingDay}
                                  </span>
                              </div>
                          </div>
                       </div>
                   </div>
                   <div className="page_add_input_main_form" style={{width:'37%'}}>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>工号</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.employeeNumber}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>调岗原因</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.transferReason}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>申请日期</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.applyDate}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label>预计调岗日期</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.expectDate}
                                  </span>
                              </div>
                          </div>
                       </div>
                   </div>
               </div>

               <div style={{padding:'0 20px 0 9px'}}>
                 <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-2">
                       <label>驳回原因</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-22">
                        <div className="ant-form-item-control has-success">
                            <span className="ant-form-item-children">
                              {this.state.main.refuseReason}
                            </span>
                        </div>
                    </div>
                 </div>
               </div>
               <div style={{padding:'0 20px 0 9px'}}>
                 <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-2">
                       <label>备注</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-22">
                        <div className="ant-form-item-control has-success">
                            <span className="ant-form-item-children">
                              {this.state.main.remark}
                            </span>
                        </div>
                    </div>
                 </div>
               </div>
          </div>
        </div>
        </Spin>
        <Modal
           title='原因'
           visible={this.state.visible}
           onOk={this.handleOk.bind(this)}
           onCancel={this.handleCancel}
           okText="确定"
           cancelText="取消"
         >
           <TextArea rows={4} onChange={this.onChangeInput.bind(this)} placeholder="请填写原因" />
       </Modal>
       <Modal
          title='调岗申请'
          visible={this.state.visible1}
          width={1000}
          onOk={this.dgOk.bind(this)}
          onCancel={this.dgCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form7 modalData={this.state.main} ref="form" />
      </Modal>
      </div>
    );
  }
}

export default connect()(TransferRefuseInfo);
