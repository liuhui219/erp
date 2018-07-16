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
class addProduct extends Component {
  constructor() {
    super();
    this.state={
      tip:'加载中...',
      spinning:true,
      checkNick:false,
      isEmergencyContact:'否',
      expirationDate:[{}],
      proCategory:[{}],
      proSkuCategory:[{}],
      proStockType:[{}],
      proUnit:[{}],
      canSales:false,
      ProUnit:'',
      fzProUnit:'',
      isShow:false,
      isBzq:false,
      selectLs:2,
      isShowM:false,
      isShowAll:true,
      isGlPc:1,
      isShowZ:true,
      visible:false,
      datas:[],
      datas1:[],
      skuCategorys:[],
      skuCategorys1:[],
      skuValues:[],
      skuValues1:[],
      data:[],
      column:[],
      skuCategorysx:[],
      skuValuesx:[],
      initSPU:'Y00001',
      ProName:'',
      Code:'',
      combinationData:[],
      skuData:[],
      visible1:false,
      stringCombination:[],
      RadioGroup:false,
      allDatas:[],
      headResourceKey:'',
    }
  }

  componentDidMount(){
    this.getSelect();
    arr = [];
    mains = [];
    subData = [];
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
                  description: data.categoryName,
                  proSkuValueList: data.proSkuValueList
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
            datas1:JSON.parse(JSON.stringify(arr)),
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

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file) => {
    // const isJPG = file.type === 'image/jpeg';
    // if (!isJPG) {
    //   message.error('You can only upload JPG file!');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2M!');
    }
    return isLt2M;
  }


  handleChanges = (info) => {
    console.log(info)
    if (info.file.status === 'uploading') {
      this.setState({ loading: true,headResourceKey:'' });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
        headResourceKey:info.file.response.result
      }));
    }
  }

  handleChange = (e) => {
    console.log(e.target.checked)
    if(e.target.checked){
      this.setState({
        isShow: e.target.checked,
        isEmergencyContact:'是'
      });
    }else{
      this.setState({
        isShow: e.target.checked,
        isEmergencyContact:'否'
      });
    }
  }

  handleSelectChange = (value) => {
    console.log(value);
    this.state.proStockType.map((data,i)=>{
      if(data.id == value){
        this.setState({
          canSales:data.canSales,
          productSource:data.productSource
        })
      }
    })
  }

  ChangeProUnit = (value) => {
    this.state.proUnit.map((data,i)=>{
      if(data.id == value){
        this.setState({
          ProUnit:data.name
        })
      }
    })
  }

  fzChange = (value) => {
    this.state.proUnit.map((data,i)=>{
      if(data.id == value){
        this.setState({
          fzProUnit:data.name
        })
      }
    })
  }

  bzqChange = (e) => {
    this.setState({
      isBzq:e.target.checked
    })
  }

  selectLs = (value) => {

    this.props.form.setFieldsValue({
      batchStartNumber: '0'.repeat(value-1)+'1',
    });
    this.setState({
      selectLs:value
    })
  }

  selectM = (value) => {
    if(value == 1){
      this.setState({
        isShowAll:false
      })
    }else if(value ==2){
      this.setState({
        isShowM:false,
        isShowAll:true
      })
    }else if(value == 3){
      this.setState({
        isShowM:true,
        isShowAll:true
      })
    }
  }

  isGlPc = (e) => {
    if(e.target.checked){
      this.setState({
        isGlPc:1,
        isShowZ:true,
        isShowAll:true
      })
    }else{
      this.setState({
        isGlPc:0,
        isShowZ:false,
        isShowAll:false
      })
    }
  }

  showModal = () => {
    if(this.state.initSPU == ''){
      message.warning('SPU编码不能为空');
    }else if(this.state.ProName == ''){
      message.warning('产品名称不能为空');
    }else if(this.state.Code == ''){
      message.warning('条形码不能为空');
    }else{
      this.setState({
        visible: true,
      });
    }

  }

  delete(index){
    console.log(index)
    var mainData = [];
    var that = this;
    var datas = this.state.data;
    var skuData = this.state.skuData;
    var combinationData = this.state.combinationData;
    var stringCombination = this.state.stringCombination;
    datas.splice(index,1);
    combinationData.splice(index,1);
    stringCombination.splice(index,1);
    skuData.splice(index,1);
    combinationData.map((data,i)=>{
      var obj = {
        key: i,
        'skuCode': that.state.initSPU+'0'+(i+1),
        'skuName': that.state.ProName,
        'shapeCode': that.state.Code,
        'combination':that.state.stringCombination[i]
      }
      data.map((info,x)=>{
        skuData.map((infos,y)=>{
          for (let [k, v] of Object.entries(infos)) {
            if(info == v.id){
              obj[infos[k].skuCategoryId] = v.id;
              obj[k] = v.skuValue;
            }
          }

        })
      })
      mainData.push(obj)
    })
    this.setState({
      data:mainData,
      combinationData:combinationData,
      skuData:skuData,
      stringCombination:stringCombination
    })
  }

  add(index){
    subData = [];
    mains = [];
    var alls = [];
    this.state.proSkuCategory.map((data,i)=>{
      this.state.skuCategorysx.map((info,j)=>{
        if(info == data.id){
          var obj = {
            key: i,
            description: data.categoryName,
            proSkuValueList: data.proSkuValueList
          }
          alls.push(obj);
        }
      })
    })

    this.state.skuCategorysx.map((info,j)=>{
      subData.push([])
    })

    this.setState({
      visible1:true,
      RadioGroup:false,
      allDatas:alls
    })

  }

  handleOk = (e) => {
    this.setState({
      visible: false,
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
        var mainData = [];

        var column = [{
          title: 'SKU编码',
          dataIndex: 'skuCode',
          key: 'skuCode',
        }, {
          title: '产品名称',
          dataIndex: 'skuName',
          key: 'skuName',
        }, {
          title: '条形码',
          dataIndex: 'shapeCode',
          key: 'shapeCode',
        }];

        that.state.skuCategorysx.map((infos,x)=>{
          that.state.proSkuCategory.map((data,y)=>{
            if(infos == data.id){
              var obj ={
                title: data.categoryName,
                dataIndex: data.categoryName,
                key: data.categoryName,
              }
              column.push(obj)
            }
          })
        })

        result.result.combinationData.map((data,i)=>{
          var obj = {
            key: i,
            'skuCode': that.state.initSPU+'0'+(i+1),
            'skuName': that.state.ProName,
            'shapeCode': that.state.Code,
            'combination':result.result.stringCombination[i]
          }
          data.map((info,x)=>{
            result.result.skuData.map((infos,y)=>{
              for (let [k, v] of Object.entries(infos)) {
                if(info == v.id){
                  obj[infos[k].skuCategoryId] = v.id;
                  obj[k] = v.skuValue;
                }
              }

            })
          })
          mainData.push(obj)
        })

        column.push({
          width:100,
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record,i) => (
                      <div style={{display:'flex',alignItems:'center'}}>
                          <Tooltip title="新增">
                              <span onClick={that.add.bind(that,i)} className="account-table-title" style={{cursor:'pointer',marginTop:3,}}>
                                  <Icon type="plus-circle" style={{fontSize:20,color:'#428ef2'}} />
                              </span>
                          </Tooltip>
                          <Tooltip title="删除">
                              <span onClick={that.delete.bind(that,i)} className="account-table-title" style={{cursor:'pointer',marginLeft:10,marginTop:3,}}>
                                  <Icon type="close-circle" style={{fontSize:20,color:'#428ef2'}} />
                              </span>
                          </Tooltip>
                      </div>
                )
        })

         that.setState({
           column:column,
           data:mainData,
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
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleOk1 = (e) => {
    var ar = [];
    var that = this;
    var combinationData = this.state.combinationData;
    var skuData = this.state.skuData;
    var stringCombination = this.state.stringCombination;
    mains.map((data,i)=>{
      ar.push(data)
    })
    if(ar.length == this.state.skuCategorysx.length){
       console.log('123',this.state.stringCombination);
       console.log('234',mains.join("/"))
      if(this.state.stringCombination.includes(mains.join("/")+'/')){
        message.warning('此属性已被添加,请重新选择!')
      }else{
        this.setState({
          visible1: false,
        });
        fetch(globals.url.url+'/product/sku/showSkus', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            "skuCategorys": that.state.skuCategorysx,
            'skuValues': subData
          })
        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          console.log(result)
          if(result.code == 0){
            var mainData = [];
            combinationData.push(result.result.combinationData[0]);
            skuData.push(result.result.skuData[0]);
            stringCombination.push(result.result.stringCombination[0])
            combinationData.map((data,i)=>{
              var obj = {
                key: i,
                'skuCode': that.state.initSPU+'0'+(i+1),
                'skuName': that.state.ProName,
                'shapeCode': that.state.Code,
                'combination':result.result.stringCombination[i]
              }
              data.map((info,x)=>{
                skuData.map((infos,y)=>{
                  for (let [k, v] of Object.entries(infos)) {
                    if(info == v.id){
                      obj[infos[k].skuCategoryId] = v.id;
                      obj[k] = v.skuValue;
                    }
                  }

                })
              })
              mainData.push(obj)
              that.setState({
                data:mainData,
                combinationData:combinationData,
                skuData:skuData,
                stringCombination:stringCombination
              })
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
    }else{
      message.warning('有选项未选择!');
    }
  }

  handleCancel1 = (e) => {
    console.log(e);
    this.setState({
      visible1: false,
    });
  }



  down(index){
    console.log('111',this.state.skuValues)
    var skuValues = this.state.skuValues;
    var skuValues1 = this.state.skuValues1;
    var all = this.state.skuCategorys;
    var all1 = this.state.skuCategorys1;
    var main = this.state.datas;
    var main1 = this.state.datas1;
    main[index] = main1[index+1];
    main[index+1] = main1[index];
    all[index] = all1[index+1];
    all[index+1] = all1[index];
    skuValues[index] = skuValues1[index+1];
    skuValues[index+1] = skuValues1[index];
    this.setState({
      datas:JSON.parse(JSON.stringify(main)),
      datas1:JSON.parse(JSON.stringify(main)),
      skuCategorys:JSON.parse(JSON.stringify(all)),
      skuCategorys1:JSON.parse(JSON.stringify(all)),
      skuValues:JSON.parse(JSON.stringify(skuValues)),
      skuValues1:JSON.parse(JSON.stringify(skuValues)),
    })
    console.log(main1);
  }

  up(index){
    console.log('111',this.state.skuValues)
    var skuValues = this.state.skuValues;
    var skuValues1 = this.state.skuValues1;
    var all = this.state.skuCategorys;
    var all1 = this.state.skuCategorys1;
    var main = this.state.datas;
    var main1 = this.state.datas1;
    main[index] = main1[index-1];
    main[index-1] = main1[index];
    all[index] = all1[index-1];
    all[index-1] = all1[index];
    skuValues[index] = skuValues1[index-1];
    skuValues[index-1] = skuValues1[index];
    this.setState({
      datas:JSON.parse(JSON.stringify(main)),
      datas1:JSON.parse(JSON.stringify(main)),
      skuCategorys:JSON.parse(JSON.stringify(all)),
      skuCategorys1:JSON.parse(JSON.stringify(all)),
      skuValues:JSON.parse(JSON.stringify(skuValues)),
      skuValues1:JSON.parse(JSON.stringify(skuValues)),
    })
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

  changeSPU = (e) => {
    this.setState({ initSPU: e.target.value });
    var arr = [];
    this.state.data.map((data,i)=>{
      data['skuCode'] = e.target.value+'0'+(i+1);
      arr.push(data);
    })
    this.setState({
      data:arr
    })
  }

  changeProName = (e) => {
    this.setState({ ProName: e.target.value });
  }

  changeCode = (e) => {
    this.setState({ Code: e.target.value });
  }

  changeRadio(index,e){
    console.log(index)
    console.log('radio checked', e.target.value);

    mains[index] = e.target.value
    subData[index][0] = e.target.value
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var that = this;
    if(this.state.headResourceKey == ''){
      message.warning('请上传产品图片');
    }else{

      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          if(values.expirationDateOption){
            values.expirationDateOption = 1
          }else{
            values.expirationDateOption = 0
          }
          if(values.productDateOption){
            values.productDateOption = 1
          }else{
            values.productDateOption = 0
          }
          if(values.unitType){
            values.unitType = 1
          }else{
            values.unitType = 0
          }
          if(values.batchOption){
            values.batchOption = 1
          }else{
            values.batchOption = 0
          }
          if(values.batchType == '日期+流水号'){
            values.batchType = 2;
          }

          var obj = {
            spuCode:values.spuCode,
            name:values.name,
            categoryId:values.categoryId,
            stockTypeId:values.stockTypeId,
            shapeCode:values.shapeCode,
            baseUnitId:values.baseUnitId,
            unitType:values.unitType,
            assistUnitId:values.assistUnitId,
            conversionRate:Number(values.conversionRate),
            productDateOption:values.productDateOption,
            expirationDateOption:values.expirationDateOption,
            expirationDateId:values.expirationDateId,
            batchOption:values.batchOption,
            batchType:values.batchType,
            batchPrefix:values.batchPrefix,
            batchSerialnoNum:values.batchSerialnoNum,
            batchStartNumber: Number(values.batchStartNumber),
            defaultSupplier:values.defaultSupplier,
            purchaseUtil:values.purchaseUtil,
            valuationUtil:values.valuationUtil,
            purchaseUpperLimit:values.purchaseUpperLimit,
            purchaseLowerLimit:values.purchaseLowerLimit,
            salesUtil:values.salesUtil,
            salesUpperLimit:values.salesUpperLimit,
            salesLowerLimit:values.salesLowerLimit,
            stockUtil:values.stockUtil,
            minStock:values.minStock,
            maxStock:values.maxStock,
            safeStock:values.safeStock,
            replenishStockPoint:values.replenishStockPoint,
            minSalesStock:values.minSalesStock,
            openWarning:values.openWarning,
            imgResourceKey:that.state.headResourceKey
          }

          values['imgResourceKey'] = that.state.headResourceKey;
          if(that.state.data.length == 0){
            var productSku = null
          }else{
            var productSku = {
              skuHead:[...that.state.skuCategorysx],
              skuBody:that.state.data
            }
          }


          obj['productSku'] = productSku

          console.log(productSku)

          that.setState({
            spinning:true,
          })

          fetch(globals.url.url+'/product/product/addToDraft', {
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
                spinning:false,
              })
              that.props.history.push({pathname: '/erp/pro-product-draft'});
              var obj = {name:'产品草稿',menuKey:'pro-product-draft',key:'pro-product-draft'};
              that.props.dispatch({ type: 'INCREMENT' ,text:obj});
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
        }else{
          message.warning('有必填选项未填写，请检查填写!');
          that.setState({
            spinning:false,
          })
        }
      });
    }
  }

  submits = (e) => {
    e.preventDefault();
    var that = this;
    if(this.state.headResourceKey == ''){
      message.warning('请上传产品图片');
    }else{

      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          if(values.expirationDateOption){
            values.expirationDateOption = 1
          }else{
            values.expirationDateOption = 0
          }
          if(values.productDateOption){
            values.productDateOption = 1
          }else{
            values.productDateOption = 0
          }
          if(values.unitType){
            values.unitType = 1
          }else{
            values.unitType = 0
          }
          if(values.batchOption){
            values.batchOption = 1
          }else{
            values.batchOption = 0
          }
          if(values.batchType == '日期+流水号'){
            values.batchType = 2;
          }

          var obj = {
            spuCode:values.spuCode,
            name:values.name,
            categoryId:values.categoryId,
            stockTypeId:values.stockTypeId,
            shapeCode:values.shapeCode,
            baseUnitId:values.baseUnitId,
            unitType:values.unitType,
            assistUnitId:values.assistUnitId,
            conversionRate:Number(values.conversionRate),
            productDateOption:values.productDateOption,
            expirationDateOption:values.expirationDateOption,
            expirationDateId:values.expirationDateId,
            batchOption:values.batchOption,
            batchType:values.batchType,
            batchPrefix:values.batchPrefix,
            batchSerialnoNum:values.batchSerialnoNum,
            batchStartNumber: Number(values.batchStartNumber),
            defaultSupplier:values.defaultSupplier,
            purchaseUtil:values.purchaseUtil,
            valuationUtil:values.valuationUtil,
            purchaseUpperLimit:values.purchaseUpperLimit,
            purchaseLowerLimit:values.purchaseLowerLimit,
            salesUtil:values.salesUtil,
            salesUpperLimit:values.salesUpperLimit,
            salesLowerLimit:values.salesLowerLimit,
            stockUtil:values.stockUtil,
            minStock:values.minStock,
            maxStock:values.maxStock,
            safeStock:values.safeStock,
            replenishStockPoint:values.replenishStockPoint,
            minSalesStock:values.minSalesStock,
            openWarning:values.openWarning,
            imgResourceKey:that.state.headResourceKey
          }

          values['imgResourceKey'] = that.state.headResourceKey;
          if(that.state.data.length == 0){
            var productSku = null
          }else{
            var productSku = {
              skuHead:[...that.state.skuCategorysx],
              skuBody:that.state.data
            }
          }


          obj['productSku'] = productSku
          that.setState({
            spinning:true,
          })
          console.log(productSku)

          fetch(globals.url.url+'/product/product/addToProduct', {
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
                spinning:false,
              })
              that.props.history.push({pathname: '/erp/pro-product-record'});
              var obj = {name:'产品档案',menuKey:'pro-product-record',key:'pro-product-record'};
              that.props.dispatch({ type: 'INCREMENT' ,text:obj});
              var objs = {menuKey:'pro-product-add',key:'pro-product-add'};
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
        }else{
          message.warning('有必填选项未填写，请检查填写!');
          that.setState({
            spinning:false,
          })
        }
      });
    }
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'upload'} />
        <div className="ant-upload-text"></div>
      </div>
    );

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
      title: '属性类别',
      dataIndex: 'description',
      key: 'description',
      width:150,
    }, {
      title: '属性值',
      dataIndex: 'proSkuValueList',
      key: 'proSkuValueList',
      render: (text, record, i) => (
        <div>
          {record.proSkuValueList.map((data,j)=>{
            return <Checkbox key={j} onChange={this.changeChecks.bind(this,data,i)} value={data.id}>{data.skuValue}</Checkbox>
          })}
        </div>
      )
    }, {
      width:100,
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                 {i == 0 ? <span  className="account-table-title" onClick={this.down.bind(this,i)} style={{cursor:'pointer',marginTop:3,marginLeft:10}}>
                     <Icon type="arrow-down" style={{fontSize:20,color:'#428ef2'}} />
                 </span> : null}
                 {i == this.state.datas.length-1 ? <span  className="account-table-title" onClick={this.up.bind(this,i)} style={{cursor:'pointer',marginTop:3,marginLeft:10}}>
                     <Icon type="arrow-up" style={{fontSize:20,color:'#428ef2'}} />
                 </span> : null}
                 {i != this.state.datas.length-1 && i != 0 ? <div><span onClick={this.down.bind(this,i)} className="account-table-title" style={{cursor:'pointer',marginTop:3,}}>
                     <Icon type="arrow-down" style={{fontSize:20,color:'#428ef2'}} />
                 </span><span  className="account-table-title" onClick={this.up.bind(this,i)} style={{cursor:'pointer',marginTop:3,}}>
                     <Icon type="arrow-up" style={{fontSize:20,color:'#428ef2'}} />
                 </span></div> : null}
               </div>
            )
    }];

    const columnsa = [{
      title: '属性类别',
      dataIndex: 'description',
      key: 'description',
      width:150,
    }, {
      title: '属性值',
      dataIndex: 'proSkuValueList',
      key: 'proSkuValueList',
      render: (text, record, i) => (
        <div>
          <RadioGroup defaultValue='a' onChange={this.changeRadio.bind(this,i)}>
              {record.proSkuValueList.map((data,j)=>{
                return <Radio key={j} value={data.id}>{data.skuValue}</Radio>
              })}
          </RadioGroup>

        </div>
      )
    }];

    const imageUrl = this.state.imageUrl;
    return (
      <div className="PageMain">
        <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
         <div className='page_add_input'>
           <Form className="page_from" style={{width: '100%'}} onSubmit={this.handleSubmit}>
              <div className="page_add_input_btn">
                 <li style={{fontSize:14}}>新增产品</li>
                 <div className="page_add_input_btn_right">
                     <Button type="primary" htmlType="submit" icon="save">
                       保存
                     </Button>
                     <Button type="primary" onClick={this.submits} icon="save">
                       保存并新增
                     </Button>
                 </div>
              </div>
              <Tabs defaultActiveKey="1" >
                  <TabPane tab="新增产品" key="1">
                    <div className="page_add_input_main">
                           <div className="page_add_input_main_form" style={{width:'25%'}}>
                               <div className="ant-row ant-form-item" style={{marginBottom:15}}>
                                  <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                     <label className="ant-form-item-required" title="头像">图片</label>
                                  </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                      <Upload
                                        name="file"
                                        accept='image'
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={globals.url.url+'/common/file/upLoad'}
                                        withCredentials={true}
                                        data={{'publicType':1}}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChanges}
                                      >
                                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{width:90}} /> : uploadButton}
                                      </Upload>
                                  </div>
                               </div>
                               <FormItem
                                  {...formItemLayout}
                                  label="SPU编码"
                                >
                                  {getFieldDecorator('spuCode', {
                                    rules: [{
                                      required: true,whitespace:true, message: '请输入SPU编码!',
                                    }],
                                    initialValue:this.state.initSPU
                                  })(
                                    <Input onChange={this.changeSPU}  placeholder="请输入SPU编码" />
                                  )}
                               </FormItem>
                               <FormItem
                                  {...formItemLayout}
                                  label="产品名称"
                                >
                                  {getFieldDecorator('name', {
                                    rules: [{
                                      required: true,whitespace:true, message: '请输入产品名称!',
                                    }],
                                  })(
                                    <Input onChange={this.changeProName} placeholder="请输入产品名称" />
                                  )}
                               </FormItem>
                               <FormItem
                                  {...formItemLayout}
                                  label="产品分类"
                                >
                                {getFieldDecorator('categoryId', {
                                  rules: [
                                    { required: true, message: '请选择产品分类!' },
                                  ],
                                })(
                                  <Select placeholder="请选择产品分类">
                                    {this.state.proCategory.length > 0 ? this.state.proCategory.map((data,i)=>{
                                      return <Option key={i} value={data.id}>{data.name}</Option>
                                    }) : null}
                                  </Select>
                                )}
                               </FormItem>
                            </div>
                            <div className="page_add_input_main_form" style={{width:'40%'}}>
                                <FormItem
                                   {...formItemLayout}
                                   label="存货类型"

                                 >
                                 {getFieldDecorator('stockTypeId', {
                                   rules: [
                                     { required: true, message: '请选择存货类型!' },
                                   ],
                                 })(
                                   <Select placeholder="请选择存货类型" onChange={this.handleSelectChange}>
                                     {this.state.proStockType.length > 0 ? this.state.proStockType.map((data,i)=>{
                                       return <Option key={i} value={data.id}>{data.stockType}</Option>
                                     }) : null}
                                   </Select>
                                 )}
                                </FormItem>
                                <FormItem
                                  {...formItemLayout}
                                   label="可否销售"
                                 >

                                     <Checkbox
                                        disabled
                                        checked={this.state.canSales}
                                      >

                                      </Checkbox>

                                </FormItem>
                                <FormItem
                                   {...formItemLayout}
                                   label="产品来源"
                                 >
                                 {getFieldDecorator('transferGoodsType', {
                                   rules: [
                                     { required: true, message: '请选择存货类型!' },
                                   ],
                                   initialValue:this.state.productSource
                                 })(
                                   <Input disabled placeholder="请选择存货类型" />
                                 )}
                                </FormItem>
                                <FormItem
                                   {...formItemLayout}
                                   label="条形码"
                                 >
                                   {getFieldDecorator('shapeCode', {
                                     rules: [{
                                       required: true,whitespace:true, message: '请输入条形码!',
                                     }],
                                   })(
                                     <Input onChange={this.changeCode} placeholder="请输入条形码" />
                                   )}
                                </FormItem>
                                <div className="ant-row ant-form-item" >
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label className="ant-form-item-required" title="有效管理">有效管理</label>
                                   </div>
                                   <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17" style={{display:'flex'}}>
                                     <FormItem
                                         labelCol={{ span: 7 }}
                                         wrapperCol={{ span: 24 }}
                                         style={{width:100}}
                                         label=""
                                      >
                                      {getFieldDecorator('productDateOption', {
                                        rules: [{
                                          required: false, message: '生产日期!',
                                        }],
                                        initialValue:this.state.checkNick
                                      })(
                                        <Checkbox

                                         >
                                           生产日期
                                         </Checkbox>
                                      )}
                                     </FormItem>
                                     <FormItem
                                         labelCol={{ span: 7 }}
                                         wrapperCol={{ span: 24 }}
                                         style={{width:90}}
                                        label=""
                                      >
                                      {getFieldDecorator('expirationDateOption', {
                                        rules: [{
                                          required: false, message: '',
                                        }],
                                        initialValue:this.state.isBzq
                                      })(
                                        <Checkbox
                                            onChange={this.bzqChange}
                                         >
                                           保质期
                                         </Checkbox>
                                      )}
                                     </FormItem>
                                     {this.state.isBzq ? <FormItem
                                         labelCol={{ span: 7 }}
                                         wrapperCol={{ span: 24 }}
                                         style={{width:130}}
                                        label=""
                                      >
                                      {getFieldDecorator('expirationDateId', {
                                        rules: [{
                                          required: true,message: '请选择保质期!',
                                        }],
                                      })(
                                        <Select onChange={this.ChangeProUnit} placeholder="请选择保质期">
                                          {this.state.expirationDate.length > 0 ? this.state.expirationDate.map((data,i)=>{
                                            return <Option key={i} value={data.id}>{data.name}</Option>
                                          }) : null}
                                        </Select>
                                      )}
                                    </FormItem> : null}

                                   </div>
                                </div>

                            </div>
                            <div className="page_add_input_main_form" style={{width:'35%'}}>
                                <FormItem
                                   {...formItemLayout}
                                   label="基本单位"
                                 >
                                 {getFieldDecorator('baseUnitId', {
                                   rules: [
                                     { required: true, message: '请选择基本单位!' },
                                   ],
                                 })(
                                   <Select onChange={this.ChangeProUnit} placeholder="请选择基本单位">
                                     {this.state.proUnit.length > 0 ? this.state.proUnit.map((data,i)=>{
                                       return <Option key={i} value={data.id}>{data.name}</Option>
                                     }) :null}
                                   </Select>
                                 )}
                                </FormItem>
                                <FormItem
                                  {...formItemLayout}
                                   label="双单位管理"
                                 >
                                   {getFieldDecorator('unitType', {
                                     rules: [{
                                       required: false, message: '双单位管理!',
                                     }],
                                     initialValue:this.state.isShow
                                   })(
                                     <Checkbox
                                        onChange={this.handleChange}
                                      >
                                        {this.state.isEmergencyContact}
                                      </Checkbox>
                                   )}
                                </FormItem>
                                {this.state.isShow ? <FormItem
                                   {...formItemLayout}
                                   label="辅助单位"
                                 >
                                 {getFieldDecorator('assistUnitId', {
                                   rules: [
                                     { required: true, message: '请选择辅助单位!' },
                                   ],
                                 })(
                                   <Select onChange={this.fzChange} placeholder="请选择基本单位">
                                     {this.state.proUnit.length > 0 ? this.state.proUnit.map((data,i)=>{
                                       return <Option key={i} value={data.id}>{data.name}</Option>
                                     }) :null}
                                   </Select>
                                 )}
                               </FormItem> : null}
                                {this.state.isShow ? <FormItem
                                    labelCol={{ span: 7 }}
                                    wrapperCol={{ span: 16 }}
                                   label="换算率"
                                 >
                                   <div style={{display:'flex',justifyContent:'space-around'}}>
                                     <span>1{this.state.fzProUnit}= </span>
                                     <span style={{width:100}}>
                                       {getFieldDecorator('conversionRate', {
                                         rules: [{
                                           required: true,whitespace:true, message: '请输入换算率!',
                                         }],
                                       })(
                                         <Input type="number" placeholder="请输入换算率" />
                                       )}
                                     </span>
                                     <span>千克</span>
                                   </div>
                                </FormItem> : null}
                            </div>
                      </div>
                      <div style={{padding:'0 0px',paddingRight: 21}}>
                          <div className="ant-row ant-form-item" >
                             <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-2">
                                <label className="ant-form-item-required" title="批次管理">批次管理</label>
                             </div>
                             <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-22" style={{display:'flex'}}>
                               <FormItem
                                   labelCol={{ span: 7 }}
                                   wrapperCol={{ span: 24 }}
                                   style={{width:60}}
                                   label=""
                                >
                                  {getFieldDecorator('batchOption', {
                                    rules: [{
                                      required: false, message: '',
                                    }],
                                    initialValue:this.state.isGlPc
                                  })(
                                    <Checkbox
                                        checked={this.state.isGlPc}
                                        onChange={this.isGlPc}
                                     >

                                     </Checkbox>
                                  )}
                               </FormItem>
                               {this.state.isShowZ ? <FormItem
                                   labelCol={{ span: 7 }}
                                   wrapperCol={{ span: 24 }}
                                   style={{width:150}}
                                  label=""
                                >
                                {getFieldDecorator('batchType', {
                                  rules: [
                                    { required: true, message: '请选择管理方式!' },
                                  ],
                                  initialValue:'日期+流水号'
                                })(
                                  <Select onChange={this.selectM} placeholder="请选择管理方式">
                                    <Option value='1'>自定义</Option>
                                    <Option value='2'>日期+流水号</Option>
                                    <Option value='3'>固定前缀+流水号</Option>
                                  </Select>
                                )}
                              </FormItem> : null}
                               {this.state.isShowAll ? <div style={{display:'contents'}}>
                               {this.state.isShowM ? <FormItem
                                   labelCol={{ span: 7 }}
                                   wrapperCol={{ span: 14 }}
                                   style={{width:260}}
                                  label="固定前缀"
                                >
                                  {getFieldDecorator('batchPrefix', {
                                    rules: [{
                                      required: true, message: '请输入固定前缀!',
                                    }],
                                    initialValue:'QY'
                                  })(
                                    <Input placeholder="请输入固定前缀" />
                                  )}
                               </FormItem> : <FormItem
                                   labelCol={{ span: 7 }}
                                   wrapperCol={{ span: 14 }}
                                   style={{width:260}}
                                  label="日期"
                                >
                                  {getFieldDecorator('batchPrefix', {
                                    rules: [{
                                      required: true, message: '请输入日期!',
                                    }],
                                    initialValue:moment().format("YYYYMMDD")
                                  })(
                                    <Input placeholder="请输入日期" />
                                  )}
                               </FormItem>}
                               <FormItem
                                   labelCol={{ span: 7 }}
                                   wrapperCol={{ span: 14 }}
                                   style={{width:300}}
                                  label="流水号位数"
                                >
                                {getFieldDecorator('batchSerialnoNum', {
                                  rules: [
                                    { required: true, message: '请选择流水号位数!' },
                                  ],
                                  initialValue:this.state.selectLs
                                })(
                                  <Select onChange={this.selectLs} placeholder="请选择流水号位数">
                                    <Option value='2'>2</Option>
                                    <Option value='3'>3</Option>
                                    <Option value='4'>4</Option>
                                    <Option value='5'>5</Option>
                                  </Select>
                                )}
                               </FormItem>
                               <FormItem
                                   labelCol={{ span: 7 }}
                                   wrapperCol={{ span: 14 }}
                                   style={{width:260}}
                                  label="初始号"
                                >
                                  {getFieldDecorator('batchStartNumber', {
                                    rules: [{
                                      required: true, message: '请输入初始号!',
                                    }],
                                    initialValue:'0'.repeat(this.state.selectLs-1)+'1'
                                  })(
                                    <Input  placeholder="请输入初始号" />
                                  )}
                               </FormItem>
                             </div> : null}
                             </div>
                          </div>
                      </div>
                  </TabPane>
                  <TabPane tab="采购数据" key="2">
                     <div className="page_add_input_main">
                       <div className="page_add_input_main_form" style={{width:'35%'}}>
                         <FormItem
                            {...formItemLayout}
                            label="默认供应商"
                          >
                            {getFieldDecorator('defaultSupplier', {
                              rules: [{
                                required: false,whitespace:true, message: '请输入默认供应商!',
                              }],
                              initialValue:'福建海之星远洋有限公司'
                            })(
                              <Input onChange={this.changeSPU}  placeholder="请输入默认供应商" />
                            )}
                         </FormItem>
                         <FormItem
                            {...formItemLayout}
                            label="采购单位"
                          >
                            {getFieldDecorator('purchaseUtil', {
                              rules: [{
                                required: true,whitespace:true, message: '请输入采购单位!',
                              }],
                              initialValue:''
                            })(
                              <Input   placeholder="请输入采购单位" />
                            )}
                         </FormItem>
                         <FormItem
                            {...formItemLayout}
                            label="计价单位"
                          >
                            {getFieldDecorator('valuationUtil', {
                              rules: [{
                                required: true,whitespace:true, message: '请输入计价单位!',
                              }],
                              initialValue:''
                            })(
                              <Input placeholder="请输入计价单位" />
                            )}
                         </FormItem>
                         <FormItem
                            {...formItemLayout}
                            label="收货上限(%)"
                          >
                            {getFieldDecorator('purchaseUpperLimit', {
                              rules: [{
                                required: false,whitespace:true, message: '请输入收货上限!',
                              }],
                              initialValue:''
                            })(
                              <Input  placeholder="请输入收货上限" />
                            )}
                         </FormItem>
                         <FormItem
                            {...formItemLayout}
                            label="收货下限(%)"
                          >
                            {getFieldDecorator('purchaseLowerLimit', {
                              rules: [{
                                required: false,whitespace:true, message: '请输入收货下限!',
                              }],
                              initialValue:''
                            })(
                              <Input  placeholder="请输入收货下限" />
                            )}
                         </FormItem>
                       </div>
                     </div>
                  </TabPane>
                  <TabPane tab="销售数据" key="3">
                    <div className="page_add_input_main">
                      <div className="page_add_input_main_form" style={{width:'35%'}}>
                        <FormItem
                           {...formItemLayout}
                           label="销售单位"
                         >
                           {getFieldDecorator('salesUtil', {
                             rules: [{
                               required: true,whitespace:true, message: '请输入销售单位!',
                             }],
                              initialValue:''
                           })(
                             <Input   placeholder="请输入销售单位" />
                           )}
                        </FormItem>


                        <FormItem
                           {...formItemLayout}
                           label="销售上限(%)"
                         >
                           {getFieldDecorator('salesUpperLimit', {
                             rules: [{
                               required: false,whitespace:true, message: '请输入销售上限!',
                             }],
                             initialValue:''

                           })(
                             <Input  placeholder="请输入销售上限" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="销售下限(%)"
                         >
                           {getFieldDecorator('salesLowerLimit', {
                             rules: [{
                               required: false,whitespace:true, message: '请输入销售下限!',
                             }],
                             initialValue:''
                           })(
                             <Input  placeholder="请输入销售下限" />
                           )}
                        </FormItem>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="库存数据" key="4">
                    <div className="page_add_input_main">
                      <div className="page_add_input_main_form" style={{width:'35%'}}>
                        <FormItem
                           {...formItemLayout}
                           label="库存单位"
                         >
                           {getFieldDecorator('stockUtil', {
                             rules: [{
                               required: true,whitespace:true, message: '请输入库存单位!',
                             }],
                             initialValue:''

                           })(
                             <Input  placeholder="请输入库存单位" />
                           )}
                        </FormItem>


                        <FormItem
                           {...formItemLayout}
                           label="最小库存"
                         >
                           {getFieldDecorator('minStock', {
                             rules: [{
                               required: false,whitespace:true, message: '请输入最小库存!',
                             }],
                             initialValue:''

                           })(
                             <Input  placeholder="请输入最小库存" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="最高库存"
                         >
                           {getFieldDecorator('maxStock', {
                             rules: [{
                               required: false,whitespace:true, message: '请输入最高库存!',
                             }],
                             initialValue:''

                           })(
                             <Input  placeholder="请输入最高库存" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="安全库存"
                         >
                           {getFieldDecorator('safeStock', {
                             rules: [{
                               required: false,whitespace:true, message: '请输入安全库存!',
                             }],
                             initialValue:''
                           })(
                             <Input  placeholder="请输入安全库存" />
                           )}
                        </FormItem>
                      </div>
                      <div className="page_add_input_main_form" style={{width:'35%'}}>
                        <FormItem
                           {...formItemLayout}
                           label="再补货点"
                         >
                           {getFieldDecorator('replenishStockPoint', {
                             rules: [{
                               required: false,whitespace:true, message: '请输入再补货点!',
                             }],
                             initialValue:''
                           })(
                             <Input   placeholder="请输入再补货点" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="最小订购量"
                         >
                           {getFieldDecorator('minSalesStock', {
                             rules: [{
                               required: false,whitespace:true, message: '请输入最小订购量!',
                             }],
                             initialValue:''
                           })(
                             <Input  placeholder="请输入最小订购量" />
                           )}
                        </FormItem>
                        <FormItem
                           {...formItemLayout}
                           label="启用预警管理"
                         >
                           {getFieldDecorator('openWarning', {
                             rules: [{
                               required: false,message: '',
                             }],
                           })(
                             <Checkbox
                              >
                              </Checkbox>
                           )}
                        </FormItem>

                      </div>
                    </div>
                  </TabPane>
              </Tabs>

            </Form>
          </div>
          <div className="page_add_tabs" style={{padding:0}}>
            <div className="page_add_input_btn">
               <li style={{fontSize:14}}>产品属性管理</li>
               <div className="page_add_input_btn_right">
                   <Button onClick={this.showModal} type="primary" shape="circle" icon="plus" />
               </div>
            </div>
            <div>
                <Table columns={this.state.column} dataSource={this.state.data} pagination={false}/>
            </div>
          </div>
        </Spin>
        <Modal
          title="属性添加"
          visible={this.state.visible}
          onOk={this.handleOk}
          width={800}
          onCancel={this.handleCancel}
        >
          <Table columns={columns} dataSource={this.state.datas} pagination={false}/>
        </Modal>

        <Modal
          title="属性添加"
          visible={this.state.visible1}
          onOk={this.handleOk1}
          width={800}
          onCancel={this.handleCancel1}
        >
          <Table columns={columnsa} dataSource={this.state.allDatas} pagination={false}/>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(connect()(addProduct));
