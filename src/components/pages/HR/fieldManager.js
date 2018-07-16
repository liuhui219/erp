/* @flow */

import React, { Component } from 'react';
import {Icon, Input, Button, Checkbox, message, Spin, Modal, Tabs, Collapse,Popconfirm,Pagination} from 'antd';
import globals from '../../unit';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel;
var limitDatas = [];
export default class fieldManager extends Component {
  constructor() {
    super();
    this.state={
      userData:[],
      totalData:'',
      listData:[],
      page:1,
      index:0,
      roleIds:[],
      permissionIds:[],
      limitFieldMap:null,
      data:[],
      fieldData:[],
      limitFieldList:[],
      id:'',
      limitId:'',
    }
  }
  componentDidMount(){
    this.getUser(1,20);
    this.getList();
    this.getParent();
  }

  getUser(page,num){
    var that = this;
    fetch(globals.url.url+'/sys/user/list?pageNumber='+page+'&pageSize='+num, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
        console.log('xxoo',result)
          that.setState({
            userData:result.result.object,
            spinning:false,
            id:result.result.object[0].id,
            totalData:result.result.recordTotal
          })
          if(result.result.recordTotal > 0){
            that.getData(result.result.object[0].id)
          }
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

  getList(){
    var that = this;
    fetch(globals.url.url+'/sys/role/list', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
          that.setState({
            listData:result.result,
            spinning:false,
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

  getParent(){
    var that = this;
    fetch(globals.url.url+'/common/permissionModules/list', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log('3333',result)

      if(result.code == 0){
          that.setState({
             data:result.result.modules,
             spinning:false,
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

  getData(id){
    var that = this;
    fetch(globals.url.url+'/sys/permission/userPermissions?userId='+id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      if(result.code == 0){
          that.setState({
             roleIds:result.result.roleIds,
             spinning:false,
             limitFieldMap:result.result.limitFieldMap,
             permissionIds:result.result.permissionIds
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

  onChange = (page) => {
    this.setState({
      page: page,
    });
    this.getUser(page,20)
  }

  selectName(data,index){
    this.setState({
      index:index,
      spinning:true,
      fieldData:[],
      id:data.id
    })
    this.getData(data.id)

  }

  onChangeGroup(value){
    this.setState({
      roleIds:value
    })
    if(this.state.listData.length > 0){
      this.state.listData.map((data,i)=>{
        if(data.id == value[value.length-1]){
          this.setState({
            permissionIds:[...new Set(Array.of(...this.state.permissionIds,...data.permissionJson))],
          })
        }
      })
    }



  }

  onChangePermission(value){
    this.setState({
      permissionIds:value
    })
  }

  save(){
    var that = this;
    this.setState({
      spinning:true
    })
    fetch(globals.url.url+'/sys/permission/updateUserFieldPermissions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userId":that.state.id,
        "permissionJson": that.state.permissionIds,
        "roleJson":that.state.roleIds,
        "limitFieldList":limitDatas
      })
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){

         that.setState({
           spinning:false
         })

         message.success('已提交保存');
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

  selectP(data){
    var that = this;
    var arrs = [];
    this.setState({
      spinning:true,
      limitId:data.id
    })
    fetch(globals.url.url+'/common/permissionModules/fields?permissionId='+data.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log('666',result)
      if(result.code == 0){
          that.setState({
             spinning:false,
             fieldData:result.result
          })

          for(var x in that.state.limitFieldMap){
            if(data.id == x){
              that.state.limitFieldMap[x].map((info,i)=>{
                result.result.map((infos,j)=>{
                  if(info == infos.fieldKey){
                    arrs.push(infos.id)
                    that.setState({
                       limitFieldList:arrs
                    })
                  }
                })
              })
            }
          }

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

  onChangeField(value){
    var arr = [];
    var arrs = [];
    var da = [];
    var obj = {};
    this.setState({
      limitFieldList:value
    })
    this.state.fieldData.map((data,i)=>{
      if(value.length > 0){
        value.map((info,j)=>{
          if(data.id == info){
            arr.push(data)
          }
        })
      }else{
          arr.length = 0;
          arr = [];
      }
    })

    arr && arr.map((data,i)=>{
      arrs.push(data.fieldKey);
      if(arr.length - 1 == i){
        obj = {
          permissionId:this.state.limitId,
          limitFields:arrs
        }
      }
    })

    if(limitDatas.length > 0){
      limitDatas.map((data,i)=>{
        da.push(data.permissionId);
        if(data.permissionId == this.state.limitId){
          limitDatas.splice(i,1);
          if(arr.length > 0 ){
            limitDatas.push(obj);
          }

        }
        if(limitDatas.length-1 == i && !da.includes(this.state.limitId)){
          if(arr.length > 0 ){
            limitDatas.push(obj);
          }
        }
      })
    }else{
      if(arr.length > 0 ){
        limitDatas.push(obj);
      }
    }

    console.log(limitDatas)

  }

  render() {
    const customPanelStyle = {
      borderRadius: 4,
      border: 1,
      overflow: 'hidden',
    };
    return (
       <div className="PageMain">
          <Spin size="large" tip='加载中...' spinning={this.state.spinning}>
          <div className="pages_mains">
             <div className="pages_list">
               <li className="pages_list_title">用户</li>
               <div className="pages_list_user">
                  {this.state.userData.length > 0 ? this.state.userData.map((data,i)=>{
                    return <li onClick={this.selectName.bind(this,data,i)} className={this.state.index == i ? 'pages_list_user_li' : 'pages_list_user_l'} key={i}>
                          {data.name}
                    </li>
                  }) : null}
               </div>
               <div className="pages_list_pagination">
                  <Pagination size="small" total={Number(this.state.totalData)} defaultPageSize={20}  onChange={this.onChange} simple={true} />
               </div>
             </div>
             <div className="pages_list_icon">
               <Icon type="double-right" />
             </div>
             <div className="pages_list">
                 <li className="pages_list_title">角色</li>
                 <div className="pages_list_js">
                    <Checkbox.Group value={this.state.roleIds} onChange={this.onChangeGroup.bind(this)}>
                      {this.state.listData ? this.state.listData.map((data,i)=>{
                        return <li key={i}><Checkbox style={{width:'100%'}} value={data.id}>{data.name}</Checkbox></li>
                      }) : null}
                    </Checkbox.Group>
                 </div>
             </div>
             <div className="pages_list_icon">
               <Icon type="double-right" />
             </div>
             <div className="pages_list">
                <li className="pages_list_title">功能权限</li>
                <div className="pages_list_qx">
                  <Checkbox.Group value={this.state.permissionIds} onChange={this.onChangePermission.bind(this)}>
                    <Collapse accordion bordered={false}>
                      {this.state.data.length > 0 ? this.state.data.map((infos,i)=>{
                        return <Panel header={infos.name} key={i} style={customPanelStyle}>
                                  <div>
                                    <Collapse accordion bordered={false}>
                                      {infos.modules ? infos.modules.map((ins,x)=>{
                                        return  <Panel header={ins.name} key={x} style={customPanelStyle}>

                                                    {ins.modules.map((info,j)=>{
                                                      return <div style={{padding:'5px 0 5px 25px'}} key={j}><li>{info.name}</li>
                                                       <div style={{marginTop:10}}>{info.permissions.length > 0 ? info.permissions.map((permissions,x)=>{
                                                         return <Checkbox onClick={this.selectP.bind(this,permissions)} style={{marginLeft:0}} value={permissions.id} key={x}>{permissions.name}</Checkbox>
                                                       }) : null}</div>
                                                     </div>
                                                    })}

                                                </Panel>
                                      }) : null}
                                    </Collapse>
                                  </div>
                               </Panel>
                      }) : null}

                    </Collapse>
                  </Checkbox.Group>
                </div>
             </div>
             <div className="pages_list_icon">
               <Icon type="double-right" />
             </div>
             <div className="pages_list">
                <li className="pages_list_title">字段限制</li>
                <div className="pages_list_js">
                   <Checkbox.Group value={this.state.limitFieldList} onChange={this.onChangeField.bind(this)}>
                     {this.state.fieldData.length > 0 ? this.state.fieldData.map((data,i)=>{
                       return <li key={i}><Checkbox style={{width:'100%'}} value={data.id}>{data.fieldName}</Checkbox></li>
                     }) : <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:300}}>暂无数据</div>}
                   </Checkbox.Group>
                </div>
                <Button onClick={this.save.bind(this)} style={{position:'absolute',top:10,right:10}} type="primary">保存</Button>
             </div>
          </div>
          </Spin>
       </div>
    );
  }
}
