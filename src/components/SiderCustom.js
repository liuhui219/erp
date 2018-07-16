import React, { Component } from 'react';
import { Menu, Icon, Layout, message, Modal} from 'antd';
import { withRouter,Link } from 'react-router-dom';
import { menus } from '../constants/menus';
import SiderMenu from './SiderMenu';
import globals from './unit';
const confirm = Modal.confirm;
const { Sider } = Layout;
var arr = [];
var firstPage = '';
var first = '';
class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: [],
        data:[],
        selectedKey: '',
        firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
    componentDidMount() {
        this.getData();
        this.setMenuOpen(this.props);
        arr = [];
        if(menus[0].sub){
          first = menus[0].sub[0].key;
          this.setState({
            firstPage:menus[0].sub[0].key
          })
        }else{
          first = menus[0].key;
          this.setState({
            firstPage:menus[0].key
          })
        }
        if(window.location.hash.indexOf(first) == -1){
          var str = window.location.hash.slice(1);
          menus.map((data,i)=>{
            if(data.sub){
              data.sub.map((info,j)=>{
                if((info.key === str)){
                  arr.push(info);
                }
              })
            }else{
              if(i !==0 && (data.key === str)){
                arr.push(data);
              }
            }
          })
        }
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }
    setMenuOpen = props => {
        const { pathname } = props.location;
        this.setState({
            selectedKey: pathname
        });
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
      console.log(v)
        this.setState({
            openKey: v,
            firstHide: false,
        })
    };

    onSelect = e => {
      console.log(e)

      menus.map((data,i)=>{
        if(i == 0){
          if(data.sub){
            data.sub.map((info,j)=>{
              if(j !== 0 && (info.key === e.key) && (!arr.includes(info))){
                arr.push(info);
              }
            })
          }else{

          }
        }else{
          if(data.sub){
            data.sub.map((info,j)=>{
              if(info.sub){
                info.sub.map((subInfo,y)=>{
                  if((subInfo.key === e.key) && (!arr.includes(subInfo))){
                    arr.push(subInfo);
                  }
                })
              }else{
                if((info.key === e.key) && (!arr.includes(info))){
                  arr.push(info);
                }
              }

            })
          }else{
            if((data.key === e.key) && (!arr.includes(data))){
              arr.push(data);
            }
          }
        }

      })
    }

    handleClick(e){

      this.setState({
          openKey: e.keyPath.slice(1)
      });
    }

    onMouseEnter(key){
      this.props.onShow(key);
    }

    onMouseOut(key){
      this.props.onShow('');
    }

    getData(){
      var that = this;
      fetch(globals.url.url+'/common/menu/list', {
        method: 'GET',
        credentials: 'include'
      }).then(function(response) {
        return response.json();
      }).then(function(result) {
        console.log(result)
        if(result.code == 0){
          that.setState({
            data:result.result
          })
          var arr = [];
          result.result.map((data,i)=>{
            if(data.items){
              data.items.map((info,j)=>{
                if(info.items){
                  info.items.map((infos,x)=>{
                    arr.push(infos)
                  })
                }
              })
            }
          })
         var str = window.location.hash.slice(1);
         arr.map((data,i)=>{
           var strs = '/erp/'+data.menuKey;
           if(strs == str){
             that.props.init(data)
           }
         })

         that.props.menuData(arr);
        }else if(result.code == 100500){
          confirm({
            title: result.message,
            okText:"确定",
            cancelText:"取消",
            content: '请重新登录',
            onOk() {
              that.props.history.push({pathname: '/login',});
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }else{
          message.warning(result.message);
        }
      }).catch((error) => {
        message.warning('加载失败，请刷新重试');

      });
    }




    render() {
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{ overflowY: 'auto' }}
            >
                <div className="logo" />
                  <Menu
                    theme="dark"
                    mode="vertical"
                    openKeys={this.state.firstHide ? null : this.state.openKey}
                    selectedKeys={[this.state.selectedKey]}
                    onOpenChange={this.openMenu}
                    onSelect={this.onSelect}
                    onClick={this.handleClick.bind(this)}
                    onClick={this.menuClick}
                  >
                    {this.state.data.map((info,i)=>{
                      return <Menu.Item
                                  key={i}
                                  onMouseEnter={this.onMouseEnter.bind(this,info)}
                                  onMouseOut={this.onMouseOut.bind(this,info)}
                              >
                                  <a style={{display:'flex',alignItems:'center'}} >
                                      {info.icon && <Icon type={info.icon} />}
                                      <span style={{display:'flex',justifyContent:'space-between',alignItems:'center',flex:1}} className="nav-text">{info.name}<Icon type="right" style={{fontSize:10,margin:0}} /></span>
                                  </a>
                              </Menu.Item>
                    })}
                </Menu>

                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default withRouter(SiderCustom);
