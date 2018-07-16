/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm,Divider,InputNumber  } from 'antd';
import globals from '../../unit';
import moment from 'moment';
import { connect } from 'react-redux';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Search = Input.Search;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
var arr = [];
var mains = [];
var subData = [];
class EditOrderDraft extends Component {
  constructor() {
    super();
    this.state={
      tip:'加载中...',
      spinning:true,
      businessTypeList:[{}],
      currencyList:[{}],
      deliveryWayList:[{}],
      payWayList:[{}],
      salesmanList:[{}],
      settleWayList:[{}],
      unitList:[{}],
      packingUnitList:[{}],
      departmentName:'',
      mainData:[],
      type:'',
      visible:false,
      datas:[],
      data:[],
      selectedRows:[],
      price:'',
      units:'',
      dprice:0,
      zNum:0,
      sl:0,
      proSkuValueList:[],
      selectS:[],
      values:'',
      combinationData:[],
      skuData:[],
      stringCombination:[],
      Selectvalues:'',
      customerId:'',
      mains:{},
    }
  }

  componentDidMount(){
    this.getData();
    this.getDatas();
    this.getSelect();
    this.props.history.push({pathname: '/erp/sale-EditOrderDraft/' +this.props.match.params.id});
    var obj = {name:'订单修改',menuKey:'sale-EditOrderDraft/'+ this.props.match.params.id,key:'sale-EditOrderDraft'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/sale/order/orderInfoData', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
          that.setState({
            spinning:false,
            businessTypeList:result.result.businessTypeList,
            currencyList:result.result.currencyList,
            deliveryWayList:result.result.deliveryWayList,
            payWayList:result.result.payWayList,
            salesmanList:result.result.salesmanList,
            settleWayList:result.result.settleWayList,
            unitList:result.result.unitList,
            packingUnitList:result.result.packingUnitList,
            price:result.result.currencyList[0].name,
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

  getDatas(){
    var that = this;
    fetch(globals.url.url+'/sale/orderDraft/show?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
        var arr = [];
        result.result.items.map((data,i)=>{
          data.description = data.skuCode;
          arr.push(data)
        })
          that.setState({
            spinning:false,
            mains:result.result,
            data:arr,
            customerId:result.result.customerId
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

  handleSelectChange = (value) => {
    console.log(value)
    this.state.salesmanList.map((data,i)=>{
      if(data.id == value){
        this.setState({
          departmentName:data.departmentName
        })
      }
    })
  }

  handleChange(value,option){
    console.log(option)

    if(value.length == 0){
      this.setState({
         mainData:[]
      })
    }
    this.state.mainData.map((data,i)=>{
      if(data.id == option.key){
        if(data.type == 1){
          this.setState({
            type:'标准客户'
          })
        }else if(data.type == 2){
          this.setState({
            type:'寄库客户'
          })
        }else if(data.type == 3){
          this.setState({
            type:'个人客户'
          })
        }
      }
    })
    this.setState({
       customerId:option.key
    })
    this.props.form.setFieldsValue({
      customerId: option.key
    });
    this.getUserName(value)
  }

  getUserName(name){
    var that = this;
    fetch(globals.url.url+'/sale/customer/listByName?name='+name, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        console.log('xxxx0000',result)
        that.setState({
           mainData:result.result
        })
      }else{
        message.warning(result.message);
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
    });
  }

  Search(value){
    console.log(value)
    var that = this;
    if(value.length == 0){
      message.warning('请输入搜索信息');
    }else{
      fetch(globals.url.url+'/product/product/findLike?param='+value, {
        method: 'GET',
        credentials: 'include'
      }).then(function(response) {
        return response.json();
      }).then(function(result) {
        if(result.code == 0){
          console.log('xxxx00001111',result)
          var arr = [];
          result.result.map((data,i)=>{
            if(data.hasOwnProperty('skuCode')){
              var obj = {
                key:arr.length+1,
                index:arr.length+1,
                productId:data.productId,
                info:data['skuCode']+'-'+data['skuName'],
                combination:data.combination,
                skuCode:data['skuCode']
              }
            }else{
              return
            }

            arr.push(obj)
          })
          that.setState({
            visible:true,
            datas:arr
          })
        }else{
          message.warning(result.message);
        }
      }).catch((error) => {
        message.warning('加载失败，请刷新重试');
      });
    }

  }

  handleOk = (e) => {
    console.log(e);
    var arr = [];
    this.state.selectedRows.map((data,i)=>{
        console.log(data)

          var obj = {
            key:i+1,
            description:data.info,
            skuInfo:'',
            saleNum:0,
            saleUtilId:'',
            packNum:0,
            packUtilId:'',
            price:0,
            priceUnit:0,
            discountNum:0,
            taxRate:0,
            money:0,
            tax:0,
            productId:data.productId,
            amount:'',
            remark:'',
            units:'',
            skuCode:data.skuCode,
            combination:data.combination
          }


        arr.push(obj)



    })
    console.log(arr)
    this.setState({
      visible: false,
      data:arr,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  priceChange = (value) => {
    console.log(value)
    this.state.currencyList.map((data,i)=>{
      if(data.id == value){
        this.setState({
          price:data.name
        })
      }
    })
  }

  sellUnit = (index,value) => {
    var data = this.state.data;
    data[index].saleUtilId = value;
    this.state.unitList.map((datas,i)=>{
      if(datas.id == value){
        data[index].units = datas.name;
        this.setState({
          data:data,
        })
      }
    })
  }

  dprice = (index,value) => {
    console.log(index)
    var data = this.state.data;
    data[index].price = value;
    this.setState({
      data:data
    })
  }

  zNum = (index,value) => {
    var data = this.state.data;
    data[index].discountNum = value;
    this.setState({
      data:data
    })
  }

  sl = (index,value) => {
    var data = this.state.data;
    data[index].taxRate = value;
    this.setState({
      data:data
    })
  }

  saleNum = (index,value) => {
    var data = this.state.data;
    data[index].saleNum = value;
    this.setState({
      data:data
    })
  }

  packNum = (index,value) => {
    var data = this.state.data;
    data[index].packNum = value;
    this.setState({
      data:data
    })
  }

  remark = (index,e) => {
    var data = this.state.data;
    data[index].remark = e.target.value;
    this.setState({
      data:data
    })
  }

  delete(index){
    var data = this.state.data;
    data.splice(index,1)
    this.setState({
      data:data
    })
  }

  packUtilId(index,value){
    var data = this.state.data;
    data[index].packUtilId = value;
    this.setState({
      data:data,
    })
  }

  getSelect(){
    var that = this;
    fetch(globals.url.url+'/product/product/showBasicData', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
          var allKey = [];
          var skuCategorys = [];
          result.result.proSkuCategory.map((data,i)=>{

              allKey.push([]);
              skuCategorys.push(data.id);
              if(data.hasOwnProperty('categoryName')){
                var obj = {
                  key: i,
                  descriptions: data.categoryName,
                  proSkuValueLists: data.proSkuValueList
                }
                arr.push(obj)
              }



          })
          that.setState({
            spinning:false,
            skuValues:JSON.parse(JSON.stringify(allKey)),
            skuValues1:JSON.parse(JSON.stringify(allKey)),
            skuCategorys:JSON.parse(JSON.stringify(skuCategorys)),
            skuCategorys1:JSON.parse(JSON.stringify(skuCategorys)),
            datas:JSON.parse(JSON.stringify(arr)),
            datas2:JSON.parse(JSON.stringify(arr)),
            expirationDate:result.result.expirationDate,
            proCategory:result.result.proCategory,
            proSkuCategory:result.result.proSkuCategory,
            proStockType:result.result.proStockType,
            proUnit:result.result.proUnit,
            canSales:result.result.proStockType[0].canSales,
            productSource:result.result.proStockType[0].productSource,
            ProUnit:result.result.proUnit[0].name,
            fzProUnit:result.result.proUnit[0].name,
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

  showModal = (e) => {
    this.setState({
      visible1:true,
    })
  }



  handleCancel1 = (e) => {
    this.setState({
      visible1:false,
    })
  }

  handleChangeS = (value,option) => {
    console.log(option)
    this.setState({
      selectS:[],
      values:value,
      Selectvalues:option.props.keys
    })
    var that = this;
    setTimeout(()=>{
      if(value.length == 0){
         this.setState({
           selectS:[],
           values:'',
           Selectvalues:''
         })
      }else{
        fetch(globals.url.url+'/product/product/findLike?param='+value, {
          method: 'GET',
          credentials: 'include'
        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          if(result.code == 0){
            console.log('xxxx0000',result.result)

            that.setState({
              selectS:result.result,
              values:value,
              Selectvalues:option.props.keys
            })
          }else{
            message.warning(result.message);
          }
        }).catch((error) => {
          message.warning('加载失败，请刷新重试');
        });
      }
    },300)

  }

  changeChecks(data,index,e){
    console.log('111',this.state.skuValues)
    var skuValues = this.state.skuValues;
    var skuValues1 = this.state.skuValues1;
    if(e.target.checked){
       skuValues[index].push(e.target.value)
       skuValues1[index].push(e.target.value)
       this.setState({
         skuValues:skuValues,
         skuValues1:skuValues1
       })
    }else{
      skuValues[index].map((info,x)=>{
        if(info == e.target.value){
          skuValues[index].splice(x,1);
          skuValues1[index].splice(x,1);
          this.setState({
            skuValues:skuValues,
            skuValues1:skuValues1
          })
        }
      })
    }

    console.log('222',skuValues)
  }

  sortNumber(a, b){
      return a - b
  }

  handleOk1 = (e) => {
    this.setState({
      visible1: false,
    });
    var skuCategorys = [];
    var skuValues = [];
    this.state.skuValues.map((data,i)=>{
      if(data.length > 0){
        skuCategorys.push(this.state.skuCategorys[i]);
        skuValues.push(data);
        this.setState({
          skuCategorysx:skuCategorys,
          skuValuesx:skuValues
        })
      }
    })
    var that = this;
    fetch(globals.url.url+'/product/sku/showSkus', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        "skuCategorys": skuCategorys,
        'skuValues': skuValues
      })
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){

         that.state.data.map((data,i)=>{
           console.log(data.combination)

             var combinations = data.combination.slice(0,-1).split("/").sort(that.sortNumber).join('/')+'/';
             result.result.stringCombination.map((info,j)=>{
               if(that.state.Selectvalues == data.skuCode && combinations == info){
                  console.log('xxooxxoo')
               }else{
                 console.log('ooxxooxx')
                 var arr = that.state.data;
                 var obj = {
                   key:arr.length + 1,
                   description:that.state.values,
                   skuInfo:'',
                   saleNum:0,
                   saleUtilId:'',
                   packNum:0,
                   packUtilId:'',
                   price:0,
                   priceUnit:0,
                   discountNum:0,
                   taxRate:0,
                   money:0,
                   tax:0,
                   amount:'',
                   remark:'',
                   units:'',
                   skuCode:data.skuCode,
                   combination:data.combination
                 }
                 arr.push(obj)
                 that.setState({
                   data:arr
                 })
               }
             })

         })
         that.setState({
           combinationData:result.result.combinationData,
           skuData:result.result.skuData,
           stringCombination:result.result.stringCombination
         })
         message.success('提交成功');
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
    e.preventDefault();
    var that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.state.currencyList.map((data,i)=>{
          if(values.currencyId == data.name){
            values.currencyId = data.id
          }
        })

        this.state.payWayList.map((data,i)=>{
          if(values.payWayId == data.name){
            values.payWayId = data.id
          }
        })

        this.state.salesmanList.map((data,i)=>{
          if(values.salesmanId == data.name){
            values.salesmanId = data.id
          }
        })

        this.state.settleWayList.map((data,i)=>{
          if(values.settleWayId == data.name){
            values.settleWayId = data.id
          }
        })

        this.state.currencyList.map((data,i)=>{
          if(values.currencyId == data.name){
            values.currencyId = data.id
          }
        })

        this.state.deliveryWayList.map((data,i)=>{
          if(values.deliveryWayId == data.deliveryWay){
            values.deliveryWayId = data.id
          }
        })

        values.deliveryTime = values.deliveryTime.format('YYYY-MM-DD');
        values.orderTime = values.orderTime.format('YYYY-MM-DD');
        values.customerId = Number(that.state.customerId);
        values.orderItems = that.state.data;
        values.id = Number(that.props.match.params.id);
        console.log('Received values of form: ', values);
        that.setState({
          spinning:true,
        })

        fetch(globals.url.url+'/sale/orderDraft/update', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            values
          )
        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          console.log(result)
          if(result.code == 0){
            message.success('保存成功');
            that.setState({
              spinning:false,
            })

            that.props.history.push({pathname: '/erp/sale-OrderDraftInfo/' +that.props.match.params.id});
            var obj = {name:'订单详情',menuKey:'sale-OrderDraftInfo/'+ that.props.match.params.id,key:'sale-OrderDraftInfo'};
            that.props.dispatch({ type: 'INCREMENT' ,text:obj});
            var objs = {menuKey:'sale-EditOrderDraft',key:'sale-EditOrderDraft'};
            that.props.dispatch({ type: 'header' ,text:objs});

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
    });
  }

  cancel = (e) => {
    this.props.history.push({pathname: '/erp/sale-OrderDraftInfo/' +this.props.match.params.id});
    var obj = {name:'订单详情',menuKey:'sale-OrderDraftInfo/'+ this.props.match.params.id,key:'sale-OrderDraftInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
    var objs = {menuKey:'sale-EditOrderDraft',key:'sale-EditOrderDraft'};
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

    const columns = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      filterDropdown: (
        <div className="custom-filter-dropdown">

        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '销售数量',
      dataIndex: 'saleNum',
      key: 'saleNum',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <InputNumber size="small" min={0} max={100000} onChange={this.saleNum.bind(this,i)} value={record.saleNum} />
               </div>
            )
    }, {
      title: '销售单位',
      dataIndex: 'saleUtilId',
      key: 'saleUtilId',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                 <Select
                   size='small'
                   style={{ width: 80 }}
                   onChange={this.sellUnit.bind(this,i)}
                 >
                   {this.state.unitList.map((data,i)=>{
                     return <Option key={i} value={data.id}>{data.name}</Option>
                   })}
                 </Select>
               </div>
            )
    }, {
      title: '包装规格',
      dataIndex: 'packNum',
      key: 'packNum',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <InputNumber size="small" min={0} max={100000} onChange={this.packNum.bind(this,i)} value={record.packNum} />
               </div>
            )
    }, {
      title: '包装单位',
      dataIndex: 'packUtilId',
      key: 'packUtilId',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                 <Select
                   size='small'
                   style={{ width: 100 }}
                   onChange={this.packUtilId.bind(this,i)}
                 >
                   {this.state.packingUnitList.map((data,i)=>{
                     return <Option key={i} value={data.id}>{data.name}</Option>
                   })}
                 </Select>
               </div>
            )
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <InputNumber size="small" onChange={this.dprice.bind(this,i)} value={record.price} min={0} max={100000}  />
               </div>
            )
    }, {
      title: '计价单位',
      dataIndex: 'priceUnit',
      key: 'priceUnit',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{this.state.price}/{record.units}</span>
               </div>
            )
    }, {
      title: '折后数量',
      dataIndex: 'discountNum',
      key: 'discountNum',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <InputNumber onChange={this.zNum.bind(this,i)} value={record.discountNum} size="small" min={0} max={100000}  />
               </div>
            )
    }, {
      title: '税率',
      dataIndex: 'taxRate',
      key: 'taxRate',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <InputNumber size="small" min={0} max={100000} onChange={this.sl.bind(this,i)} value={record.taxRate}  formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
               </div>
            )
    }, {
      title: '金额',
      dataIndex: 'money',
      key: 'money',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(Number(record.price)*Number(record.discountNum)).toFixed(2)}</span>
               </div>
            )
    }, {
      title: '税额',
      dataIndex: 'tax',
      key: 'tax',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(Number(record.price)*Number(record.discountNum)*Number(record.taxRate)/100).toFixed(2)}</span>
               </div>
            )
    }, {
      title: '价税合计',
      dataIndex: 'amount',
      key: 'amount',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(Number(record.price)*Number(record.discountNum)) + Number(Number(record.price)*Number(record.discountNum)*Number(record.taxRate)/100).toFixed(2)}</span>
               </div>
            )
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width:160,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <Input size="small" placeholder="备注" onChange={this.remark.bind(this,i)} value={record.remark} />
               </div>
            )
    }, {
      width:120,
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                 <Popconfirm title="确定要删除?" onConfirm={this.delete.bind(this,i)}  okText="确定" cancelText="取消">
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
      width: 50,
      dataIndex: 'index',
      key: 'index',
      filterDropdown: (
        <div className="custom-filter-dropdown">

        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '产品信息',
      dataIndex: 'info',
      key: 'info',
    }];

    const columnd = [{
      title: '属性类别',
      dataIndex: 'descriptions',
      key: 'descriptions',
      width:150,
    }, {
      title: '属性值',
      dataIndex: 'proSkuValueLists',
      key: 'proSkuValueLists',
      render: (text, record, i) => (
        <div>
          {record.proSkuValueLists.map((data,j)=>{
            return <Checkbox key={j} onChange={this.changeChecks.bind(this,data,i)}  value={data.id}>{data.skuValue}</Checkbox>
          })}
        </div>
      )
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
          selectedRows:selectedRows,
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
                 <li style={{fontSize:14}}>详情</li>
                 <div className="page_add_input_btn_right">
                     <Button type="primary" onClick={this.cancel} icon="close">
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
                        label="客户"

                      >
                      {getFieldDecorator('customerId', {
                        rules: [
                          { required: true, message: '请选择客户!' },
                        ],
                        initialValue:this.state.mains.customerName
                      })(
                        <Select placeholder="请选择客户" mode="combobox" onChange={this.handleChange.bind(this)}>
                          {this.state.mainData.map((data,i)=>{
                            return <Option value={data.name+'-'+data.number} key={data.id}>{data.name}-{data.number}</Option>
                          })}
                        </Select>
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="客户单号"
                      >
                        {getFieldDecorator('customerOrderNumber', {
                          rules: [{
                            required: false,whitespace:true, message: '请输入客户单号!',
                          }],
                          initialValue:this.state.mains.customerOrderNumber
                        })(
                          <Input placeholder="请输入客户单号" />
                        )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="业务类型"

                      >
                      {getFieldDecorator('businessType', {
                        rules: [
                          { required: true, message: '请选择业务类型!' },
                        ],

                      })(
                        <Select placeholder="请选择业务类型" >
                          {this.state.businessTypeList.map((data,i)=>{
                            return <Option key={i} value={data.code}>{data.message}</Option>
                          })}

                        </Select>
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="付款条件"

                      >
                      {getFieldDecorator('payWayId', {
                        rules: [
                          { required: true, message: '请选择付款条件!' },
                        ],
                        initialValue:this.state.mains.payWay
                      })(
                        <Select placeholder="请选择付款条件" >
                            {this.state.payWayList.map((data,i)=>{
                              return <Option key={i} value={data.id}>{data.name}</Option>
                            })}
                        </Select>
                      )}
                     </FormItem>
                 </div>
                 <div className="page_add_input_main_form" style={{width:'35%'}}>
                     <FormItem
                        {...formItemLayout}
                        label="客户类型"

                      >
                      {getFieldDecorator('customeType', {
                        rules: [
                          { required: false, message: '请选择客户类型!' },
                        ],
                        initialValue:this.state.type
                      })(
                         <Input disabled placeholder="请选择客户" />
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="业务员"

                      >
                      {getFieldDecorator('salesmanId', {
                        rules: [
                          { required: true, message: '请选择业务员!' },
                        ],
                        initialValue:this.state.mains.salesmanName
                      })(
                        <Select placeholder="请选择业务员" onChange={this.handleSelectChange}>
                          {this.state.salesmanList.map((data,i)=>{
                            return <Option key={i} value={data.id}>{data.name}</Option>
                          })}
                        </Select>
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="下单日期"

                      >
                      {getFieldDecorator('orderTime', {
                        rules: [
                          { required: true, message: '请选择下单日期!' },
                        ],
                        initialValue:moment(this.state.mains.orderTime)
                      })(
                        <DatePicker />
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="结算方式"
                      >
                        {getFieldDecorator('settleWayId', {
                          rules: [{
                            required: true,message: '请输入结算方式!',
                          }],
                          initialValue:this.state.mains.settleWay
                        })(
                          <Select placeholder="请选择结算方式" >
                            {this.state.settleWayList.map((data,i)=>{
                              return <Option key={i} value={data.id}>{data.name}</Option>
                            })}
                          </Select>
                        )}
                     </FormItem>
                 </div>
                 <div className="page_add_input_main_form" style={{width:'37%'}}>
                     <FormItem
                        {...formItemLayout}
                        label="交易币种"

                      >
                      {getFieldDecorator('currencyId', {
                        rules: [
                          { required: true, message: '请选择交易币种!' },
                        ],
                        initialValue:this.state.mains.currencyName
                      })(
                        <Select placeholder="请选择交易币种" onChange={this.priceChange}>
                          {this.state.currencyList.map((data,i)=>{
                            return <Option key={i} value={data.id}>{data.name}</Option>
                          })}
                        </Select>
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="部门"

                      >
                      {getFieldDecorator('departmentName', {
                        rules: [
                          { required: false, message: '请选择部门!' },
                        ],
                        initialValue:this.state.departmentName
                      })(
                        <Input disabled placeholder="请选择业务员" />
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="交货日期"

                      >
                      {getFieldDecorator('deliveryTime', {
                        rules: [
                          { required: true, message: '请选择交货日期!' },
                        ],
                        initialValue:moment(this.state.mains.deliveryTime)
                      })(
                        <DatePicker />
                      )}
                     </FormItem>
                     <FormItem
                        {...formItemLayout}
                        label="交货方式"

                      >
                      {getFieldDecorator('deliveryWayId', {
                        rules: [
                          { required: true, message: '请选择交货方式!' },
                        ],
                        initialValue:this.state.mains.deliveryWay
                      })(
                        <Select placeholder="请选择交货方式" >
                          {this.state.deliveryWayList.map((data,i)=>{
                            return <Option key={i} value={data.id}>{data.deliveryWay}</Option>
                          })}
                        </Select>
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
                     initialValue:this.state.mains.remark
                   })(
                     <Input placeholder="请输入备注" />
                   )}
                </FormItem>
              </div>


            </Form>
          </div>
          <div className="page_add_tabs" style={{padding:0}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14}}>产品信息</li>
               <div className="page_add_input_btn_right">
                   <Search
                      placeholder="搜索产品名称及spu，sku"
                      onSearch={this.Search.bind(this)}
                      style={{ width: 250 }}
                      enterButton
                    />

               </div>
            </div>
            <div>
                <Table columns={columns} expandedRowRender={record => <p style={{ margin: 0 }}>产品信息：{record.description}</p>} dataSource={this.state.data} scroll={{x:1300}} pagination={false}/>
            </div>
          </div>
        </Spin>
        <Modal
          title="添加产品"
          visible={this.state.visible}
          onOk={this.handleOk}
          width={800}
          onCancel={this.handleCancel}
        >
          <div style={{height:500,overflowX:'hidden'}}>
           <Table rowSelection={rowSelection}  columns={column} dataSource={this.state.datas} pagination={false}/>
          </div>
        </Modal>
        <Modal
          title="属性添加"
          visible={this.state.visible1}
          onOk={this.handleOk1}
          width={800}
          onCancel={this.handleCancel1}
        >
          <div>
            <Select
              mode="combobox"
              defaultActiveFirstOption={false}
              showArrow={false}
              value={this.state.values}
              filterOption={false}
              placeholder="请选择产品"
              style={{width:300,marginBottom:10}}
              onChange={this.handleChangeS}
            >
                {this.state.selectS.length > 0 ? this.state.selectS.map((data,i)=>{
                  if(data.hasOwnProperty('skuCode')){
                    return <Option value={data['skuCode'] +'-'+ data['skuName']} keys={data['skuCode']} key={i}>{data['skuCode']}-{data['skuName']}</Option>
                  }


                }) : null}
            </Select>
            <Table columns={columnd} dataSource={this.state.datas2} pagination={false}/>
          </div>
        </Modal>
      </div>

    );
  }
}
export default Form.create()(connect()(EditOrderDraft));
