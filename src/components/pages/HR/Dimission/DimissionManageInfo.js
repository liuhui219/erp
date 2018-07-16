/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm } from 'antd';
import { connect } from 'react-redux';
import globals from '../../../unit';

import moment from 'moment';
import 'moment/locale/zh-cn';
import Form8 from '../modalForm/formbl';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
class TransferRecordInfo extends Component {
  constructor() {
    super();
    this.state={
      spinning:false,
      departmentTypeList:[{}],
      positionTypeList:[{}],
      imgs:'',
      main:{},
      visible1:false,
      allDatas:{},
    }
  }

  componentDidMount(){
     this.getData();
  }
  selectName(){
    let that = this;
    let main = that.state.main;
    fetch(globals.url.url+'/hr/employee/findEmployeeName', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
 
      if(result.code == 0){
        console.log(main)
        main['employeeList'] = result.result
        that.setState({
          main:main
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
      console.log(error)
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning:false,
      })
    });
  }


  getData(){
    var that = this;
    fetch(globals.url.url+'/hr/dimission/showHandle?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        
        that.setState({
          departmentTypeList:result.result.departmentTypeList,
          positionTypeList:result.result.positionTypeList,
          imgs:globals.url.url+'/common/file/download?key='+result.result.headResourceKey,
          main:result.result,
        })
        that.selectName()
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
      if(result.code == 0){

         that.setState({
           spinning:false
         })
         message.success('重新提交');
         that.props.history.push({pathname: '/erp/hr-transferjob-record'});
         var obj = {name:'调岗审核',menuKey:'hr-transferjob-record',key:'hr-transferjob-record'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});

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
      if(result.code == 0){
         that.setState({
           spinning:false
         })
         message.success('删除成功');
         that.props.history.push({pathname: '/erp/hr-transferjob-record'});
         var obj = {name:'调岗审核',menuKey:'hr-transferjob-record',key:'hr-transferjob-record'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
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
  // 暂存
  dgCancel = () => {
    var that = this;
    that.setState({
      visible1:false
    })
    this.refs.form.validateFields((err, values) => {
      if (!err) {
        values.id = Number(that.props.match.params.id);
        values.employeeId = Number(that.state.main.employeeId);
        values.transferFinanceTime = values.transferFinanceTime.format('YYYY-MM-DD');
        values.transferDataTime = values.transferDataTime.format('YYYY-MM-DD');
        values.transferGoodsTime = values.transferGoodsTime.format('YYYY-MM-DD');
        values.transferWorkTime = values.transferWorkTime.format('YYYY-MM-DD');
        that.modalSends(values);
        that.setState({
          allDatas:values,
        })
      }
    })
  }
  // 保存 OK
  dgOk = () => {
    var that = this;
    this.refs.form.validateFields((err, values) => {
      if (!err) {
        values.id = Number(that.props.match.params.id);
        values.employeeId = Number(that.state.main.employeeId);
        values.transferFinanceTime = values.transferFinanceTime.format('YYYY-MM-DD');
        values.transferDataTime = values.transferDataTime.format('YYYY-MM-DD');
        values.transferGoodsTime = values.transferGoodsTime.format('YYYY-MM-DD');
        values.transferWorkTime = values.transferWorkTime.format('YYYY-MM-DD');
        that.modalSend(values);
      }
    })
  }
  // 保存
  modalSend(obj){
    var that = this;
    fetch(globals.url.url+'/hr/dimission/save', {
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
        that.setState({
          visible1:false
        })
        that.props.history.push({pathname: '/erp/hr-outjob-handle'});
        
      }else{
        message.warning(result.message);

      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');

    });
  }
  // 暂存
  modalSends(obj){
    var that = this;
    fetch(globals.url.url+'/hr/dimission/update', {
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

  saves(){
    console.log(this.state.main)
    if(!this.state.main.transferGoodsEmployeeName){
      message.warning('请先添加离职办理数据');
    }else{
      var that = this;
      let obj = {};
      obj.id = Number(that.props.match.params.id);
      obj.employeeId = Number(that.state.main.employeeId);
      obj.transferFinanceTime = that.state.main.transferFinanceTime;
      obj.transferDataTime = that.state.main.transferDataTime;
      obj.transferGoodsTime = that.state.main.transferGoodsTime;
      obj.transferWorkTime = that.state.main.transferWorkTime;
      obj.transferDataType =  that.state.main.transferDataType
      obj.transferFinanceType = that.state.main.transferFinanceType
      obj.transferGoodsType = that.state.main.transferGoodsType
      obj.transferWorkType =that.state.main.transferWorkType
      obj.transferDataEmployeeId = that.state.main.transferDataEmployeeId
      obj.transferFinanceEmployeeId = that.state.main.transferFinanceEmployeeId
      obj.transferWorkEmployeeId =  that.state.main.transferWorkEmployeeId
      obj.transferGoodsEmployeeId = that.state.main.transferGoodsEmployeeId
      that.modalSend(obj)
    }
  }
  render() {

    return (
      <div className="PageMain">
       <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
        <div className='page_add_input' style={{height:'100%'}}>
          <div className="page_from" style={{width: '100%'}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14,color:'#333'}}>调岗档案详情</li>
               <div className="page_add_input_btn_right">
                   <Button onClick={this.saves.bind(this)} type="primary" icon="reload">
                     保存
                   </Button>
                   <Button onClick={this.revise.bind(this)} style={{marginLeft:15}}  type="primary" icon="dvt-salesOrder">
                     离职办理
                   </Button>
               </div>
            </div>
               <div className= "page_add_input_main">
                   <div className="page_add_input_main_form" style={{width:'28%'}}>
                       <div className="ant-row ant-form-item" style={{marginBottom:15}}>
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="头像">头像</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="page_info_image"><img style={{height:110}} src={this.state.imgs} /></div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="员工类型">员工类型</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.employeeTypeName}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="离职类型">离职类型</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.dimissionType}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="申请日期">申请日期</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.applyTime}
                                  </span>
                              </div>
                          </div>
                       </div>
                   </div>
                   <div className="page_add_input_main_form" style={{width:'35%'}}>
                    <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                              <label title="姓名">姓名</label>
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
                             <label title="部门">部门</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.departmentName}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="离职原因">离职原因</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.dimissionReason}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="预计离职日期">预计离职日期</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.expectDimissionTime}
                                  </span>
                              </div>
                          </div>
                       </div>
                       
                   </div>
                   <div className="page_add_input_main_form" style={{width:'37%'}}>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="姓名">工号</label>
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
                             <label title="岗位">岗位</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.postionName}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="入职日期">入职日期</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.hiredate}
                                  </span>
                              </div>
                          </div>
                       </div>
                       <div className="ant-row ant-form-item">
                          <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                             <label title="在职时间">在职时间</label>
                          </div>
                          <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                              <div className="ant-form-item-control has-success">
                                  <span className="ant-form-item-children">
                                    {this.state.main.workDay}
                                  </span>
                              </div>
                          </div>
                       </div>
                   </div>
               </div>
               <div style={{padding:'0 20px 0 9px'}}>
                 <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-2">
                       <label title="姓名">备注</label>
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
          <div className="page_add_input_main">
                 <div className="page_add_input_main_form" style={{width:'28%'}}>
                    <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >资料交接</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferDataType == 1 ? '完成' : null}
                                  {this.state.main.transferDataType == 2 ? '未完成' : null}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >财务交接</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferFinanceType == 1 ? '完成' : null}
                                  {this.state.main.transferFinanceType == 2 ? '未完成' : null}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >物品交接</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferGoodsType == 1 ? '完成' : null}
                                  {this.state.main.transferGoodsType == 2 ? '未完成' : null}
                                </span>
                            </div>
                        </div>
                     </div>

                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >工作交接</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferWorkType == 1 ? '完成' : null}
                                  {this.state.main.transferWorkType == 2 ? '未完成' : null}
                                </span>
                            </div>
                        </div>
                     </div>

                 </div>
                 <div className="page_add_input_main_form" style={{width:'35%'}}>
                 <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >交接人</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferDataEmployeeName}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >交接人</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferFinanceEmployeeName}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >交接人</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferGoodsEmployeeName}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >交接人</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferWorkEmployeeName}
                                </span>
                            </div>
                        </div>
                     </div>
                 </div>
                 <div className="page_add_input_main_form" style={{width:'37%'}}>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >交接日期</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferDataTime}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>交接日期</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferFinanceTime}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >交接日期</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferGoodsTime}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label >交接日期</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                  {this.state.main.transferWorkTime}
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
          title='离职办理'
          visible={this.state.visible1}
          width={1000}
          onOk={this.dgOk.bind(this)}
          onCancel={this.dgCancel}
          okText="保存并完结"
          maskClosable={true}
          cancelText="暂存"
        >
          <Form8 modalData={this.state.main} ref="form" />
      </Modal>
      </div>
    );
  }
}

export default connect()(TransferRecordInfo);
