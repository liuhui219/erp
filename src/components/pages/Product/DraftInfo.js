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
class DraftInfo extends Component {
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
      mains:[],
    }
  }

  componentDidMount(){
    this.getSelect();
    setTimeout(()=>{
      this.getData();
    },100)

    arr = [];
    mains = [];
    subData = [];
    var obj = {name:'产品详情',menuKey:'pro-draft-info/'+ this.props.match.params.id,key:'pro-draft-info'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/product/draft/showById?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
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
            if(i > 2){
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
        'SKU编码': that.state.initSPU+'0'+(i+1),
        '产品名称': that.state.ProName,
        '条形码': that.state.Code,
        'combination':that.state.stringCombination[i]
      }
      data.map((info,x)=>{
        skuData.map((infos,y)=>{
          for (let [k, v] of Object.entries(infos)) {
            if(info == v.id){
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
          dataIndex: 'SKU编码',
          key: 'SKU编码',
        }, {
          title: '产品名称',
          dataIndex: '产品名称',
          key: '产品名称',
        }, {
          title: '条形码',
          dataIndex: '条形码',
          key: '条形码',
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
            'SKU编码': that.state.initSPU+'0'+(i+1),
            '产品名称': that.state.ProName,
            '条形码': that.state.Code,
            'combination':result.result.stringCombination[i]
          }
          data.map((info,x)=>{
            result.result.skuData.map((infos,y)=>{
              for (let [k, v] of Object.entries(infos)) {
                if(info == v.id){
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
                'SKU编码': that.state.initSPU+'0'+(i+1),
                '产品名称': that.state.ProName,
                '条形码': that.state.Code,
                'combination':result.result.stringCombination[i]
              }
              data.map((info,x)=>{
                skuData.map((infos,y)=>{
                  for (let [k, v] of Object.entries(infos)) {
                    if(info == v.id){
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
          }

          values['headResourceKey'] = that.state.headResourceKey;
          if(that.state.data.length == 0){
            var productSku = null
          }else{
            var productSku = {
              skuHead:[that.state.proSkuCategory[0].id,that.state.proSkuCategory[1].id,that.state.proSkuCategory[2].id,...that.state.skuCategorysx],
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
          }

          values['headResourceKey'] = that.state.headResourceKey;
          if(that.state.data.length == 0){
            var productSku = null
          }else{
            var productSku = {
              skuHead:[that.state.proSkuCategory[0].id,that.state.proSkuCategory[1].id,that.state.proSkuCategory[2].id,...that.state.skuCategorysx],
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
            }else{
              message.warning(result.message);
              that.setState({
                spinning:false,
              })
            }
          }).catch((error) => {
            message.warning('加载失败，请刷新重试');

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

  deletes = (e) => {
    var that = this;

    fetch(globals.url.url+'/product/draft/delete', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body:JSON.stringify(
        Array.of(this.props.match.params.id)
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
         that.props.history.push({pathname: '/erp/pro-product-draft'});
         var obj = {name:'产品草稿',menuKey:'pro-product-draft',key:'pro-product-draft'};
         that.props.dispatch({ type: 'INCREMENT' ,text:obj});
         var objs = {menuKey:'pro-draft-info',key:'pro-draft-info'};
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

  edits = (e) => {
    this.props.history.push({pathname: '/erp/pro-Draft-edit/' + this.props.match.params.id});
    var obj = {name:'产品修改',menuKey:'pro-Draft-edit/'+ this.props.match.params.id,key:'pro-Draft-edit'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
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
                return <Radio  key={j} value={data.id}>{data.skuValue}</Radio>
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
                 <li style={{fontSize:14}}>产品详情</li>
                 <div className="page_add_input_btn_right">
                     <Button type="primary" onClick={this.edits} icon="edit">
                       修改
                     </Button>
                     <Button type="primary" onClick={this.deletes} icon="save">
                       删除
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
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16" style={{height:115}}>
                                      <img style={{height:90}} src={this.state.imageUrl} />
                                  </div>
                               </div>
                               <div className="ant-row ant-form-item">
                                  <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                     <label>SPU编码</label>
                                  </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.spuCode}
                                          </span>
                                      </div>
                                  </div>
                               </div>
                               <div className="ant-row ant-form-item">
                                  <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                     <label>产品名称</label>
                                  </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.name}
                                          </span>
                                      </div>
                                  </div>
                               </div>
                               <div className="ant-row ant-form-item">
                                  <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                     <label>产品分类</label>
                                  </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.categoryName}
                                          </span>
                                      </div>
                                  </div>
                               </div>
                            </div>
                            <div className="page_add_input_main_form" style={{width:'40%'}}>
                                <div className="ant-row ant-form-item">
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>存货类型</label>
                                   </div>
                                   <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                       <div className="ant-form-item-control has-success">
                                           <span className="ant-form-item-children">
                                             {this.state.mains.stockTypeName}
                                           </span>
                                       </div>
                                   </div>
                                </div>
                                <div className="ant-row ant-form-item">
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>可否销售</label>
                                   </div>
                                   <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                       <div className="ant-form-item-control has-success">
                                           <span className="ant-form-item-children">
                                             {this.state.mains.canSalesName}
                                           </span>
                                       </div>
                                   </div>
                                </div>
                                <div className="ant-row ant-form-item">
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>产品来源</label>
                                   </div>
                                   <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                       <div className="ant-form-item-control has-success">
                                           <span className="ant-form-item-children">
                                             {this.state.mains.productSource}
                                           </span>
                                       </div>
                                   </div>
                                </div>
                                <div className="ant-row ant-form-item">
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>条形码</label>
                                   </div>
                                   <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                       <div className="ant-form-item-control has-success">
                                           <span className="ant-form-item-children">
                                             {this.state.mains.shapeCode}
                                           </span>
                                       </div>
                                   </div>
                                </div>
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
                                      })(
                                        <Checkbox
                                           disabled
                                           checked={this.state.mains.productDateOption}
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
                                      })(
                                        <Checkbox
                                            disabled
                                            checked={this.state.mains.expirationDateOption}
                                         >
                                           保质期
                                         </Checkbox>
                                      )}
                                     </FormItem>
                                     {this.state.mains.expirationDateOption ? <div className="ant-row ant-form-item" style={{width:100}}>
                                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-24">
                                            <div className="ant-form-item-control has-success">
                                                <span className="ant-form-item-children">
                                                  {this.state.mains.expirationDateName}
                                                </span>
                                            </div>
                                        </div>
                                     </div> : null}

                                   </div>
                                </div>

                            </div>
                            <div className="page_add_input_main_form" style={{width:'35%'}}>

                                <div className="ant-row ant-form-item">
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>基本单位</label>
                                   </div>
                                   <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                       <div className="ant-form-item-control has-success">
                                           <span className="ant-form-item-children">
                                             {this.state.mains.baseUnit}
                                           </span>
                                       </div>
                                   </div>
                                </div>
                                <FormItem
                                  {...formItemLayout}
                                   label="双单位管理"
                                 >
                                   {getFieldDecorator('unitType', {
                                     rules: [{
                                       required: false, message: '双单位管理!',
                                     }],
                                   })(
                                     <Checkbox
                                        checked={this.state.mains.unitType}
                                        disabled
                                      >
                                      </Checkbox>
                                   )}
                                </FormItem>

                                {this.state.mains.unitType ? <div className="ant-row ant-form-item">
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>辅助单位</label>
                                   </div>
                                   <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                       <div className="ant-form-item-control has-success">
                                           <span className="ant-form-item-children">
                                             {this.state.mains.assistUnit}
                                           </span>
                                       </div>
                                   </div>
                                </div> : null}
                                {this.state.mains.unitType ? <FormItem
                                    labelCol={{ span: 7 }}
                                    wrapperCol={{ span: 16 }}
                                   label="换算率"
                                 >
                                   <div style={{display:'flex',justifyContent:'space-around'}}>
                                     <span>1{this.state.fzProUnit}= </span>
                                     <span style={{width:50}}>
                                       {this.state.mains.conversionRate}
                                     </span>
                                     <span>千克</span>
                                   </div>
                                </FormItem> : null}
                            </div>
                      </div>
                      <div style={{padding:'0 0px',paddingRight: 21}}>
                          <div className="ant-row ant-form-item" >
                             <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-2">
                                <label title="批次管理">批次管理</label>
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
                                  })(
                                    <Checkbox
                                        checked={this.state.mains.batchOption}
                                        disabled
                                     >
                                     </Checkbox>
                                  )}
                               </FormItem>

                               {this.state.mains.batchOption ? <div className="ant-row ant-form-item" style={{width:100}}>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-24">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.batchType == 1 ? '自定义' : null}
                                            {this.state.mains.batchType == 2 ? '日期+流水号' : null}
                                            {this.state.mains.batchType == 3 ? '固定前缀+流水号' : null}
                                          </span>
                                      </div>
                                  </div>
                               </div> : null}
                               {this.state.mains.batchOption ? <div style={{display:'contents'}}> {this.state.batchType != 1 ? <div style={{display:'contents'}}>
                               {this.state.batchType == 3 ? <div className="ant-row ant-form-item" style={{width:200}}>
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-8">
                                      <label>固定前缀</label>
                                   </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.batchPrefix}
                                          </span>
                                      </div>
                                  </div>
                               </div> : <div className="ant-row ant-form-item" style={{width:150}}>
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>日期</label>
                                   </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-17">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.batchPrefix}
                                          </span>
                                      </div>
                                  </div>
                               </div>}
                               <div className="ant-row ant-form-item" style={{width:200}}>
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-9">
                                      <label>流水号位数</label>
                                   </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.batchSerialnoNum}
                                          </span>
                                      </div>
                                  </div>
                               </div>

                               <div className="ant-row ant-form-item" style={{width:150}}>
                                   <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                      <label>初始号</label>
                                   </div>
                                  <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                      <div className="ant-form-item-control has-success">
                                          <span className="ant-form-item-children">
                                            {this.state.mains.batchStartNumber}
                                          </span>
                                      </div>
                                  </div>
                               </div>

                             </div> : null} </div> : null}
                             </div>
                          </div>
                      </div>
                  </TabPane>
                  <TabPane tab="采购数据" key="2">
                     <div className="page_add_input_main">
                       <div className="page_add_input_main_form" style={{width:'35%'}}>

                         <div className="ant-row ant-form-item">
                             <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                <label>默认供应商</label>
                             </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                <div className="ant-form-item-control has-success">
                                    <span className="ant-form-item-children">
                                      {this.state.mains.defaultSupplier}
                                    </span>
                                </div>
                            </div>
                         </div>
                         <div className="ant-row ant-form-item">
                             <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                <label>采购单位</label>
                             </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                <div className="ant-form-item-control has-success">
                                    <span className="ant-form-item-children">
                                      {this.state.mains.purchaseUtil}
                                    </span>
                                </div>
                            </div>
                         </div>
                         <div className="ant-row ant-form-item">
                             <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                <label>计价单位</label>
                             </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                <div className="ant-form-item-control has-success">
                                    <span className="ant-form-item-children">
                                      {this.state.mains.valuationUtil}
                                    </span>
                                </div>
                            </div>
                         </div>
                         <div className="ant-row ant-form-item">
                             <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                <label>收货上限(%)</label>
                             </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                <div className="ant-form-item-control has-success">
                                    <span className="ant-form-item-children">
                                      {this.state.mains.purchaseUpperLimit}
                                    </span>
                                </div>
                            </div>
                         </div>
                         <div className="ant-row ant-form-item">
                             <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                <label>收货下限(%)</label>
                             </div>
                            <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                                <div className="ant-form-item-control has-success">
                                    <span className="ant-form-item-children">
                                      {this.state.mains.purchaseLowerLimit}
                                    </span>
                                </div>
                            </div>
                         </div>
                       </div>
                     </div>
                  </TabPane>
                  <TabPane tab="销售数据" key="3">
                    <div className="page_add_input_main">
                      <div className="page_add_input_main_form" style={{width:'35%'}}>
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>销售单位</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.salesUtil}
                                   </span>
                               </div>
                           </div>
                        </div>
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>销售上限(%)</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.salesUpperLimit}
                                   </span>
                               </div>
                           </div>
                        </div>
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>销售下限(%)</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.salesLowerLimit}
                                   </span>
                               </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="库存数据" key="4">
                    <div className="page_add_input_main">
                      <div className="page_add_input_main_form" style={{width:'35%'}}>

                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>库存单位</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.stockUtil}
                                   </span>
                               </div>
                           </div>
                        </div>
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>最小库存</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.minStock}
                                   </span>
                               </div>
                           </div>
                        </div>
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>最高库存</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.maxStock}
                                   </span>
                               </div>
                           </div>
                        </div>
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>安全库存</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.safeStock}
                                   </span>
                               </div>
                           </div>
                        </div>

                      </div>
                      <div className="page_add_input_main_form" style={{width:'35%'}}>

                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>再补货点</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.replenishStockPoint}
                                   </span>
                               </div>
                           </div>
                        </div>
                        <div className="ant-row ant-form-item">
                            <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                               <label>最小订购量</label>
                            </div>
                           <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-15">
                               <div className="ant-form-item-control has-success">
                                   <span className="ant-form-item-children">
                                     {this.state.mains.minSalesStock}
                                   </span>
                               </div>
                           </div>
                        </div>


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
                               checked={this.state.mains.openWarning}
                               disabled
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
export default Form.create()(connect()(DraftInfo));
