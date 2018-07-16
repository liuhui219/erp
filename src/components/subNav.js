/* @flow */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Icon, Input, Button, message, Spin  } from 'antd';
import globals from './unit';
var arr = [];
var arrs = [];
export default class subNav extends Component {
  constructor() {
    super();
    this.state={
      data:[],
    }
  }

  componentDidMount(){
   
  }



  onMouseEnter(){
    this.props.onMouseEnter('1');
  }

  onMouseLeave(){
    this.props.onMouseEnter('');
  }

  select(info){
    this.props.onMouseEnter('');
    var main = [];
    var mains = this.props.topData;
    this.props.topData.map((data,i)=>{
      main.push(data.menuKey);
    })
    var str = info.menuKey;
    if(!main.includes(str)){
      main.push(str);
      mains.push(info);
    }
    this.props.onSelect(mains);
  }


  render() {
    return (
      <div className="sub_menu" onMouseEnter={this.onMouseEnter.bind(this)} >
         <div className="sub_hr" onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
           {this.props.data.items ? this.props.data.items.map((info,i)=>{
             return <div key={i} className="sub_mains">
                <li className="sub_title">{info.name}</li>
                <div  className="sub_nav">
                {info.items && info.items.length > 0 ? info.items.map((infos,j)=>{
                  return <li key={j} onClick={this.select.bind(this,infos)}>
                             <Link to={'/erp/'+infos.menuKey}>
                               <span>{infos.name}</span>
                             </Link>
                          </li>

                }) : null}
                </div>
             </div>
           }) : null}
         </div>
      </div>
    );
  }
}
