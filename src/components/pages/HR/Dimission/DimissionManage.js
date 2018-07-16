/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../../unit';
const { TextArea } = Input;
class DimissionRejectManage extends Component {
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
    fetch(globals.url.url+'/hr/dimission/handlePageList?checkStatus=3&pageNum='+page+'&pageSize='+num, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      var arr = [];
      if(result.code == 0){
        console.log(result)
        result.result.object.map((data,i)=>{

          switch (data.dimissionType) {
            case 1:
            data.dimissionType = '离职'
                break;
            case 2:
            data.dimissionType = '合同到期'
                break;
            case 3:
            data.dimissionType = '试用期不及格'
                break;
            case 4:
            data.dimissionType = '自动离职'
                break;
            case 5:
            data.dimissionType = '急辞'
                break;
            case 6:
            data.dimissionType = '开除'
                break;
            case 7:
            data.dimissionType = '其他'
                break;
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

  onChangeInput(e){
    this.setState({
       input:e.target.value
    })
  }
  // 审核通过
  reject(data){

    if(!data){
      message.warning('请选择要重新提交的列表');
    }else{
      var that = this;
      that.setState({
        spinning:true,
        visible:false
      })
      fetch(globals.url.url+'/hr/dimission/resubmit', {
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

  sure(data){
    if(!data){
      message.warning('请选择要删除的列表');
    }else{
        var that = this;
        that.setState({
          spinning:true,
          visible:false
        })
        fetch(globals.url.url+'/hr/dimission/delete', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body:that.toQueryString({
            "ids": data
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

  StaffInfo(data){
    console.log(data)
    this.props.history.push({pathname: '/erp/DimissionManageInfo/' + data.id});
    var obj = {name:'离职办理-'+data.employeeName,menuKey:'DimissionManageInfo/'+ data.id,key:'DimissionManageInfo'};
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
      title: '离职单号',
      fixed:'left',
      dataIndex: 'dimissionNumber',
      key: 'dimissionNumber',
      width:100,
    }, {
      title: '工号',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      width:100,
    }, {
      title: '姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width:80,
    }, {
        title: '员工类型',
        dataIndex: 'employeeTypeName',
        key: 'employeeTypeName',
        width:100,
      }, {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width:100,
    }, {
      title: '岗位',
      dataIndex: 'postionName',
      key: 'postionName',
      width:100,
    }, {
      title: '入职日期',
      dataIndex: 'hiredate',
      key: 'hiredate',
      width:100,
    }, {
      title: '在岗时间',
      dataIndex: 'workDay',
      key: 'workDay',
      width:120,
    }, {
      title: '申请日期',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width:100,
    }, {
      title: '计划离职日期',
      dataIndex: 'expectDimissionTime',
      key: 'expectDimissionTime',
      width:130,
    }, {
      title: '离职类型',
      dataIndex: 'dimissionType',
      key: 'dimissionType',
      width:100,
    }, {
      title: '离职原因',
      dataIndex: 'dimissionReason',
      key: 'dimissionReason',
      width:140,
    }, {
        title: '驳回原因',
        fixed:'right',
        dataIndex: 'refuseReason',
        key: 'refuseReason',
        width:140,
      }, {
      width:100,
      title: '操作',
      fixed:'right',
      dataIndex: 'operation',
      key: 'operation',
      align:'center',
      render: (text, record,i) => (
               <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>

                   {/* <Tooltip title="操作" >
                       <span className="account-table-title" onClick={this.sure.bind(this,record.id)} style={{cursor:'pointer',marginLeft:10}}>
                         <Icon style={{color:'#428ef2'}} type="close-circle" />
                       </span>
                   </Tooltip> */}
                   <Tooltip title="查看/提交">
                       <span onClick={this.StaffInfo.bind(this,record)} className="account-table-title" style={{cursor:'pointer',marginLeft:10,marginTop:3,}}>
                           <Icon type="file-add" style={{fontSize:20,color:'#428ef2'}} />
                       </span>
                   </Tooltip>
               </div>



            )
    }];
    let width = 0;
      columns.map((item,index) =>{
        width += item.width;
      })
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
                 {/* <Button type="primary" onClick={this.sure.bind(this,this.state.allId.join(','))} icon="close-square-o">
                   删除
                 </Button>
                 <Button type="primary" onClick={this.reject.bind(this,this.state.allId.join(','))} icon="save">
                   重新提交
                 </Button> */}
             </div>
             <div className="page_table">
                <Table rowSelection={rowSelection} columns={columns} scroll={{ x: width,y:'calc(100% - 60px)'}}  dataSource={this.state.data} bordered pagination={false}/>
             </div>
             <div className="page_pagination">
                <Pagination showSizeChanger showQuickJumper pageSizeOptions={['10','20','50']} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={Number(this.state.recordTotal)} />
             </div>
         </Spin>

      </div>
    );
  }
}

export default connect()(DimissionRejectManage);
