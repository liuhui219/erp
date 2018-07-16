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
class ShipmentArrangement extends Component {
  constructor() {
    super();
    this.state={
      tip:'加载中...',
      spinning:true,

    }
  }

  componentDidMount(){
    this.getData();
    var obj = {name:'出货安排',menuKey:'sale-ShipmentArrangement/'+ this.props.match.params.id,key:'sale-ShipmentArrangement'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/product/product/showById?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
        var column = [];
        var columnData = [];

          JSON.parse(result.result.productSku.skuHead).map((data,i)=>{
            that.state.proSkuCategory.map((info,j)=>{
              if(info.id == data){
                var obj = {
                  title: info.categoryName,
                  dataIndex: info.categoryName,
                  key: info.categoryName,
                }
                column.push(obj);
              }
            })
          })
          JSON.parse(result.result.productSku.skuBody).map((data,i)=>{
             data['key'] = i;
             columnData.push(data)
          })
          that.setState({
            spinning:false,
            column:column,
            imageUrl:globals.url.url+'/common/file/download?key='+result.result.imgResourceKey,
            data:columnData,
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
    this.props.history.push({pathname: '/erp/sale-logistics-trunk'});
    var obj = {name:'货车管理',menuKey:'sale-logistics-trunk',key:'sale-logistics-trunk'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
    var objs = {menuKey:'sale-ShipmentArrangement',key:'sale-ShipmentArrangement'};
    this.props.dispatch({ type: 'header' ,text:objs});
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




    const imageUrl = this.state.imageUrl;
    return (
      <div className="PageMain">
        <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
         <div className='page_add_input'>
           <Form className="page_from" style={{width: '100%'}} onSubmit={this.handleSubmit}>
              <div className="page_add_input_btn">
                 <li style={{fontSize:14}}>出货安排</li>
                 <div className="page_add_input_btn_right">
                     <Button type="primary" onClick={this.close} icon="close">
                       取消
                     </Button>
                     <Button type="primary" onClick={this.save} icon="save">
                       保存
                     </Button>
                 </div>
              </div>
              <div className="page_add_input_main">
                 <div className="page_add_input_main_form" style={{width:'28%'}}>
                     <FormItem
                        {...formItemLayout}
                        label="客户"

                      >
                      {getFieldDecorator('stockTypeId', {
                        rules: [
                          { required: true, message: '请选择客户!' },
                        ],
                      })(
                        <Select placeholder="请选择客户" >
                          <Option value='123'>123</Option>
                        </Select>
                      )}
                     </FormItem>
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
                     <FormItem
                        {...formItemLayout}
                        label="业务员"

                      >
                      {getFieldDecorator('stockTypeId', {
                        rules: [
                          { required: true, message: '请选择业务员!' },
                        ],
                      })(
                        <Select placeholder="请选择业务员" >
                          <Option value='123'>123</Option>
                        </Select>
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="集装箱号"
                      >
                        {getFieldDecorator('carNumber', {
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
                      {getFieldDecorator('time', {
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
                        {getFieldDecorator('carNumber', {
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
                   {getFieldDecorator('schools', {
                     rules: [{
                       required: false, message: '请输入收货地址!',
                     }],
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
                   {getFieldDecorator('schools', {
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
               <li style={{fontSize:14}}>订单列表</li>
               <div className="page_add_input_btn_right">
                   <Button type="primary" shape="circle" icon="plus" />
               </div>
            </div>
            <div>
                <Table columns={this.state.column} dataSource={this.state.data} pagination={false}/>
            </div>
          </div>
        </Spin>

      </div>
    );
  }
}
export default Form.create()(connect()(ShipmentArrangement));
