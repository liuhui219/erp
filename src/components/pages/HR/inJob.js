/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../unit';
import Form7 from './modalForm/form7';
import FormLz from './modalForm/formLz';

const { TextArea } = Input;
class inJob extends Component {
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
      visible1:false,
      visible2:false,
      input:'',
      dataId:'',
      allId:[],
      modalDataLz:{},
      modalData:{positionTypeList:[],departmentTypeList:[]},
    }
  }

  componentDidMount(){
    this.getData(1,10);
  }
  getData(page,num){
    var that = this;
    fetch(globals.url.url+'/hr/employee/listPass?pageNum='+page+'&pageSize='+num, {
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
      pageSize:pageSize,
      spinning:true,
    })
    this.getData(current, pageSize)
  }

  onChange = (page) => {
    this.setState({
      page:page,
      spinning:true,
    })
    this.getData(page, this.state.pageSize)

  }
  // 点击显示离职Model
  reject(data){
    console.log(data)

    this.setState({
      visible2: true,
      dataId:data.id
    });
    this.getDataLz(data.jobNumber)
  }
  // 获取员工信息数据
  getDataLz(id){
    // /
    var that = this;
    fetch(globals.url.url+'/hr/employee/findByNumber?number='+id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){

        that.setState({
          modalDataLz:result.result,
        })
      }else{
        message.warning(result.message);
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
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
    fetch(globals.url.url+'/hr/employee/updateReject', {
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
    window.location=globals.url.url+'/hr/employee/exportEmployees'
  }

  cancel(data){
    var that = this;
    that.setState({
      spinning:true,
      visible:false
    })
    fetch(globals.url.url+'/hr/employee/updateReject', {
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

  StaffInfo(data){
    this.props.history.push({pathname: '/erp/hr-entryjob-InJobInfo/' + data.id});
    var obj = {name:'在职详情-'+data.name,menuKey:'hr-entryjob-InJobInfo/'+ data.id,key:'hr-entryjob-InJobInfo'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }

  transferPosition(data){
    // this.props.history.push({pathname: '/erp/hr-TransferPosition/' + data.id});
    // var obj = {name:'调岗申请-'+data.name,menuKey:'hr-TransferPosition/'+ data.id,key:'hr-TransferPosition'};
    // this.props.dispatch({ type: 'INCREMENT' ,text:obj});
    this.setState({
      visible1:true,
      modalId:data.id
    })
    this.getDatas(data.id);
  }

  dgCancel = () => {
    this.setState({
      visible1:false,
      visible2:false
    })
  }

  getDatas(id){
    var that = this;
    fetch(globals.url.url+'/hr/transfer/edit?employeeId='+id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        that.setState({
          modalData:result.result,
        })
      }else{
        message.warning(result.message);
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
    });
  }

  dgOk = () => {
    var that = this;
    this.refs.form.validateFields((err, values) => {
      if (!err) {
        var obj = {
          applyDate:values.applyDate.format('YYYY-MM-DD'),
          employeeId:that.state.modalId,
          expectDate:values.expectDate.format('YYYY-MM-DD'),
          newDepartmentId:values.newDepartmentId,
          newPositionId:values.newPositionId,
          oldDepartmentId:that.state.modalData['oldDepartmentId'],
          oldPositionId:that.state.modalData['oldPositionId'],
          startWorkTime:values.hiredate.format('YYYY-MM-DD'),
          transferReason:values.transferReason,
          transferType:values.transferType,
          workingDay:values.workingDay,
          remark:values.remark
        }
        that.modalSend(obj);
      }
    })
  }
  // 离职
  lzOk = () => {
    var that = this;

    this.refs.form.validateFields((err, values) => {
      if (!err) {
        delete values.oldDepartmentId;
        console.log(values)
        values.applyTime = values.applyTime.format('YYYY-MM-DD')
        values.expectDimissionTime = values.expectDimissionTime.format('YYYY-MM-DD')
        for (const item in values) {
          console.log(item)
          if(!values[item]){
            values[item] = ''
          }
        }
        let obj = {
          employeeId:that.state.dataId,
          dimissionType:values.dimissionType,
          applyTime:values.applyTime,
          expectDimissionTime:values.expectDimissionTime,
          dimissionReason:values.dimissionReason,
          remark:values.remark
        }

        that.modalSendLz(obj);
      }
    })
  }
  modalSendLz(obj){
    var that = this;
    fetch(globals.url.url+'/hr/dimission/add', {
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
      if(result.code == 0){
        message.success('保存成功');
        that.setState({
          visible2:false
        })
        that.getData(1,10);
      }else{
        message.warning(result.message);

      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');

    });
  }




  modalSend(obj){
    var that = this;
    fetch(globals.url.url+'/hr/transfer/add', {
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
      if(result.code == 0){
        message.success('保存成功');
        that.setState({
          visible1:false
        })
        that.getData(1,10);
      }else{
        message.warning(result.message);

      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');

    });
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
      width:120,
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
      width:110,
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

                   <Tooltip title="调岗">
                     <span className="account-table-title" onClick={this.transferPosition.bind(this,record)} style={{cursor:'pointer'}}>
                       <Icon style={{color:'#428ef2'}} type="retweet" />
                     </span>
                   </Tooltip>
                   <Tooltip title="离职" >
                       <span className="account-table-title" onClick={this.reject.bind(this,record)} style={{cursor:'pointer',marginLeft:10}}>
                         <Icon style={{color:'#428ef2'}} type="close-circle-o" />
                       </span>
                   </Tooltip>
                   <Tooltip title="查看详情">
                       <span onClick={this.StaffInfo.bind(this,record)} className="account-table-title" style={{cursor:'pointer',marginLeft:10,marginTop:3,}}>
                           <Icon type="eye-o" style={{fontSize:20,color:'#428ef2'}} />
                       </span>
                   </Tooltip>
               </div>

            )
    }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        var arr = [];
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
             <div className="page_check_head" style={{justifyContent: 'space-between'}}>
                 <li>在职档案</li>
                 <Button type="primary" onClick={this.sure.bind(this)} icon="save">
                   导出
                 </Button>
             </div>
             <div className="page_table">
                <Table rowSelection={rowSelection} columns={columns}  dataSource={this.state.data} scroll={{ x: 1600,y:'calc(100% - 60px)'}} bordered pagination={false}/>
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

        <Modal
           title='调岗申请'
           visible={this.state.visible1}
           width={1000}
           onOk={this.dgOk.bind(this)}
           onCancel={this.dgCancel}
           okText="确定"
           cancelText="取消"
         >
           <Form7 modalData={this.state.modalData} ref="form" />

       </Modal>
       <Modal
           title='离职申请'
           visible={this.state.visible2}
           width={1000}
           onOk={this.lzOk.bind(this)}
           onCancel={this.dgCancel}
           okText="确定"
           cancelText="取消"
         >
           <FormLz modalDataLz={this.state.modalDataLz} ref="form" />

       </Modal>
      </div>
    );
  }
}

export default connect()(inJob);
