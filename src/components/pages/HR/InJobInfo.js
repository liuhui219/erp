/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button,Popconfirm,Tooltip,message,Pagination,Spin,Modal,Input,Tabs } from 'antd';
import globals from '../../unit';
import { connect } from 'react-redux';
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
class InJobInfo extends Component {
  constructor() {
    super();
    this.state={
      data:{},
      imgs:'',
      show:false,
      spinning:true,
      data1:[],
      data2:[],
      data5:[],
      data6:[],
      key:1,
      input:'',
      tip:'加载中...',
    }
  }

  componentDidMount(){
    this.getData();

  }

  getData(){
    var that = this;
    fetch(globals.url.url+'/hr/employee/showPend?id='+this.props.match.params.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log('2222222',result)

      if(result.code == 0){
        that.setState({
          data:result.result,
          spinning:false,
          data1:JSON.parse(result.result.learningExperience),
          data2:JSON.parse(result.result.workExperience),
          data6:JSON.parse(result.result.socialRelation),
          data5:JSON.parse(result.result.contractRecord),
          imgs:globals.url.url+'/common/file/download?key='+result.result.headResourceKey
        })
        var obj = {name:'入职详情-'+result.result.name,menuKey:'hr-entryjob-InJobInfo/'+ that.props.match.params.id,key:'hr-entryjob-InJobInfo'};
        that.props.dispatch({ type: 'INCREMENT' ,text:obj});
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

  shows(){
    this.setState({
      show:true
    })
  }

  close(){
    this.setState({
      show:false
    })
  }

  tabCallback(key){
     this.setState({
       key:key
     })
  }

  cancel(){
    this.setState({
      visible:true
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
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
    const {history} = this.props;
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
        "ids": that.props.match.params.id,
        'refuseReason': that.state.input
      })
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){

         that.setState({
           spinning:false
         })
         message.success('已提交');
         history.push({pathname: '/erp/hr-entryjob-check',});
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

  sure(){
    window.location=globals.url.url+'/hr/employee/exportEmployees'
  }

  onChangeInput(e){
    this.setState({
       input:e.target.value
    })
  }

  revise(){
    this.props.history.push({pathname: '/erp/hr-entryjob-inJobRevise/' + this.props.match.params.id});
    var obj = {name:'在职档案-修改',menuKey:'hr-entryjob-inJobRevise/'+ this.props.match.params.id,key:'hr-entryjob-inJobRevise'};
    this.props.dispatch({ type: 'INCREMENT' ,text:obj});
  }


  render() {

    const columns1 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '学校/培训机构',
      dataIndex: 'schools',
      key: 'schools',
    }, {
      title: '专业/培训课程',
      dataIndex: 'major',
      key: 'major',
    }, {
      title: '取得证书',
      dataIndex: 'certificate',
      key: 'certificate',
    }, {
      title: '学历',
      dataIndex: 'Education',
      key: 'Education',
    }, {
      title: '学位',
      dataIndex: 'Academic',
      key: 'Academic',
    }];
    const columns2 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    }, {
      title: '职位',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '离职原因',
      dataIndex: 'master',
      key: 'master',
    }, {
      title: '证明人',
      dataIndex: 'reterence',
      key: 'reterence',
    }, {
      title: '联系电话',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    }];

    const columns5 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
    }, {
      title: '合同期限',
      dataIndex: 'contractPeriod',
      key: 'contractPeriod',
    }, {
      title: '合同状态',
      dataIndex: 'contractStatus',
      key: 'contractStatus',
    }];

    const columns6 = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      render: (text, record,i) => (
                <span>{i+1}</span>
            )
    }, {
      title: '关系',
      dataIndex: 'relation',
      key: 'relation',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '职业',
      dataIndex: 'profession',
      key: 'profession',
    }, {
      title: '工作单位',
      dataIndex: 'job',
      key: 'job',
    }, {
      title: '是否紧急联系人',
      dataIndex: 'isEmergencyContact',
      key: 'isEmergencyContact',
    }, {
      title: '电话',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    }];
    return (
      <div className="PageMain">
        <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
          <div className='page_add_input' style={{padding:20}}>
              <div className="page_info">
                 <div className="page_info_main">
                   <div className="page_info_image"><img style={{height:90}} src={this.state.imgs} /></div>
                   <div className="page_info_main_all" style={{borderRight:'1px solid #ccc'}}>
                      <li style={{fontSize:18,color:'#333'}}>
                        {this.state.data.name}
                      </li>
                      <li>
                        {this.state.data.sexName}
                      </li>
                      <li>
                        {this.state.data.phoneNumber}
                      </li>
                   </div>
                   <div className="page_info_main_all" >
                      <li>
                        <span style={{fontSize:14,paddingRight:10}}>{this.state.data.employeeTypeName}</span>  <span>{this.state.data.number}</span>
                      </li>
                      <li>
                        <span style={{fontSize:14,paddingRight:10}}>{this.state.data.departmentName}</span>  <span>{this.state.data.postionName}</span>
                      </li>
                      <li>
                        <span style={{fontSize:14,paddingRight:10}}>生日</span>{this.state.data.birthday}
                      </li>
                   </div>

                   {!this.state.show ? <div style={{display:'flex',alignItems:'flex-end',marginLeft:15}}>
                      <li onClick={this.shows.bind(this)} style={{color:'#428ef2',cursor:'pointer'}}>展开<Icon style={{paddingLeft:5}} type="caret-down" /></li>
                   </div> : null}
                 </div>
                 <div className="page_add_input_btn_right">


                     <Button onClick={this.sure.bind(this)}  style={{marginLeft:15}} type="primary" icon="close">
                       导出
                     </Button>
                     <Button onClick={this.revise.bind(this)} style={{marginLeft:15}}  type="primary" icon="dvt-salesOrder">
                       修改
                     </Button>
                 </div>
              </div>
              {this.state.show ? <div className="page_infos">
                 <div className="page_infos_main">
                    <li>{this.state.data.hiredate}</li>
                    <li>{this.state.data.school}({this.state.data.educationName})</li>
                    <li>{this.state.data.professional}</li>
                 </div>
                 <div className="page_infos_main">
                    <li>{this.state.data.nationTypeName}/{this.state.data.ethnicTypeName}</li>
                    <li>籍贯：{this.state.data.nativePlace}</li>
                    <li>住址：{this.state.data.address}</li>
                 </div>
                 <div className="page_infos_main">
                    <li>邮箱：{this.state.data.email}</li>
                    <li>微信号：{this.state.data.wechat}</li>
                    <li>{this.state.data.papersTypeName}：{this.state.data.papersNumber}</li>
                 </div>
                 <div style={{display:'flex',alignItems:'flex-end',paddingBottom:10}}>
                    <li onClick={this.close.bind(this)} style={{color:'#428ef2',cursor:'pointer'}}>收起<Icon style={{paddingLeft:5}} type="caret-up" /></li>
                 </div>
              </div> : null}
          </div>

          <div className="page_add_tabs">
            <Tabs defaultActiveKey="1" tabBarStyle={{border:'none'}} onChange={this.tabCallback.bind(this)}>
              <TabPane tab="学习经历" key="1">
                 <Table columns={columns1} dataSource={this.state.data1} bordered pagination={false}/>
              </TabPane>
              <TabPane tab="工作经历" key="2">
                 <Table columns={columns2} dataSource={this.state.data2} bordered pagination={false}/>
              </TabPane>
              <TabPane tab="劳务合同" key="5">
                 <Table columns={columns5} dataSource={this.state.data5} bordered pagination={false}/>
              </TabPane>
              <TabPane tab="社会关系" key="6">
                 <Table columns={columns6} dataSource={this.state.data6} bordered pagination={false}/>
              </TabPane>
            </Tabs>
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

export default connect()(InJobInfo);
