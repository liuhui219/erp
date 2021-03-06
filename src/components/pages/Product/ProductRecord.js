/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
const { TextArea } = Input;
class ProductRecord extends Component {
  constructor() {
    super();
    this.state={
      data:[],
      mainData:[],
      recordTotal:'',
      pageSize:10,
      page:1,
      spinning:true,
      tip:'加载中...',
      visible:false,
      input:'',
      dataId:'',
      allId:[],
    }
  }

  componentDidMount(){
    this.getData(1,10)
  }

  getData(page,num){
    var that = this;
    fetch(globals.url.url+'/product/product/list?pageNumber='+page+'&pageSize='+num, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      var arr = [];
      if(result.code == 0){
        result.result.object.map((data,i)=>{
          data['key'] = i+1;
          data['index'] = that.state.data.length;
          arr.push(data)
        })
         that.setState({
           data:arr,
           spinning:false,
           recordTotal:result.result.recordTotal
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

  onShowSizeChange(current, pageSize) {
    this.setState({
      page:current,
      pageSize:pageSize
    })
    console.log(current, pageSize);
    this.getData(current, pageSize)
  }

  onChange = (page) => {
    console.log(page);
    this.setState({
      page:page,
    })
    this.getData(page, this.state.pageSize)

  }

  reject(data){
    this.setState({
      visible: true,
      dataId:data.id
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
        "ids": that.state.dataId,
        'refuseReason': that.state.input
      })
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
         that.getData(that.state.page,that.state.pageSize)
         that.setState({
           spinning:false
         })
         message.success('已驳回');
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
    this.setState({
      visible: false,
    });
  }

  onChangeInput(e){
    this.setState({
       input:e.target.value
    })
  }

  sure(){
      //window.open(globals.url.url+'/hr/employee/exportEmployees');
      window.location=globals.url.url+'/hr/transfer/exportTransfers'
  }

  delete(data){
    console.log(data)
    if(data.length == 0){
      message.warning('请选择要审核的列表');
    }else{
        var that = this;
        that.setState({
          spinning:true,
        })
        fetch(globals.url.url+'/product/product/updateToFreeze', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/JSON'
          },
          body:JSON.stringify(data
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
             message.success('冻结成功');
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
  }

  undelete(data){
    console.log(data)
    if(data.length == 0){
      message.warning('请选择要审核的列表');
    }else{
        var that = this;
        that.setState({
          spinning:true,
        })
        fetch(globals.url.url+'/product/product/updateToNormal', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/JSON'
          },
          body:JSON.stringify(data
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
             message.success('解冻成功');
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
  }

  reloads(data){
    var that = this;
    that.setState({
      spinning:true,
    })
    fetch(globals.url.url+'/product/product/updateToFreeze', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body:JSON.stringify(data
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

  StaffInfo(data){
    this.props.history.push({pathname: '/erp/pro-Record-info/' + data.id});
    var obj = {name:'产品档案详情',menuKey:'pro-Record-info/'+ data.id,key:'pro-Record-info'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  dc(){
    window.location=globals.url.url+'/product/product/excel?pageNumber='+this.state.page+'&pageSize='+this.state.pageSize
  }

  render() {
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
      title: '产品编码',
      dataIndex: 'spuCode',
      key: 'spuCode',
      width:120,
    }, {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width:110,
    }, {
      title: '产品分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width:110,
    }, {
      title: '存货类型',
      dataIndex: 'stockTypeName',
      key: 'stockTypeName',
      width:110,
    }, {
      title: '是否可销售',
      dataIndex: 'canSalesName',
      key: 'canSalesName',
      width:130,
    }, {
      title: '产品来源',
      dataIndex: 'productSource',
      key: 'productSource',
      width:120,
    }, {
      title: '基本单位',
      dataIndex: 'baseUnit',
      key: 'baseUnit',
      width:120,
    }, {
      width:120,
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                   {record.freezeStatus == 1 ? <Tooltip title="冻结">
                       <span onClick={this.delete.bind(this,Array.of(record.id))} className="account-table-title" style={{cursor:'pointer',marginTop:3,}}>
                           <Icon type="lock" style={{fontSize:18,color:'#428ef2'}} />
                       </span>
                   </Tooltip> : null}
                   {record.freezeStatus == 2 ? <Tooltip title="解冻">
                       <span onClick={this.undelete.bind(this,Array.of(record.id))} className="account-table-title" style={{cursor:'pointer',marginTop:3,}}>
                           <Icon type="unlock" style={{fontSize:18,color:'#428ef2'}} />
                       </span>
                   </Tooltip> : null}

                   <Tooltip title="查看详情">
                       <span onClick={this.StaffInfo.bind(this,record)} className="account-table-title" style={{cursor:'pointer',marginLeft:10,marginTop:3,}}>
                           <Icon type="eye" style={{fontSize:20,color:'#428ef2'}} />
                       </span>
                   </Tooltip>
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
        })
      },
      getCheckboxProps: record => ({
        index: record.key,
      }),
    };

    return (
      <div className="page_check">
         <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
             <div className="page_check_head">
                 <Button type="primary" onClick={this.delete.bind(this,this.state.allId)} icon="lock">
                   冻结
                 </Button>
                 <Button type="primary" onClick={this.dc.bind(this)} icon="upload">
                   导出
                 </Button>
             </div>
             <div className="page_table">
                <Table rowSelection={rowSelection} columns={columns}  dataSource={this.state.data} scroll={{x:1100,y:'calc(100% - 60px)'}} bordered pagination={false}/>
             </div>
             <div className="page_pagination">
                <Pagination showSizeChanger showQuickJumper pageSizeOptions={['10','20','50']} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={Number(this.state.recordTotal)} />
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

export default connect()(ProductRecord);
