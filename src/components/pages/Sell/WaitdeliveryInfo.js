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
class WaitdeliveryInfo extends Component {
  constructor() {
    super();
    this.state={
      tip:'加载中...',
      spinning:true,
      mains:{},
      visible:false,
    }
  }

  componentDidMount(){
    this.getData();
    var obj = {name:'出货通知单详情',menuKey:'sale-WaitdeliveryInfo/'+ this.props.match.params.id,key:'sale-WaitdeliveryInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/sale/outstock/showUnConfirm?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
        var arr = [];
        result.result.outstockItemVos.map((data,i)=>{

          data.outstockProductItemVos.map((info,j)=>{
            var obj = {
              key:arr.length+1,
              index:arr.length+1,
              orderNumber:data.orderNumber,
              deliveryTime:data.deliveryTime,
              skuInfo:info.skuCode,
              description:info.skuInfo,
              saleUtilName:info.saleUtilName,
              packUtilName:info.packUtilName,
              saleNum:info.saleNum,
              haveOutNumber:info.haveOutNumber,
              waitOutNumber:info.waitOutNumber,
              canOutNumber:info.canOutNumber,
              planOutNumber:info.planOutNumber,
              remarks:info.remarks,
            }
            arr.push(obj)
          })
        })

          that.setState({
            spinning:false,
            data:arr,
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

  handleOk = (e) => {
    var that = this;
    this.setState({
      spinning:true,
    })
    fetch(globals.url.url+'/sale/outstock/delete', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body:JSON.stringify(Array.of(that.props.match.params.id)
      )
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
         that.setState({
           spinning:false
         })
         message.success('删除成功');
         that.props.history.push({pathname: '/erp/sale-logistics-waitdelivery'});
         var obj = {name:'待出货通知单',menuKey:'sale-logistics-waitdelivery',key:'sale-logistics-waitdelivery'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
         var objs = {menuKey:'sale-WaitdeliveryInfo',key:'sale-WaitdeliveryInfo'};
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

  save = (e) => {
    this.props.history.push({pathname: '/erp/sale-WaitdeliveryEdit/'+this.props.match.params.id});
    var obj = {name:'通知单修改',menuKey:'sale-WaitdeliveryEdit/'+this.props.match.params.id,key:'sale-WaitdeliveryEdit'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});

  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  close = (e) => {
    console.log(e);
    this.setState({
      visible: true,
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
      width: 40,
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
      title: '销售单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width:130,
    }, {
      title: '订单交期',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      width:140,
    }, {
      title: '产品信息',
      dataIndex: 'skuInfo',
      key: 'skuInfo',
      width:130,
    }, {
      title: '销售单位',
      dataIndex: 'saleUtilName',
      key: 'saleUtilName',
      width:130,
    }, {
      title: '包装规格',
      dataIndex: 'packUtilName',
      key: 'packUtilName',
      width:130,
    }, {
      title: '销售数量',
      dataIndex: 'saleNum',
      key: 'saleNum',
      width:130,
    }, {
      title: '已出数量',
      dataIndex: 'haveOutNumber',
      key: 'haveOutNumber',
      width:130,
    }, {
      title: '待出数量',
      dataIndex: 'waitOutNumber',
      key: 'waitOutNumber',
      width:130,
    }, {
      title: '可出货数量',
      dataIndex: 'canOutNumber',
      key: 'canOutNumber',
      width:130,
    }, {
      title: '本次计划出货数量',
      dataIndex: 'planOutNumber',
      key: 'planOutNumber',
      width:190,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{record.planOutNumber}</span>
               </div>
            )
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width:120
    }];




    const imageUrl = this.state.imageUrl;
    return (
      <div className="PageMain">
        <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
         <div className='page_add_input'>
           <Form className="page_from" style={{width: '100%'}} onSubmit={this.handleSubmit}>
              <div className="page_add_input_btn">
                 <li style={{fontSize:14}}>详情</li>
                 <div className="page_add_input_btn_right">
                     <Button type="primary" onClick={this.close} icon="close">
                       删除
                     </Button>
                     <Button type="primary" onClick={this.save} icon="edit">
                       修改
                     </Button>
                 </div>
              </div>
              <div className="page_add_input_main">
                 <div className="page_add_input_main_form" style={{width:'28%'}}>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>客户</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                   {this.state.mains.customerName}
                                </span>
                            </div>
                        </div>
                     </div>
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
                 </div>
                 <div className="page_add_input_main_form" style={{width:'35%'}}>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>业务员</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                   {this.state.mains.salemanName}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>集装箱号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                    {this.state.mains.containerNumber}
                                </span>
                            </div>
                        </div>
                     </div>
                 </div>
                 <div className="page_add_input_main_form" style={{width:'37%'}}>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>计划出货日期</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                   {this.state.mains.plannedShipmentDate}
                                </span>
                            </div>
                        </div>
                     </div>
                     <div className="ant-row ant-form-item">
                        <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                           <label>封签号</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                            <div className="ant-form-item-control has-success">
                                <span className="ant-form-item-children">
                                    {this.state.mains.sealNumber}
                                </span>
                            </div>
                        </div>
                     </div>
                 </div>
              </div>

              <div style={{padding:'0 7px',}}>
                  <div className="ant-row ant-form-item">
                     <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-2">
                        <label>收货地址</label>
                     </div>
                     <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-21">
                         <div className="ant-form-item-control has-success">
                             <span className="ant-form-item-children">
                                {this.state.mains.deliveryAddress}
                             </span>
                         </div>
                     </div>
                  </div>
              </div>

              <div style={{padding:'0 7px',}}>
                  <div className="ant-row ant-form-item">
                     <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-2">
                        <label>备注</label>
                     </div>
                     <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-21">
                         <div className="ant-form-item-control has-success">
                             <span className="ant-form-item-children">
                                 {this.state.mains.remarks}
                             </span>
                         </div>
                     </div>
                  </div>
              </div>


            </Form>
          </div>
          <div className="page_add_tabs" style={{padding:0}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14}}>订单列表</li>

            </div>
            <div>
                <Table columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>产品信息：{record.description}</p>} scroll={{x:1300}} dataSource={this.state.data} pagination={false}/>
            </div>
          </div>
        </Spin>
        <Modal
          title="操作"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
           是否确定删除？
        </Modal>
      </div>
    );
  }
}
export default Form.create()(connect()(WaitdeliveryInfo));
