/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
const { TextArea } = Input;
class OrderList extends Component {
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
      ids:[]
    }
  }

  componentDidMount(){
    this.getData(1,10)
  }

  getData(page,num){
    var that = this;
    fetch(globals.url.url+'/sale/order/list?pageNumber='+page+'&pageSize='+num, {
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
    fetch(globals.url.url+'/sale/order/updateCheckStatus?status=3&rejectRemark='+this.state.input, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body:JSON.stringify(that.state.ids)
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){
         that.getData(that.state.page,that.state.pageSize)
         that.setState({
           spinning:false
         })
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

  sure(data){
    console.log(data)
    if(data.length == 0){
      message.warning('请选择要操作的列表');
    }else{
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
  }

  delete(data){
    console.log(data)
    if(data.length == 0){
      message.warning('请选择要删除的列表');
    }else{
        var that = this;
        that.setState({
          spinning:true,
        })
        fetch(globals.url.url+'/sale/order/deleteRejectOrder', {
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
             message.success('删除成功');
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

  deletes(data){
     this.setState({
       visible:true,
       ids:data,
     })
  }

  reloads(id){
    this.props.history.push({pathname: '/erp/sale-OrderListInfo/' +id});
    var obj = {name:'销售详情',menuKey:'sale-OrderListInfo/'+ id,key:'sale-OrderListInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  StaffInfo(data){
    this.props.history.push({pathname: '/erp/pro-draft-info/' + data.id});
    var obj = {name:'产品详情',menuKey:'pro-draft-info/'+ data.id,key:'pro-draft-info'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  search(){
    this.props.history.push({pathname: '/erp/sale-History'});
    var obj = {name:'历史记录',menuKey:'sale-History',key:'sale-History'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }



  render() {
    const columns = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      fixed:'left',
      filterDropdown: (
        <div className="custom-filter-dropdown">

        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '销售单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width:150,
    }, {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width:150,
    }, {
      title: '业务员',
      dataIndex: 'salesmanName',
      key: 'salesmanName',
      width:100,
    }, {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width:100,
    }, {
      title: '订单类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width:120,
      render: (text, record,i) => (
                <div style={{display:'flex',alignItems:'center'}}>
                    <span>销售订单</span>
                </div>
            )
    }, {
      title: '下单日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width:150,
    }, {
      title: '交货日期',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      width:150,
    }, {
      title: '付款条件',
      dataIndex: 'settleWay',
      key: 'settleWay',
      width:120,
    }, {
      title: '结算方式',
      dataIndex: 'payWay',
      key: 'payWay',
      width:120,
    }, {
      title: '交货方式',
      dataIndex: 'deliveryWay',
      key: 'deliveryWay',
      width:120,
    }, {
      title: '应收金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width:120,
    }, {
      width:120,
      title: '操作',
      dataIndex: 'operation',
      fixed:'right',
      key: 'operation',
      render: (text, record,i) => (
                <div style={{display:'flex',alignItems:'center'}}>

                    <Tooltip title="详情">
                        <span onClick={this.reloads.bind(this,record.id)} className="account-table-title" style={{cursor:'pointer',marginTop:5,color:'#6eb1ff'}}>
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
                 <Button type="primary" onClick={this.delete.bind(this,this.state.allId)} icon="upload">
                   导出
                 </Button>


             </div>
             <div className="page_table">
                <Table rowSelection={rowSelection} columns={columns}  dataSource={this.state.data} scroll={{x:1600,y:'calc(100% - 60px)'}} bordered pagination={false}/>
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

export default connect()(OrderList);
