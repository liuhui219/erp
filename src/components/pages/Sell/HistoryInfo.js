/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm,Divider } from 'antd';
import globals from '../../unit';
import moment from 'moment';
import { connect } from 'react-redux';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
var arr = [];
var mains = [];
var subData = [];
class HistoryInfo extends Component {
  constructor() {
    super();
    this.state={
      tip:'加载中...',
      spinning:true,
      mains:{},
      data:[],
      visible:false,
    }
  }

  componentDidMount(){
    this.getData();
    var obj = {name:'记录详情',menuKey:'sale-HistoryInfo/'+ this.props.match.params.id,key:'sale-HistoryInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/sale/truck/showDetails?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
        var arr = [];
        var columnData = [];
          try {
            JSON.parse(result.result.record).map((data,i)=>{
              data['key'] = i+1;
              data['index'] = that.state.data.length;
              arr.push(data)
            })
          }
          catch(err) {

          }


          that.setState({
            spinning:false,
            data:arr,
            imageUrl:globals.url.url+'/common/file/download?key='+result.result.truckInfoResourceKey,
            mains:result.result
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

  close = (e) => {
    this.props.history.push({pathname: '/erp/sale-logistics-trunk'});
    var obj = {name:'货车管理',menuKey:'sale-logistics-trunk',key:'sale-logistics-trunk'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
    var objs = {menuKey:'sale-ShipmentArrangement',key:'sale-ShipmentArrangement'};
    this.props.dispatch({ type: 'header' ,text:objs});
  }

  save = (e) => {
    this.props.history.push({pathname: '/erp/sale-History'});
    var obj = {name:'历史记录',menuKey:'sale-History',key:'sale-History'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
    var objs = {menuKey:'sale-HistoryInfo',key:'sale-HistoryInfo'};
    this.props.dispatch({ type: 'header' ,text:objs});
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      spinning:true
    });
    var that = this;
    fetch(globals.url.url+'/sale/truck/updateToRelease?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
       message.warning('放行成功!');
       that.setState({
         spinning:false,
       })
       that.props.history.push({pathname: '/erp/sale-logistics-trunk'});
       var obj = {name:'货车管理',menuKey:'sale-logistics-trunk',key:'sale-logistics-trunk'};
       that.props.dispatch({ type: 'INCREMENT' ,text:obj});
       var objs = {menuKey:'sale-OutFactory',key:'sale-OutFactory'};
       that.props.dispatch({ type: 'header' ,text:objs});
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

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
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

    const columns = [{
      width:50,
      dataIndex: 'index',
      key: 'index',
      filterDropdown: (
        <div className="custom-filter-dropdown">

        </div>
      ),
      filterIcon: <Icon style={{marginLeft:0}} type="setting" />,
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '货车状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record,i) => (
        <div>
          {record.status == 1 ? <span>已发卡</span> : null}
          {record.status == 2 ? <span>已排货</span> : null}
          {record.status == 3 ? <span>已派单</span> : null}
          {record.status == 4 ? <span>已装货</span> : null}
          {record.status == 5 ? <span>已对账</span> : null}
          {record.status == 6 ? <span>已记账</span> : null}
          {record.status == 7 ? <span>已放行</span> : null}
          {record.status == 8 ? <span>已出厂</span> : null}
        </div>
      )
    }, {
      title: '经手人',
      dataIndex: 'handler',
      key: 'handler',
    }, {
      title: '处理时间',
      dataIndex: 'handleTime',
      key: 'handleTime',
    }];




    const imageUrl = this.state.imageUrl;
    return (
      <div className="PageMain">
        <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
         <div className='page_add_input'>
           <Form className="page_from" style={{width: '100%'}} onSubmit={this.handleSubmit}>
              <div className="page_add_input_btn">
                 <li style={{fontSize:14}}>出货放行</li>
                 <div className="page_add_input_btn_right">

                     <Button type="primary" onClick={this.save.bind(this)}>
                          返回
                     </Button>
                 </div>
              </div>
              <div className="page_add_input_main">
                 <div className="page_add_input_main_form" style={{width:'28%'}}>
                     <div className="ant-row ant-form-item" style={{marginBottom:15}}>
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label title="头像">图片</label>
                        </div>

                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16" style={{height:170}}>
                            <img style={{height:90}} src={this.state.imageUrl} />
                        </div>

                     </div>
                 </div>
                 <div className="page_add_input_main_form" style={{width:'35%'}}>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>车牌号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                   {this.state.mains.truckNumber}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>IC卡号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                   {this.state.mains.cardNumber}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>门禁位置</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                   {this.state.mains.entranceGuard}
                                </span>
                            </div>
                        </div>
                     </div>
                 </div>
              </div>
            </Form>
          </div>
          <div className="page_add_tabs" style={{padding:0}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14}}>信息列表</li>

            </div>
            <div>
                <Table columns={columns} dataSource={this.state.data} pagination={false}/>
            </div>
          </div>
        </Spin>

        <Modal
          title="操作"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
           是否确定放行？
        </Modal>

      </div>
    );
  }
}
export default Form.create()(connect()(HistoryInfo));
