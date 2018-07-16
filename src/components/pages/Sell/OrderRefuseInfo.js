/* @flow */

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Spin,Upload,DatePicker,Radio,Select,Tabs,Table,Modal,Tooltip,Popconfirm,Divider,InputNumber  } from 'antd';
import globals from '../../unit';
import moment from 'moment';
import { connect } from 'react-redux';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Search = Input.Search;
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
var arr = [];
var mains = [];
var subData = [];
class OrderRefuseInfo extends Component {
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
      visibles:false,
      input:''
    }
  }

  componentDidMount(){
    this.getData();
    this.getSelect();
    this.props.history.push({pathname: '/erp/sale-OrderRefuseInfo/' +this.props.match.params.id});
    var obj = {name:'驳回详情',menuKey:'sale-OrderRefuseInfo/'+ this.props.match.params.id,key:'sale-OrderRefuseInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/sale/order/showReject?id='+this.props.match.params.id, {
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
            data:arr
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



  handleOk1 = (e) => {
    this.setState({
      visible1:false,
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

        values.deliveryTime = values.deliveryTime.format('YYYY-MM-DD');
        values.orderTime = values.orderTime.format('YYYY-MM-DD');
        values.customerId = Number(that.state.customerId);
        values.orderItems = that.state.data;
        console.log('Received values of form: ', values);
        that.setState({
          spinning:true,
        })

        fetch(globals.url.url+'/sale/orderDraft/add', {
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

  handleOks = () =>{
    var that = this;
    that.setState({
      spinning:true,
      visibles: false,
    })
    fetch(globals.url.url+'/sale/order/deleteRejectOrder', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body:JSON.stringify(Array.of(this.props.match.params.id)
      )
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
         that.setState({
           spinning:false
         })
         that.props.history.push({pathname: '/erp/sale-order-refuse'});
         var obj = {name:'驳回订单',menuKey:'sale-order-refuse',key:'sale-order-refuse'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
         var objs = {menuKey:'sale-OrderRefuseInfo',key:'sale-OrderRefuseInfo'};
         that.props.dispatch({ type: 'header' ,text:objs});
         message.success('驳回成功');
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

  showModal = () => {
    this.setState({
      visibles: true,
    });
  }



  handleCancels = (e) => {
    console.log(e);
    this.setState({
      visibles: false,
    });
  }

  edit = (e) => {
    this.props.history.push({pathname: '/erp/sale-orderRefuseEdit/' +this.props.match.params.id});
    var obj = {name:'订单修改',menuKey:'sale-orderRefuseEdit/'+ this.props.match.params.id,key:'sale-orderRefuseEdit'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  onChangeInput(e){
    this.setState({
       input:e.target.value
    })
  }

  sure = (e) => {

        var that = this;
        that.setState({
          spinning:true,
        })
        fetch(globals.url.url+'/sale/order/updateToCheckAgain', {
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
             that.getData(that.state.page,that.state.pageSize)
             that.setState({
               spinning:false
             })
             that.props.history.push({pathname: '/erp/sale-order-refuse'});
             var obj = {name:'驳回订单',menuKey:'sale-order-refuse',key:'sale-order-refuse'};
             that.props.dispatch({ type: 'INCREMENT' ,text:obj});
             var objs = {menuKey:'sale-OrderRefuseInfo',key:'sale-OrderRefuseInfo'};
             that.props.dispatch({ type: 'header' ,text:objs});
             message.success('操作成功');
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
                  <span>{Number(record.saleNum)}</span>
               </div>
            )
    }, {
      title: '销售单位',
      dataIndex: 'saleUtilId',
      key: 'saleUtilId',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                 <span>{record.saleUtilName}</span>
               </div>
            )
    }, {
      title: '包装规格',
      dataIndex: 'packNum',
      key: 'packNum',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(record.packNum)}</span>
               </div>
            )
    }, {
      title: '包装单位',
      dataIndex: 'packUtilId',
      key: 'packUtilId',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                 <span>{record.packUtilName}</span>
               </div>
            )
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(record.price)}</span>
               </div>
            )
    }, {
      title: '计价单位',
      dataIndex: 'priceUnit',
      key: 'priceUnit',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{this.state.mains.currencyName}/{record.saleUtilName}</span>
               </div>
            )
    }, {
      title: '折后数量',
      dataIndex: 'discountNum',
      key: 'discountNum',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(record.discountNum)}</span>
               </div>
            )
    }, {
      title: '税率',
      dataIndex: 'taxRate',
      key: 'taxRate',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(record.taxRate)}%</span>
               </div>
            )
    }, {
      title: '金额',
      dataIndex: 'money',
      key: 'money',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(record.price)*Number(record.discountNum)}</span>
               </div>
            )
    }, {
      title: '税额',
      dataIndex: 'tax',
      key: 'tax',
      width:100,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(record.price)*Number(record.discountNum)*Number(record.taxRate)/100}</span>
               </div>
            )
    }, {
      title: '价税合计',
      dataIndex: 'amount',
      key: 'amount',
      width:130,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{Number(Number(record.price)*Number(record.discountNum)) + Number(Number(record.price)*Number(record.discountNum)*Number(record.taxRate)/100)}</span>
               </div>
            )
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width:160,
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                  <span>{record.remark}</span>
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

                     <Button type="primary" onClick={this.showModal} icon="close">
                       删除
                     </Button>
                     <Button type="primary" onClick={this.sure} icon="check">
                       重新提交
                     </Button>
                     <Button type="primary" onClick={this.edit} icon="edit">
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
                            <label>客户单号</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                     {this.state.mains.customerOrderNumber}
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>业务类型</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                   销售订单
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>付款条件</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                     {this.state.mains.payWay}
                                 </span>
                             </div>
                         </div>
                      </div>
                  </div>
                  <div className="page_add_input_main_form" style={{width:'35%'}}>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>客户类型</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                    {this.state.mains.customeType == 1 ? '标准客户' : null}
                                    {this.state.mains.customeType == 2 ? "寄库客户" : null}
                                    {this.state.mains.customeType == 3 ? '个人客户' : null}
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>业务员</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                    {this.state.mains.salesmanName}
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>下单日期</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                    {this.state.mains.orderTime}
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>结算方式</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                    {this.state.mains.settleWay}
                                 </span>
                             </div>
                         </div>
                      </div>
                  </div>
                  <div className="page_add_input_main_form" style={{width:'37%'}}>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>交易币种</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                    {this.state.mains.currencyName}
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>部门</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                    {this.state.mains.departmentName}
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>交货日期</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                     {this.state.mains.deliveryTime}
                                 </span>
                             </div>
                         </div>
                      </div>
                      <div className="ant-row ant-form-item">
                         <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                            <label>交货方式</label>
                         </div>
                         <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                             <div className="ant-form-item-control has-success">
                                 <span className="ant-form-item-children">
                                     {this.state.mains.deliveryWay}
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
                                  {this.state.mains.remark}
                              </span>
                          </div>
                      </div>
                   </div>
               </div>
            </Form>
          </div>
          <div className="page_add_tabs" style={{padding:0}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14}}>产品信息</li>

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
           title='操作'
           visible={this.state.visibles}
           onOk={this.handleOks.bind(this)}
           onCancel={this.handleCancels}
           okText="确定"
           cancelText="取消"
         >
           <p>确定要删除？</p>
       </Modal>
      </div>

    );
  }
}
export default Form.create()(connect()(OrderRefuseInfo));
