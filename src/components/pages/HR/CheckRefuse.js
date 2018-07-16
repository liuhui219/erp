/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
const { TextArea } = Input;
class CheckRefuse extends Component {
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
    this.getData(1,20)
  }

  getData(page,num){
    var that = this;
    fetch(globals.url.url+'/hr/employee/listReject?pageNum='+page+'&pageSize='+num, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      var arr = [];
      if(result.code == 0){
        result.result.object.map((data,i)=>{
          var obj = {
            key:i+1,
            index:that.state.data.length,
            jobNumber:data.number,
            name:data.name,
            sex:data.sexName,
            EmployeeType:data.employeeTypeName,
            nationality:data.nationTypeName,
            Nation:data.ethnicTypeName,
            NativePlace:data.nativePlace,
            HomeAddress:data.address,
            DocumentType:data.papersTypeName,
            DocumentNumber:data.papersNumber,
            birthDay:data.birthday,
            Education:data.educationName,
            id:data.id
          }
          arr.push(obj)
        })
         that.setState({
           mainData:result.result.object,
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
      dataId:data
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
    fetch(globals.url.url+'/hr/employee/updatePend', {
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
         message.success('已提交');
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
    if(!data){
      message.warning('请选择要删除的列表');
    }else{
    var that = this;
    that.setState({
      spinning:true,
      visible:false
    })
    fetch(globals.url.url+'/hr/employee/delete', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:that.toQueryString({
        "ids": data,
        'refuseReason': ''
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
         message.success('已删除');
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

  cancel(data){
    if(!data){
      message.warning('请选择要提交的列表');
    }else{
    var that = this;
    that.setState({
      spinning:true,
      visible:false
    })
    fetch(globals.url.url+'/hr/employee/updatePend', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:that.toQueryString({
        "ids": data,
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
         message.success('已提交');
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

  StaffInfo(data){
    this.props.history.push({pathname: '/erp/hr-entryjob-RefuseInfo/' + data.id});
    var obj = {name:'驳回详情-'+data.name,menuKey:'hr-entryjob-RefuseInfo/'+ data.id,key:'hr-entryjob-RefuseInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }


  render() {
    const columns = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      filterDropdown: (
        <div className="custom-filter-dropdown">

        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '工号',
      fixed: 'left',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      width:100,
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width:100,
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width:80,
    }, {
      title: '员工类型',
      dataIndex: 'EmployeeType',
      key: 'EmployeeType',
      width:150,
    }, {
      title: '国籍',
      dataIndex: 'nationality',
      key: 'nationality',
      width:100,
    }, {
      title: '民族',
      dataIndex: 'Nation',
      key: 'Nation',
      width:100,
    }, {
      title: '籍贯',
      dataIndex: 'NativePlace',
      key: 'NativePlace',
      width:100,
    }, {
      title: '家庭住址',
      dataIndex: 'HomeAddress',
      key: 'HomeAddress',
      width:150,
    }, {
      title: '证件类型',
      dataIndex: 'DocumentType',
      key: 'DocumentType',
      width:150,
    }, {
      title: '证件号码',
      dataIndex: 'DocumentNumber',
      key: 'DocumentNumber',
      width:170,
    }, {
      title: '出生日期',
      dataIndex: 'birthDay',
      key: 'birthDay',
      width:150,
    }, {
      title: '最高学历',
      dataIndex: 'Education',
      key: 'Education',
      width:100,
    }, {
      width:100,
      title: '操作',
      fixed: 'right',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record,i) => (
               <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                   <Tooltip title="重新提交">
                     <span className="account-table-title" onClick={this.reject.bind(this,record.id)} style={{cursor:'pointer'}}>
                       <Icon style={{color:'#428ef2'}} type="reload" />
                     </span>
                   </Tooltip>
                   <Tooltip title="删除" >
                       <span className="account-table-title" onClick={this.sure.bind(this,record.id)} style={{cursor:'pointer',marginLeft:10}}>
                         <Icon style={{color:'#428ef2'}} type="close-circle" />
                       </span>
                   </Tooltip>
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
                 <Button type="primary" onClick={this.cancel.bind(this,this.state.allId.join(','))} icon="reload">
                   重新提交
                 </Button>
                 <Button type="primary" onClick={this.sure.bind(this,this.state.allId.join(','))} icon="close">
                   删除
                 </Button>
             </div>
             <div className="page_table">
                <Table rowSelection={rowSelection} columns={columns}  dataSource={this.state.data} scroll={{ x: 1540,y:'calc(100% - 60px)'}} bordered pagination={false}/>
             </div>
             <div className="page_pagination">
                <Pagination showSizeChanger showQuickJumper pageSizeOptions={['10','20','50']} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={Number(this.state.recordTotal)} />
             </div>
         </Spin>
         <Modal
            title='原因'
            visible={this.state.visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <TextArea rows={4} onChange={this.onChangeInput.bind(this)} placeholder="请填写原因" />
        </Modal>
      </div>
    );
  }
}

export default connect()(CheckRefuse);
