/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
const { TextArea } = Input;
class TrunkM extends Component {
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
    fetch(globals.url.url+'/sale/truck/listIn?pageNumber='+page+'&pageSize='+num, {
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

  delete(id){
    this.props.history.push({pathname: '/erp/sale-OutFactory/' +id});
    var obj = {name:'出货安排',menuKey:'sale-OutFactory/'+ id,key:'sale-OutFactory'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  reloads(id){
    this.props.history.push({pathname: '/erp/sale-ShipmentArrangement/' +id});
    var obj = {name:'出货安排',menuKey:'sale-ShipmentArrangement/'+ id,key:'sale-ShipmentArrangement'};
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
      filterDropdown: (
        <div className="custom-filter-dropdown">

        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '车牌号',
      dataIndex: 'truckNumber',
      key: 'truckNumber',
      width:140,
    }, {
      title: '进厂时间',
      dataIndex: 'inFactoryTime',
      key: 'inFactoryTime',
      width:160,
    }, {
      title: '卡号',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      width:110,
    }, {
      title: '发卡保安',
      dataIndex: 'cardSenderName',
      key: 'cardSenderName',
      width:110,
    }, {
      title: '门禁关卡',
      dataIndex: 'entranceGuard',
      key: 'entranceGuard',
      width:130,
    }, {
      title: '货车状态',
      dataIndex: 'truckStatus',
      key: 'truckStatus',
      width:120,
      render: (text, record,i) => (
        <div>
          {record.truckStatus == 1 ? <span>已发卡</span> : null}
          {record.truckStatus == 2 ? <span>已排货</span> : null}
          {record.truckStatus == 3 ? <span>已派单</span> : null}
          {record.truckStatus == 4 ? <span>已装货</span> : null}
          {record.truckStatus == 5 ? <span>已对账</span> : null}
          {record.truckStatus == 6 ? <span>已记账</span> : null}
          {record.truckStatus == 7 ? <span>已放行</span> : null}
          {record.truckStatus == 8 ? <span>已出厂</span> : null}
        </div>
      )
    }, {
      title: '放行保安',
      dataIndex: 'cardTakerName',
      key: 'cardTakerName',
      width:120,
    }, {
      title: '放行时间',
      dataIndex: 'outFactoryTime',
      key: 'outFactoryTime',
      width:160,
    }, {
      width:120,
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
               <div style={{display:'flex',alignItems:'center'}}>
                   {record.truckStatus == 1 ? <Tooltip title="出货安排">
                       <span onClick={this.reloads.bind(this,record.id)} className="account-table-title" style={{cursor:'pointer',marginTop:3,color:'#6eb1ff'}}>
                           出货安排
                       </span>
                   </Tooltip> : null}
                   {record.truckStatus == 6 ? <Tooltip title="放行">
                       <span onClick={this.delete.bind(this,Array.of(record.id))} className="account-table-title" style={{cursor:'pointer',marginLeft:10,marginTop:3,color:'#6eb1ff'}}>
                           放行
                       </span>
                   </Tooltip> : null}
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
                 <Button type="primary" onClick={this.search.bind(this)} icon="search">
                   查看历史记录
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

export default connect()(TrunkM);
