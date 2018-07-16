import React from 'react';
import { Menu, Icon, Input, InputNumber ,Modal, Table, Button,Switch  } from 'antd';
import { Link } from 'react-router-dom';
import  './Table.less';
import TableModel from './TableModel';


// content
const columns = [{
  title: 'Name2131',
  dataIndex: 'name',
  key: '234234232342',
  width: 150,
  fixed: 'left'

}, {
  title: 'Age',
  dataIndex: 'age',
  key: '2',
  width: 150
}, {
  title: 'Address',
  dataIndex: 'address',
  key: '3',
  width: 150

}, {
  title: 'Address1',
  dataIndex: 'address1',
  key: '4',
  width: 150,

}, {
  title: 'Address2',
  dataIndex: 'address3',
  key: '4213213',
  width: 150,

}, {
  title: 'Address5',
  dataIndex: 'address5',
  key: '5',
  width: 150,

}, {
  title: 'Address6',
  dataIndex: 'address6',
  key: '6',
  width: 150,

}, {
  title: 'Address7',
  dataIndex: 'address7',
  key: '8',
  width: 150,

}, {
  title: 'Address9',
  dataIndex: 'address9',
  key: '9',
  width: 150,

}, {
  title: 'Address10',
  dataIndex: 'address10',
  key: '10',
  width: 150,

}, {
  title: 'Address11',
  dataIndex: 'address11',
  key: '11',
  width: 150,
  fixed: 'right'
}];


const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `Lo. ${i}`,
    address1: `Lo. ${i}`,
    address3: `Lo. ${i}`,
    address5: `Lo. ${i}`,
    address6: `Lo. ${i}`,
    address7: `Lo. ${i}`,
    address8: `Lo. ${i}`,
    address9: `Lo. ${i}`,
    address10: `Lo. ${i}`,
    address11: `Lo. ${i}`,
  });
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      cloneColumns: JSON.stringify(columns),
      showHide:false,
      allWidth:0
    };
  }
  componentDidMount(){
    this.widthFn()
  }
   // 计算总宽度
  widthFn(){
    var width = 0;
    var cloneColumns = JSON.parse(this.state.cloneColumns)
    cloneColumns.map((item,index) =>{
      width += item.width;
    })
    this.setState({
      allWidth:width
    })
  }
  callBack(data){
      console.log(data)
      this.setState({
        cloneColumns:JSON.stringify(data),
        showHide:false
      },() => {
        this.widthFn()
    })
  }
  render() {
    var that = this;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: that.onSelectChange,
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: 'Select All Data',
        onSelect: () => {
            that.setState({
                showHide:true
            })
        },
      }],
      onSelection: this.onSelection,
    };
    return (
      <div>
        <TableModel columns={columns}  showHide={this.state.showHide} callBack={this.callBack.bind(this)} />
        <Table rowSelection={rowSelection} scroll={{x:this.state.allWidth}} columns={JSON.parse(this.state.cloneColumns)} dataSource={data} />
        </div>
    
      
    );
  }
}
export default Account;
