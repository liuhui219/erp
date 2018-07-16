import React, { Component } from 'react';
import { Menu, Icon, Layout, Badge, Dropdown,Tag,Avatar,Tooltip,Input,message,Tabs} from 'antd';
import avater from '../style/imgs/b1.jpg';
import { withRouter,Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import globals from './unit';
import groupBy from 'lodash/groupBy';
import { menus } from '../constants/menus';
const { Header } = Layout;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
var flag = true;
class HeaderCustom extends Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    const panes = [
      { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
      { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
      { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false },
    ];
    this.state = {
        user: '',
        visible: false,
        topData:[],
        firstPage:'',
        name:'',
        activeKey: '0',
        panes,
    };

  }
    componentDidMount() {
        this.setState({
          name:globals.getCookies('data') ? JSON.parse(decodeURIComponent(globals.getCookies('data'))).name : ''
        })
         if(menus[0].sub){
           this.setState({
             firstPage:menus[0].sub[0].key
           })
         }else{
           this.setState({
             firstPage:menus[0].key
           })
         }



    };

    componentWillReceiveProps(nextProps) {
      if(nextProps.headerList != ''){
        var arrs = nextProps.topData;
        nextProps.topData.map((data,i)=>{
          if(data.key == nextProps.headerList.key){
            arrs.splice(i,1);
          }
          this.setState({
            topData:arrs
          })
          this.props.dispatch({ type: 'header' ,text:''});
        })
      }else{
        this.setState({
          topData:nextProps.topData
        })
      }

      if(nextProps.todolist != ''){
        var arr = nextProps.topData;
        var all = [];
        nextProps.topData.map((data,i)=>{
          if(data.key){
            all.push(data.key);
          }else{
            all.push(data.menuKey);
          }

        })
        if(!all.includes(nextProps.todolist.key)){
          arr.push(nextProps.todolist);
          this.props.menus.push(nextProps.todolist);

          this.setState({
            topData:arr
          })
        }else{
          nextProps.topData.map((data,i)=>{
            if(data.key == nextProps.todolist.key){
              data.name = nextProps.todolist.name;
              data.menuKey = nextProps.todolist.menuKey;
            }
          })
          this.setState({
            topData:arr
          })
        }
        this.props.dispatch({ type: 'INCREMENT' ,text:''});
      }else{
        this.setState({
          topData:nextProps.topData
        })
      }

      if(flag){
        this.props.topData.map((data,i)=>{
          if(window.location.hash.slice(1).indexOf('/erp/'+data.menuKey) !== -1){
            this.setState({
              activeKey:String(i+1)
            })
          }
        })
      }

      setTimeout(()=>{
        return flag = true;
      })
    }

    menuClick = e => {
        e.key === 'logout' && this.logout();
    };
    logout = () => {
        globals.setCookies('data','',-1)
        globals.setCookies('isLogin','',-1)
        var that = this;
        fetch(globals.url.url+'/common/index/logout', {
          method: 'GET',
          credentials: 'include'
        }).then(function(response) {
          return response.json();
        }).then(function(result) {
          if(result.code == 0){
          }else if(result.code == 100500){

          }else{
            message.warning(result.message);
          }
        }).catch((error) => {
          message.warning('加载失败，请刷新重试');
        });
        this.props.history.push('/login')
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };

    close(index,data,e){
      this.props.topData.splice(index,1)
      if(window.location.hash.slice(1).indexOf('/erp/'+data.menuKey) !== -1 && this.props.topData.length !== 0){
        var str = '/erp/'+this.props.topData[this.props.topData.length-1].menuKey
        this.props.history.push(str);
      }
      if(this.props.topData.length === 0){
        this.props.history.push('/');
      }
      this.setState({
        topData:this.props.topData
      })

      e.preventDefault();
    }
    closeAll(){
      this.props.topData.length = 0;
      this.props.history.push('/');
      this.setState({
        topData:[]
      })
    }

    closeOther(){
      var arrs = [];
      if(this.props.topData.length > 0){

        var str = window.location.hash.slice(1);
        this.props.menus.map((data,i)=>{
           var strs = '/erp/'+data.menuKey;
           if(str.indexOf(strs) !== -1){
             this.props.topData.length = 0;
             this.props.topData.push(data);
           }
        })
        this.setState({
          topData:this.props.topData,
          activeKey:String(this.props.topData.length)
        })
      }

    }


  onChange = (activeKey) => {
    console.log(activeKey)
    this.setState({ activeKey:activeKey });
    if(activeKey == 0){
      this.props.history.push(this.state.firstPage);
      this.setState({ activeKey:'0' });
    }
    this.state.topData.map((data,i)=>{
      if(activeKey == i+1){
        var url = '/erp/'+data.menuKey;
        this.props.history.push(url);
        this.setState({ activeKey:activeKey });
      }
    })
    return flag = false;
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  add = () => {
  }
  remove = (targetKey) => {
    this.props.topData.splice(targetKey-1,1);
    if(this.props.topData.length === 0){
      this.props.history.push('/');
    }
    if(this.state.activeKey == targetKey && this.props.topData.length != 0){
      var str = '/erp/'+this.props.topData[this.props.topData.length-1].menuKey
      this.props.history.push(str);
      this.setState({
        activeKey:String(this.props.topData.length)
      })
    }
    if(targetKey < this.state.activeKey){
      this.setState({
        activeKey:String(Number(this.state.activeKey)-1)
      })
    }
    this.setState({
      topData:this.props.topData
    })
    // this.state.topData.map((data,i)=>{
    //   if(targetKey == i+1){
    //      this.props.topData.splice(i,1)
    //      if(window.location.hash.slice(1).indexOf('/erp/'+data.menuKey) !== -1 && this.props.topData.length !== 0){
    //        var str = '/erp/'+this.props.topData[this.props.topData.length-1].menuKey
    //        this.props.history.push(str);
    //        this.setState({
    //          activeKey:String(this.props.topData.length)
    //        })
    //      }
    //
    //      if(this.props.topData.length === 0){
    //        this.props.history.push('/');
    //      }
    //      this.setState({
    //        topData:this.props.topData
    //      })
    //   }
    // })
  }


    render() {
      const menu = (
              <Menu className="meuns_a">
                <Menu.Item onClick={this.closeAll.bind(this)} key="setting:5">关闭全部选项卡</Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={this.closeOther.bind(this)} key="setting:6">关闭其他选项卡</Menu.Item>
              </Menu>
              );
      const menus = (
              <Menu className="meuns_a">
                    <Menu.Item key="setting:1">你好 </Menu.Item>
                    <Menu.Item key="setting:2"><Icon type="user" />个人信息</Menu.Item>
                    <Menu.Item key="logout"><Icon type="user" /><span onClick={this.logout}>退出登录</span></Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="setting:3"><Icon type="setting" />个人设置</Menu.Item>
                    <Menu.Item key="setting:4"><Icon type="setting" />系统设置</Menu.Item>
              </Menu>
              );
        return (
          <div>
            <Header style={{ background: '#fff', padding: 0, height: 65,display: 'flex', }} className="custom-theme" >
                <Icon
                    className="trigger custom-trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />

              <div className="header_right" style={{ lineHeight: '64px', position:'relative',zIndex:999,border:'none',}}>
                <Search
                  placeholder="请输入内容"
                  onSearch={value => console.log(value)}
                  style={{ width: 200,height: 32,margin: '0 15px' }}
                />
              <div className='header_badge'>
                  <Badge count={99} >
                     <Icon type="bell" style={{padding:4,fontSize:16}}/>
                  </Badge>
                </div>
                <Dropdown  overlay={menus} >
                  <span className='drop_info drop_h' style={{padding:'0 32px'}}>
                    <Avatar size="small"  src={avater} />
                    <span style={{marginLeft:10}}>
                      {this.state.name}
                    </span>
                  </span>
                </Dropdown>
              </div>

                <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
            </Header>
            <div className="headers">
                <div className='card-container'>

                    <Tabs
                      onChange={this.onChange}
                      type="editable-card"
                      activeKey={this.state.activeKey}
                      hideAdd="true"
                      onEdit={this.onEdit}
                    >
                      <TabPane tab='首页' closable={false}></TabPane>
                      {this.state.topData.map((data,i)=>{
                            return <TabPane tab={data.name} key={i+1} closable={true}></TabPane>
                       })}



                    </Tabs>
                 </div>
                 <div className="header_c">
                    <Dropdown overlay={menu}>
                      <a className="drop_info" href="javascript:">
                        关闭操作 <Icon type="down" style={{marginTop:3}}/>
                      </a>
                    </Dropdown>
                 </div>
             </div>
          </div>
        )
    }
}


const mapStateToProps = (state) => {
    return { todolist: state.todolist,headerList:state.headerList };
};
export default withRouter(connect(mapStateToProps)(HeaderCustom));
