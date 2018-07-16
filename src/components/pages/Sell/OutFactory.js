/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm,Divider,InputNumber } from 'antd';
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
class OutFactory extends Component {
  constructor() {
    super();
    this.state={
      tip:'加载中...',
      spinning:true,
      mains:{},
      data:[],
      datas:[],
      visible:false,
      customerId:'',
      outstockItemVos:[],
      orderNumbers:[],
      salesmanId:'',
    }
  }

   async componentDidMount(){
    await this.getDatas();
    await this.getData();
    var obj = {name:'出货安排',menuKey:'sale-OutFactory/'+ this.props.match.params.id,key:'sale-OutFactory'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  getDatas(){

        var that = this;
        that.setState({
          spinning:true,
        })
        fetch(globals.url.url+'/sale/outstock/showOutstock', {
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
            var arr = [];
            var order = [];
            result.result.outstockItemVos.map((data,i)=>{
              order.push(data.orderNumber)
              data.outstockProductItemVos.map((info,j)=>{
                var obj = {
                  key:arr.length+1,
                  index:arr.length+1,
                  orderItemId:info.orderItemId,
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
                  planOutNumber:1,
                  remarks:info.remarks,
                }
                arr.push(obj)
              })
            })
             that.setState({
               spinning:false,
               mains:result.result,
               data:arr,
               orderNumbers:order,
               outstockItemVos:result.result.outstockItemVos,
               customerId:result.result.customerId,
               salesmanId:result.result.salesmanId,
             })

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

  getData(){
    var that = this;
    fetch(globals.url.url+'/sale/outstock/listOrdersByCustomerId?checkStatus=4&customerId='+this.state.customerId, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
        var arr = [];


          that.setState({
            spinning:false,
            datas:result.result.object
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
    this.setState({
      visible: true,
    });
  }



  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  planOutNumber = (index,orderItemId,orderNumber,value) => {
    var data = this.state.data;
    var main = this.state.outstockItemVos;
    data[index].planOutNumber = value;
    main.map((datas,i)=>{
      datas.outstockProductItemVos.map((info,j)=>{
        if(orderItemId == info.orderItemId && orderNumber == datas.orderNumber){
          info.planOutNumber = value
        }
      })
    })
    this.setState({
      data:data,
      outstockItemVos:main
    })
  }

  delete(index,orderItemId,orderNumber){
    var data = this.state.data;
    var main = this.state.outstockItemVos;
    data.splice(index,1)

    main.map((datas,i)=>{
      datas.outstockProductItemVos.map((info,j)=>{
        if(orderItemId == info.orderItemId && orderNumber == datas.orderNumber){
          datas.outstockProductItemVos.splice(j,1)
        }
      })
    })
    this.setState({
      data:data,
      outstockItemVos:main
    })
  }

  showModal = (e) => {
    this.setState({
      visible:true
    })
  }

  handleOk = (e) => {

        var that = this;
        that.setState({
          spinning:true,
          visible:false,
        })
        fetch(globals.url.url+'/sale/outstock/showOutstockItems', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/JSON'
          },
          body:JSON.stringify(that.state.allId)

        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          console.log(result)
          if(result.code == 0){
            var arr = that.state.data;
            var order = [];
            var outstockItemVos = result.result;
            var arrs = [];
            arr.map((infos,i)=>{
              arrs.push(infos.orderItemId)
            })
            that.state.outstockItemVos.map((data,i)=>{
              result.result.map((info,j)=>{
                if(data.orderNumbers != info.orderNumbers){
                  outstockItemVos.push(data)
                }
              })
            })
            outstockItemVos.map((data,i)=>{
              data.outstockProductItemVos.map((info,j)=>{
                if(!info.hasOwnProperty('planOutNumber')){
                  info.planOutNumber = 1
                } 
              })
            })
            result.result.map((data,i)=>{
              order.push(data.orderNumber);
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
                  planOutNumber:1,
                  remarks:info.remarks,
                }
                if(!arrs.includes(info.orderItemId)){
                  arr.push(obj)
                }
              })
            })
             that.setState({
               spinning:false,
               orderNumbers:order,
               outstockItemVos:outstockItemVos,
               data:arr,

             })

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

  handleSubmit = (e) => {
    var that = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        var obj = {
          containerNumber:values.containerNumber,
          sealNumber:values.sealNumber,
          customerId:this.state.customerId,
          salesmanId:this.state.salesmanId,
          remarks:values.remarks,
          orderNumbers:this.state.orderNumbers.join(','),
          plannedShipmentDate:values.plannedShipmentDate,
          deliveryAddress:values.deliveryAddress,
          truckNumber:values.carNumber,
          outstockItemVos:this.state.outstockItemVos
        }


        that.setState({
          spinning:true,

        })
        fetch(globals.url.url+'/sale/outstock/addToNotify', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/JSON'
          },
          body:JSON.stringify(obj)

        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          console.log(result)
          if(result.code == 0){
             that.setState({
               spinning:false,
             })
             message.success('保存成功');
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
                  <InputNumber size="small" min={1} max={record.canOutNumber} onChange={this.planOutNumber.bind(this,i,record.orderItemId,record.orderNumber)} value={record.planOutNumber} />
               </div>
            )
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width:120
    }, {
      width:80,
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                 <Popconfirm title="确定要删除?" onConfirm={this.delete.bind(this,i,record.orderItemId,record.orderNumber)}  okText="确定" cancelText="取消">
                   <Tooltip title="删除">
                       <span  className="account-table-title" style={{cursor:'pointer',marginTop:3,color:'#6eb1ff'}}>
                           <Icon type="close-circle" style={{fontSize:20,color:'#428ef2'}} />
                       </span>
                   </Tooltip>
                 </Popconfirm>
               </div>
            )
    }];

    const column = [{
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
      width:150,
    }, {
      title: '业务员',
      dataIndex: 'salesmanName',
      key: 'salesmanName',
      width:120,
    }, {
      title: '交货方式',
      dataIndex: 'deliveryWay',
      key: 'deliveryWay',
      width:120,
    }, {
      title: '交货日期',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      width:130,
    }, {
      title: '下单日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width:130,
    }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        var arr = [];
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selectedRows.map((data,i)=>{
          arr.push(data.id);
        })
        this.setState({
          allId:arr,
        })
      },
      getCheckboxProps: record => ({
        index: record.key,
      }),
    };




    const imageUrl = this.state.imageUrl;
    return (
      <div className="PageMain">
        <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
         <div className='page_add_input'>
           <Form className="page_from" style={{width: '100%'}} onSubmit={this.handleSubmit}>
              <div className="page_add_input_btn">
                 <li style={{fontSize:14}}>出货安排</li>
                 <div className="page_add_input_btn_right">

                     <Button type="primary" htmlType="submit" icon="save">
                       保存
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
                     <FormItem
                        {...formItemLayout}
                        label="车牌号"
                      >
                        {getFieldDecorator('carNumber', {
                          rules: [{
                            required: true,whitespace:true, message: '请输入车牌号!',
                          }],
                        })(
                          <Input placeholder="请输入车牌号" />
                        )}
                     </FormItem>
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
                     <FormItem
                        {...formItemLayout}
                        label="集装箱号"
                      >
                        {getFieldDecorator('containerNumber', {
                          rules: [{
                            required: true,whitespace:true, message: '请输入集装箱号!',
                          }],
                        })(
                          <Input placeholder="请输入集装箱号" />
                        )}
                     </FormItem>
                 </div>
                 <div className="page_add_input_main_form" style={{width:'37%'}}>
                     <FormItem
                        {...formItemLayout}
                        label="计划出货日期"

                      >
                      {getFieldDecorator('plannedShipmentDate', {
                        rules: [
                          { required: true, message: '请选择计划出货日期!' },
                        ],
                        initialValue:moment()
                      })(
                        <DatePicker />
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="封签号"
                      >
                        {getFieldDecorator('sealNumber', {
                          rules: [{
                            required: true,whitespace:true, message: '请输入封签号!',
                          }],
                        })(
                          <Input placeholder="请输入封签号" />
                        )}
                     </FormItem>
                 </div>
              </div>

              <div style={{padding:'0 7px',}}>
                <FormItem
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 21 }}
                   label="收货地址"
                 >
                   {getFieldDecorator('deliveryAddress', {
                     rules: [{
                       required: false, message: '请输入收货地址!',
                     }],
                     initialValue:this.state.mains.deliveryAddress
                   })(
                     <Input placeholder="请输入收货地址" />
                   )}
                </FormItem>
              </div>

              <div style={{padding:'0 7px',}}>
                <FormItem
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 21 }}
                   label="备注"
                 >
                   {getFieldDecorator('remark', {
                     rules: [{
                       required: false, message: '请输入备注!',
                     }],
                   })(
                     <Input placeholder="请输入备注" />
                   )}
                </FormItem>
              </div>


            </Form>
          </div>
          <div className="page_add_tabs" style={{padding:0}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14}}>信息列表</li>
               <div className="page_add_input_btn_right">
                   <Button onClick={this.showModal} type="primary" shape="circle" icon="plus" />
               </div>
            </div>
            <div>
                <Table columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>产品信息：{record.description}</p>} scroll={{x:1300}} dataSource={this.state.data} pagination={false}/>
            </div>
          </div>
        </Spin>

        <Modal
          title="销售单"
          visible={this.state.visible}
          onOk={this.handleOk}
          width={800}
          onCancel={this.handleCancel}
        >
           <Table columns={column} rowSelection={rowSelection} dataSource={this.state.datas} pagination={false}/>
        </Modal>

      </div>
    );
  }
}
export default Form.create()(connect()(OutFactory));
