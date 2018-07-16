import React from 'react';
import { Menu,message, Icon, Input, InputNumber, Modal, Table, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import './Table.less';

class TableModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
      allWidth: 0,
      visible: props.showHide

    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.setState({
      visible: nextProps.showHide
    });
  }
  componentDidMount() {
    // 初始化 显示隐藏
    let columns = this.state.columns;
    columns.map((item, index) => {
      item.checked = true
      item.width = 150
      if (index < 3 || (columns.length - 4) < index) {
        if (index == 0 || (columns.length - 1) == index) {
          item.lockCheck = true
        } else {
          item.lockCheck = false
        }
      } else {
        item.lockCheck = 'none'
      }
    })
    this.setState({
      columns: columns
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  // 模态框显示
  showModal() {
    this.setState({
      visible: true,
    });
  }
  // 点击模态框确认
  handleOk = (e) => {
    let columns = this.state.columns;
    columns.map((item, index) => {
      columns[index].fixed = false;
      if (!item.checked) {
        item.colSpan = 1;
        item.className = 'none';
      }else{
        delete item.colSpan;
        delete item.className;
      }
    })
    let upNumValue = document.getElementById("upNum").value;
    let dowpNumValue = document.getElementById("dowpNum").value;
    if (upNumValue > 0) {
      for (let i = 0; i < upNumValue; i++) {
        columns[i].fixed = true
      }
    }
    if (dowpNumValue > 0) {
      for (let i = 0; i < dowpNumValue; i++) {
        columns[columns.length - i - 1].fixed = 'right'
      }
    }
    this.setState({
      visible: false
    }, () => {
      // this.widthFn()
      this.props.callBack(columns)
    });

  }
  // 点击取消
  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  }
  up(index) {
    let upNumValue = document.getElementById("upNum").value;
    let dowpNumValue = document.getElementById("dowpNum").value;
    let columns = this.state.columns;
    // if(upNumValue > 0){
    if (index >= upNumValue && index < columns.length - dowpNumValue) {
      let a = columns[index]
      columns[index] = columns[index - 1]
      columns[index - 1] = a
      this.setState({
        columns: columns
      })
    } else {
      message.error('已冻结请解冻后操作!');
    }
  }
  down = (index) => {

    let upNumValue = document.getElementById("upNum").value;
    let dowpNumValue = document.getElementById("dowpNum").value;
    let columns = this.state.columns;
    // if(upNumValue > 0){
    if (index >= upNumValue && index < columns.length - dowpNumValue) {
      let data = columns[(index)]
      columns[index] = columns[(index + 1)]
      columns[(index + 1)] = data
      this.setState({
        columns: columns
      })
    } else {
      message.error('已冻结请解冻后操作!');
    }


   
  }
  // 显示隐藏表头
  showHide = (checked, index) => {
    let upNumValue = document.getElementById("upNum").value;
    let dowpNumValue = document.getElementById("dowpNum").value;
    let columns = this.state.columns;
    // if(upNumValue > 0){
    if (index >= upNumValue && index < columns.length - dowpNumValue) {
      columns[index].checked = checked;
      this.setState({
        columns: columns
      })
    } else {
      message.error('已冻结请解冻后操作!');
    }


  }
  // 列宽改变
  numberChange = (value, index) => {
    let columns = this.state.columns;
    columns[index].width = value;
    this.setState({
      columns: columns
    })
  }
  render() {
    var that = this;
    // 底部
    const changeTable = [{
      title: '列名',
      dataIndex: 'name',
      width: 100,
      render(text, record, index) {
        return (
          record.title
        );
      }
    }, {
      title: '移动',
      dataIndex: 'address',
      width: 100,

      render(text, record, index) {
        return (
          <div>
            {index != 0 && <Icon type="arrow-up" onClick={() => that.up(index)} />}
            {index == that.state.columns.length - 1 || <Icon type="arrow-down" onClick={() => that.down(index)} />}
          </div>
        );
      }
    }, {
      title: '列宽',
      dataIndex: 'width',
      width: 100,
      render(text, record, index) {
        return (
          <div>
            <InputNumber onChange={(value) => that.numberChange(value, index)} value={record.width} className="w100" />
            {/* <span className="pl5">px</span> */} 
          </div>
        )
      }
    }, {

      title: '显示/隐藏',
      dataIndex: 'showHide',
      width: 100,

      render(text, record, index) {
        return (
          <Switch checked={record.checked} onChange={(e) => that.showHide(e, index)} />
        )
      }
    }]
    return (
      <div>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p >
            <span>冻结前</span>
            <InputNumber id="upNum"  defaultValue="1" className="w100 ml5 mr5" min="0" max="3" />
            <span>列,</span>
            <span>冻结后</span>
            <InputNumber id="dowpNum"  defaultValue="1" className="w100 ml5 mr5" min="0" max="3" />
            <span>列,</span>
          </p>
          <Table columns={changeTable} scroll={{ y: 390 }} dataSource={this.state.columns} pagination={false} />
        </Modal>
      </div>


    );
  }
}
export default TableModel;
