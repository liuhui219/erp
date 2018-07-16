/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,message,Pagination,Spin,Input,DatePicker } from 'antd';
import globals from 'src/components/unit';
const { TextArea } = Input;
export default class OperationLog extends Component {
  constructor() {
    super();
    this.state={
      data:[],
      recordTotal:'',
      pageSize:10,
      page:1,
      spinning:true,
      tip:'加载中...',
      time:null,
      selectValue:null
    }
  }

  componentDidMount(){
    this.getData(1,10)
  }
  onChangeTime = (date,dateString ) =>{
    this.setState({
        time:date.format('YYYY/MM/DD')
     })
  }
  userChang = (e) =>{
      this.setState({
        selectValue:e.target.value
      })
  }
  confirm = () =>{
    this.getData(this.state.page,this.state.pageSize)
  }
  getData(page,num){
    var that = this;
    let url = globals.url.url+'/sys/record/list?pageNumber='+page+'&pageSize='+num;
    if(that.state.time){
        url = url+'&createTime='+that.state.time;
    }
    if(that.state.selectValue){
        url = url+'&userName='+that.state.selectValue;
    }
    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      var arr = [];
      if(result.code == 0){
        result.result.object.map((data,i)=>{
            result.result.object[i].key = i;
        })
         that.setState({
           data:result.result.object,
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
      current = current ==0?1:current
    this.setState({
      page:current,
      pageSize:pageSize
    })
    this.getData(current, pageSize)
  }

  onChange = (page) => {
    this.setState({
      page:page,
    })
    this.getData(page, this.state.pageSize)

  }


  render() {
    const columns = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      filterDropdown: (
        <div className="custom-filter-dropdown">

        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width:100,
    }, {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width:100,
    }, {
      title: '登陆IP',
      dataIndex: 'ip',
      key: 'ip',
      width:80,
    }, {
      title: 'Mac地址',
      dataIndex: 'EmployeeType',
      key: 'EmployeeType',
      width:100,
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width:100,
    }, {
      title: '功能模块',
      dataIndex: 'moduleName',
      key: 'moduleName',
      width:100,
    }, {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width:100,
    }, {
      title: '操作结果',
      dataIndex: 'operationResult',
      key: 'operationResult',
      width:100,
    }, {
      title: '备注说明',
      dataIndex: 'remark',
      key: 'remark',
      width:200,

    }];


    return (
      <div className="page_check">
         <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
             <div className="pd20 clearfix flex">
                <div className="f_left">
                    <label>操作日期：</label>
                    <DatePicker onChange={this.onChangeTime} />
                 </div>
                 <div className="flex pl20">
                    <label >用户：</label>
                    <Input className="w200" onChange={this.userChang} />
                 </div>
                 {/* {/* <Button type="primary" onClick={this.cancel.bind(this,this.state.allId.join(','))} icon="close-square-o">
                   驳回
                 </Button> */}
                 <Button type="primary" className="ml20" onClick={this.confirm}  icon="search">
                   搜索
                 </Button>
             </div>
             <div className="page_table">
                <Table  columns={columns} scroll={{ x: 1540,y:'calc(100% - 60px)'}} dataSource={this.state.data} bordered pagination={false}/>
             </div>
             <div className="page_pagination">
                <Pagination showSizeChanger showQuickJumper pageSizeOptions={['10','20','50']} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={Number(this.state.recordTotal)} />
             </div>
         </Spin>
      </div>
    );
  }
}
