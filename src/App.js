import React, {Component} from 'react';
import { Layout,LocaleProvider  } from 'antd';
import Router from './routes';
import SubNav from './components/subNav';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './style/index.less';
import './App.css';
var flog = true;
var flogs = true;
const { Footer, Content } = Layout;
class App extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      topData:[],
      init:[],
      menuData:[],
      showMenu:'',
      subData:'',
      location:window.location.hash,
    };
  }

    componentDidMount(){

    }



    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    Select = e => {
      this.setState({
        topData:e,
      })
    }
    init  = e => {
      console.log('xxxx',e)
      this.setState({
        topData:[e],
        init:e
      })
    }
    menuData = e => {
      this.setState({
        menuData:e,
        location:window.location.hash,
      })
    }

    onShow = e => {
      if(e != ''){
        this.setState({
          showMenu:e,
          subData:e,
        })
        clearTimeout(this.t);
      }else{
        this.t=setTimeout(()=>{
          this.setState({
            showMenu:e
          })
        },300)
      }
    }

    onMouseEnter(e){
      if(e != ''){
        this.setState({
          showMenu:e
        })
       clearTimeout(this.t);
     }else{
       this.t=setTimeout(()=>{
         this.setState({
           showMenu:e
         })
       },300)
     }
    }

    // onShow = e => {
    //   setTimeout(()=>{
    //     if(e == ''){
    //         if(flog == true){
    //           setTimeout(()=>{
    //             this.setState({
    //               showMenu:e
    //             })
    //           },100)
    //           flogs = true;
    //         }
    //     }
    //   },10)
    //   if(e != ''){
    //     this.setState({
    //       showMenu:e,
    //       subData:e,
    //     })
    //     flogs = false;
    //   }
    // }

    // onMouseEnter(e){
    //   setTimeout(()=>{
    //     if(e == '' && flogs == true){
    //       setTimeout(()=>{
    //         this.setState({
    //           showMenu:e
    //         })
    //         },100)
    //     }
    //   },20)
    //   if(e != ''){
    //     this.setState({
    //       showMenu:e
    //     })
    //     return flog = false,flogs = true;
    //   }else{
    //     return flog = true;
    //   }
    // }



  render() {
    return (<LocaleProvider locale={zhCN}><Layout>
      <SiderCustom onShow={this.onShow} menuData={this.menuData} init={this.init} collapsed={this.state.collapsed}/>
      <Layout style={{
          flexDirection: 'column',
          position:'relative'
        }}>
        <HeaderCustom toggle={this.toggle} location={this.state.location} menus={this.state.menuData} topData={this.state.topData} collapsed={this.state.collapsed} />
        <Content style={{
            overflow: 'initial',
            backgroundColor:'#fff',
            height:'calc(100% - 105px)',
            overflowX: 'hidden',
            padding:10
          }}>
           <Router />
        </Content>
        {this.state.showMenu != '' ? <SubNav data={this.state.subData} topData={this.state.topData} onSelect={this.Select} onMouseEnter={this.onMouseEnter.bind(this)}/> : null}
      </Layout>
    </Layout></LocaleProvider>);
  }
}

export default App;
