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
class TransferCheckInfo extends Component {
  constructor() {
    super();
    this.state={
      spinning:false,
      departmentTypeList:[{}],
      positionTypeList:[{}],
      imgs:'',
      main:{},
    }
  }

  componentDidMount(){
     this.getData();
  }



  getData(){
    var that = this;
    fetch(globals.url.url+'/hr/transfer/showPend?id='+this.props.match.params.id, {
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
        var obj = {name:'调岗审核-'+result.result.employeeName,menuKey:'hr-transferjob-TransferCheckInfo/'+ that.props.match.params.id,key:'hr-transferjob-TransferCheckInfo'};
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
    fetch(globals.url.url+'/hr/transfer/updateReject', {
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
         message.success('已驳回');
         that.props.history.push({pathname: '/erp/hr-transferjob-check'});
         var obj = {name:'调岗审核',menuKey:'hr-transferjob-check',key:'hr-transferjob-check'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
         var objs = {menuKey:'hr-transferjob-TransferCheckInfo',key:'hr-transferjob-TransferCheckInfo'};
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
    fetch(globals.url.url+'/hr/transfer/updatePass', {
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
         message.success('审核通过');
         that.props.history.push({pathname: '/erp/hr-transferjob-check'});
         var obj = {name:'调岗审核',menuKey:'hr-transferjob-check',key:'hr-transferjob-check'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
         var objs = {menuKey:'hr-transferjob-TransferCheckInfo',key:'hr-transferjob-TransferCheckInfo'};
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

  render() {

    return (
      <div className="PageMain">
       <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
        <div className='page_add_input' style={{height:'100%'}}>
          <div className="page_from" style={{width: '100%'}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14,color:'#333'}}>调岗详情</li>
               <div className="page_add_input_btn_right">
                   <Button type="primary" onClick={this.cancel.bind(this)} icon="close-square-o">
                     驳回
                   </Button>
                   <Button type="primary" onClick={this.sure.bind(this)} htmlType="submit" icon="save">
                     同意
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
           title='驳回原因'
           visible={this.state.visible}
           onOk={this.handleOk.bind(this)}
           onCancel={this.handleCancel}
           okText="确定"
           cancelText="取消"
         >
           <TextArea rows={4} onChange={this.onChangeInput.bind(this)} placeholder="请填写驳回原因" />
       </Modal>
      </div>
    );
  }
}

export default connect()(TransferCheckInfo);
