/* @flow */

import React, { Component } from 'react';

import {Icon, Input,Select} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const Option = Select.Option;

 class selectName extends Component {
 constructor() {
   super();
   this.state={
      isEmergencyContact:'否',
      checkNick: false,
   }
 }

 componentDidMount(){

 }

 handleChange = (e) => {

  }

  render() {
    const data = this.props.data;
    const text = this.props.text;
    const value = JSON.parse(this.props.value);
    console.log(value)
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    // console.log(value)
    const options = data.map((d)=>{
        return(
        <Option key={d.id} value={d.id}>{d[text]}</Option>
        )
    })
    return (
        <Select
        // showSearch
        value={value}
        placeholder="请选择业务区域"
        optionFilterProp="children"
        >
           {options}
        </Select>
    );
  }
}

export default selectName;
