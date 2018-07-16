/* @flow */

import React, { Component } from 'react';
import {Icon, Input, Button, Checkbox, message, Spin, Modal, Tabs, Collapse,Popconfirm} from 'antd';
import globals from '../../unit';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel;
export default class roleManager extends Component {
  constructor() {
    super();
    this.state={
       listData:[],
       visible:false,
       spinning:true,
       visible1:false,
       input:'',
       input1:'',
       parents:[],
       allPermission:[],
       modules:[],
       index:0,
       permissionJson:[],
       permissionJsons:[],
       data:{},
       data1:{},
    }
  }

  componentDidMount(){
    this.getData(0);
    this.getParents()

  }

  getParents(){
    var that = this;
    fetch(globals.url.url+'/common/permissionModules/topList', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log('2222222',result)
      if(result.code == 0){
          that.setState({
            parents:result.result,
            spinning:false,
          })
          that.callback(result.result[0].id);
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

  getData(index){
    var that = this;
    fetch(globals.url.url+'/sys/role/list', {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log('2222222',result)

      if(result.code == 0){
          that.setState({
            listData:result.result,
            permissionJson:result.result[index].permissionJson,
            data:result.result[index],
            index:index,
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

  add(){
    this.setState({
      visible:true
    })
  }

  handleCancel = () => {
    this.setState({
      visible:false,
      visible1:false
    })
  }

  handleOk = () => {
    if(this.Trims(this.state.input).length == 0){
      message.warning('角色名不能为空');
    }else{
      this.setState({
        visible:false,
        spinning:true
      })
      var that = this;
      fetch(globals.url.url+'/sys/role/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": that.state.input,
          "permissionJson":[]
        })
      }).then(function(response) {
        return response.json();
      }).then(function(result) {
        console.log(result)
        if(result.code == 0){
           that.getData(that.state.index);
           that.setState({
             spinning:false
           })

        }else{
          message.warning(result.message);
        }
      }).catch((error) => {
        message.warning('加载失败，请刷新重试');
        that.setState({
          spinning:false
        })
      });
    }
  }

  handleOk1 = () => {
    if(this.Trims(this.state.input1).length == 0){
      message.warning('角色名不能为空');
    }else{
      this.setState({
        visible:false,
        spinning:true
      })
      var that = this;
      fetch(globals.url.url+'/sys/role/update', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "id":that.state.data1.id,
          "name": that.state.input1,
          "permissionJson":that.state.data1.permissionJson
        })
      }).then(function(response) {
        return response.json();
      }).then(function(result) {
        console.log(result)
        if(result.code == 0){

           that.setState({
             spinning:false,
             visible1:false
           })
           that.getData(that.state.index);
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

  Trims(x) {
     return x.replace(/\s/g,"");
   }

  onChange(e){
    this.setState({
      input:e.target.value,
    })
  }

  onChange1(e){
    this.setState({
      input1:e.target.value,
    })
  }

  callback = (key) => {
    var that = this;
    fetch(globals.url.url+'/common/permissionModules/list?parentId='+key, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log('3333',result)

      if(result.code == 0){
        var arr = [];
        var arrs = [];
        var obj = {};
        var objs = {};
        result.result.modules.map((infos,j)=>{
          infos.modules.map((modul,x)=>{
            modul.permissions && modul.permissions.map((permissions,y)=>{
              arr.push(permissions)
            })
          })
        })
        arr.map((info,i)=>{
          if(!obj.hasOwnProperty(info.permissionKey)){
            obj[info.permissionKey] = [];
            obj[info.permissionKey].push(info.permissionKey)
          }else{
            obj[info.permissionKey].push(info.permissionKey)
          }
        })

        that.state.permissionJson.map((info,i)=>{
          arr.map((infos,j)=>{
            if(info == infos.id){
              if(!objs.hasOwnProperty(infos.permissionKey)){
                objs[infos.permissionKey] = [];
                objs[infos.permissionKey].push(infos.permissionKey)
              }else{
                objs[infos.permissionKey].push(infos.permissionKey)
              }
            }
          })
        })

        for(var i in objs){
          if(objs[i].length == obj[i].length){
            arrs.push(i)
          }
        }
          that.setState({
            allPermission:result.result.allPermission,
            modules:result.result.modules,
            permissionJsons:arrs
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

  onChangeCheckbox(e){
    console.log(e.target.checked)
  }

  onChanges(checkedValues){
    console.log('checked = ', checkedValues);
    var arr = [];
    var arrs = [];
    var obj = {};
    var objs = {};
    this.state.modules.map((infos,j)=>{
      infos.modules.map((modul,x)=>{
        modul.permissions && modul.permissions.map((permissions,y)=>{
          arr.push(permissions)
        })
      })
    })
    arr.map((info,i)=>{
      if(!obj.hasOwnProperty(info.permissionKey)){
        obj[info.permissionKey] = [];
        obj[info.permissionKey].push(info.permissionKey)
      }else{
        obj[info.permissionKey].push(info.permissionKey)
      }
    })

    checkedValues.map((info,i)=>{
      arr.map((infos,j)=>{
        if(info == infos.id){
          if(!objs.hasOwnProperty(infos.permissionKey)){
            objs[infos.permissionKey] = [];
            objs[infos.permissionKey].push(infos.permissionKey)
          }else{
            objs[infos.permissionKey].push(infos.permissionKey)
          }
        }
      })
    })

    for(var i in objs){
      if(objs[i].length == obj[i].length){
        arrs.push(i)
      }
    }

    this.setState({
      permissionJson:checkedValues,
      permissionJsons:arrs
    })
  }

  delete(data){
    var that = this;
    this.setState({
      spinning:true
    })
    fetch(globals.url.url+'/sys/role/delete?id='+data.id, {
      method: 'GET',
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log('3333',result)

      if(result.code == 0){
          message.success('删除成功');
          that.getData(that.state.index);
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

  selectName(data,index){

    var arr = [];
    var arrs = [];
    var obj = {};
    var objs = {};
    this.state.modules.map((infos,j)=>{
      infos.modules.map((modul,x)=>{
        modul.permissions && modul.permissions.map((permissions,y)=>{
          arr.push(permissions)
        })
      })
    })
    arr.map((info,i)=>{
      if(!obj.hasOwnProperty(info.permissionKey)){
        obj[info.permissionKey] = [];
        obj[info.permissionKey].push(info.permissionKey)
      }else{
        obj[info.permissionKey].push(info.permissionKey)
      }
    })

    data.permissionJson.map((info,i)=>{
      arr.map((infos,j)=>{
        if(info == infos.id){
          if(!objs.hasOwnProperty(infos.permissionKey)){
            objs[infos.permissionKey] = [];
            objs[infos.permissionKey].push(infos.permissionKey)
          }else{
            objs[infos.permissionKey].push(infos.permissionKey)
          }
        }
      })
    })

    for(var i in objs){
      if(objs[i].length == obj[i].length){
        arrs.push(i)
      }
    }

    this.setState({
      index:index,
      data:data,
      permissionJson:data.permissionJson,
      permissionJsons:arrs
    })
    console.log(index)
  }

  save(){
    var that = this;
    this.setState({
      spinning:true
    })
    fetch(globals.url.url+'/sys/role/update', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id":that.state.data.id,
        "name": that.state.data.name,
        "permissionJson":that.state.permissionJson
      })
    }).then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result)
      if(result.code == 0){

         that.setState({
           spinning:false
         })
         that.getData(that.state.index);
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

  edit(data){
    this.setState({
      data1:data,
      input1:data.name,
      visible1:true
    })
  }

  onChanges1(value){
    var permissionJson = this.state.permissionJson;
    var permissionJsons = this.state.permissionJsons
    var arr = [];
    this.state.modules.map((infos,j)=>{
      infos.modules.map((modul,x)=>{
        modul.permissions && modul.permissions.map((permissions,y)=>{
          arr.push(permissions)
        })
      })
    })

   if(value.length < permissionJsons.length){
     var arrs = [];
     permissionJsons.map((info,i)=>{
       if(!value.includes(info)){
         arr.map((data,x)=>{
           if(data.permissionKey == info){
             arrs.push(data.id);
           }
         })
       }
     })

     arrs.map((info,i)=>{
       permissionJson.map((data,j)=>{
         if(info == data){
           permissionJson.splice(j,1);
           this.setState({
             permissionJson:permissionJson,
           })
         }
       })
     })
   }else{
     value.map((data,i)=>{
       arr.map((info,j)=>{
         if(info.permissionKey == data){
           if(!permissionJson.includes(info.id)){
             permissionJson.push(info.id)
             this.setState({
               permissionJson:permissionJson,
               permissionJsons:value
             })
           }
         }
       })
     })
   }



    this.setState({
      permissionJsons:value
    })


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
         <div className="page_all">
           <div className="page_left">
              <div className="page_left_title">
                 <li>角色</li>
                 <li><Button type="primary" shape="circle" icon="plus" onClick={this.add.bind(this)} style={{cursor:'pointer'}}/></li>
              </div>
              <div className="page_left_list">
                {this.state.listData.length > 0 ? this.state.listData.map((data,i)=>{
                  return <div key={i} className={this.state.index == i ? 'page_left_list_liMain' : 'page_left_list_li'} style={{padding:'0 20px'}}>
                           <li style={{cursor:'pointer'}} onClick={this.selectName.bind(this,data,i)}>{data.name}</li>
                           <li>
                             <span onClick={this.edit.bind(this,data)} style={{cursor:'pointer'}}><Icon type="edit" /></span>
                               <span style={{cursor:'pointer',paddingLeft:10}}>
                                 <Popconfirm title="确定要删除此角色?" onConfirm={this.delete.bind(this,data)}  okText="是" cancelText="否">
                                  <Icon type="close" />
                                </Popconfirm>
                              </span>
                            </li>
                         </div>
                }) : null}
              </div>
           </div>
           <div className="page_right">
             <div className="page_right_tabs">
               <Tabs tabBarStyle={{border:'none'}} onChange={this.callback}>
                 {this.state.parents.map((data,i)=>{
                   return <TabPane tab={data.name} key={data.id}>
                             <Checkbox.Group onChange={this.onChanges1.bind(this)} value={this.state.permissionJsons}>
                               <div style={{marginLeft:30}}>
                                 {this.state.allPermission.length > 0 ? this.state.allPermission.map((data,i)=>{
                                   return <Checkbox style={{marginLeft:0,marginBottom:10}}  value={data.permissionKey} key={i}>{data.name}</Checkbox>
                                 }) : null}
                               </div>
                             </Checkbox.Group>
                             <Checkbox.Group onChange={this.onChanges.bind(this)} value={this.state.permissionJson}>
                               <div className="page_right_collapse">
                                 <Collapse bordered={false} defaultActiveKey={['0']} accordion>
                                    {this.state.modules.length > 0 ? this.state.modules.map((data,i)=>{
                                      return <Panel header={data.name} key={i} style={customPanelStyle}>
                                                {data.modules.map((info,j)=>{
                                                  return <div key={j}><li style={{marginLeft:15}}>{info.name}</li>
                                                   <div style={{margin:'15px 15px 15px 18px'}}>{info.permissions.length > 0 ? info.permissions.map((infos,x)=>{
                                                     return <Checkbox  onChange={this.onChangeCheckbox.bind(this)} value={infos.id} key={x}>{infos.name}</Checkbox>
                                                   }) : null}</div>
                                                 </div>
                                                })}
                                             </Panel>
                                    }) : null}
                                  </Collapse>
                               </div>
                             </Checkbox.Group>
                          </TabPane>
                 })}
               </Tabs>
             </div>
             <Button onClick={this.save.bind(this)} style={{position:'absolute',top:15,right:15}} type="primary">保存</Button>
           </div>
         </div>
         </Spin>
         <Modal
            title='新增角色'
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
          >
            <div style={{display:'flex',}}>
               <Input value={this.state.input} onChange={this.onChange.bind(this)} placeholder="请输入角色名" />
            </div>
        </Modal>
        <Modal
           title='修改角色名'
           visible={this.state.visible1}
           onOk={this.handleOk1}
           onCancel={this.handleCancel}
           okText="确定"
           cancelText="取消"
         >
           <div style={{display:'flex',}}>
              <Input value={this.state.input1} onChange={this.onChange1.bind(this)} placeholder="请输入角色名" />
           </div>
       </Modal>
      </div>
    );
  }
}
