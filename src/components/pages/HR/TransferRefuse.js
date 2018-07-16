/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
const { TextArea } = Input;
class TransferRefuse extends Component {
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
    fetch(globals.url.url+'/hr/transfer/listReject?pageNum='+page+'&pageSize='+num, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      var arr = [];
      if(result.code == 0){
        result.result.object.map((data,i)=>{
          if(data.transferType == 1){
            data.transferType = '部门内部调岗'
          }else if(data.transferType == 2){
            data.transferType = '部门外部调岗'
          }else if(data.transferType == 3){
            data.transferType = '职务升迁'
          }else if(data.transferType == 4){
            data.transferType = '其他'
          }

          data['key'] = i+1;
          data['index'] = that.state.data.length;
          arr.push(data)
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
    fetch(globals.url.url+'/hr/transfer/updatePend', {
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
         message.success('重新提交');
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
      message.warning('请选择要审核的列表');
    }else{
        var that = this;
        that.setState({
          spinning:true,
          visible:false
        })
        fetch(globals.url.url+'/hr/transfer/updatePend', {
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
             message.success('重新提交成功');
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
    this.props.history.push({pathname: '/erp/hr-transferjob-transFerRefuseInfo/' + data.id});
    var obj = {name:'调岗详情-'+data.employeeName,menuKey:'hr-transferjob-transFerRefuseInfo/'+ data.id,key:'hr-transferjob-transFerRefuseInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  render() {
    const columns = [{
      width: 50,
      fixed: 'left',
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
      title: '调岗单号',
      fixed: 'left',
      dataIndex: 'transferNumber',
      key: 'transferNumber',
      width:130,
    }, {
      title: '工号',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      width:130,
    }, {
      title: '姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width:80,
    }, {
      title: '现部门',
      dataIndex: 'oldDepartmentName',
      key: 'oldDepartmentName',
      width:100,
    }, {
      title: '现岗位',
      dataIndex: 'oldPositionName',
      key: 'oldPositionName',
      width:100,
    }, {
      title: '任岗日期',
      dataIndex: 'startWorkTime',
      key: 'startWorkTime',
      width:120,
    }, {
      title: '在岗时间',
      dataIndex: 'workingDay',
      key: 'workingDay',
      width:130,
    }, {
      title: '调后部门',
      dataIndex: 'newDepartmentName',
      key: 'newDepartmentName',
      width:100,
    }, {
      title: '调后岗位',
      dataIndex: 'newPositionName',
      key: 'newPositionName',
      width:100,
    }, {
      title: '申请日期',
      dataIndex: 'applyDate',
      key: 'applyDate',
      width:120,
    }, {
      title: '计划调岗日期',
      dataIndex: 'expectDate',
      key: 'expectDate',
      width:140,
    }, {
      title: '调岗类型',
      dataIndex: 'transferType',
      key: 'transferType',
      width:100,
    }, {
      title: '调岗原因',
      dataIndex: 'transferReason',
      key: 'transferReason',
      width:100,
    }, {
      width:100,
      title: '操作',
      fixed:'right',
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

export default connect()(TransferRefuse);
