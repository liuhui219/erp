/* @flow */

import React, { Component } from 'react';
import { Table, Icon, Divider, Button, Popconfirm, Tooltip, message, Pagination, Spin, Modal, Input } from 'antd';
import { connect } from 'react-redux';
import globals from '../../../unit';
const { TextArea } = Input;
class DepartureAudit extends Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      data: [],
      mainData: [],
      recordTotal: '',
      pageSize: 10,
      page: 1,
      spinning: true,
      tip: '加载中...',
      visible: false,
      input: '',
      dataId: '',
      allId: [],
    }
  }

  componentDidMount() {
    this.getData(1, this.state.pageSize)
  }


  getData(page, num) {
    var that = this;

    fetch(globals.url.url + '/sale/customer/list?pageNumber=' + page + '&pageSize=' + num, {
      method: 'GET',
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result)
      var arr = [];
      if (result.code == 0) {
        result.result.object.map((data, i) => {
          data['key'] = i + 1;
          data['index'] = that.state.data.length;
          arr.push(data)
        })
        that.setState({
          mainData: result.result.object,
          data: arr,
          spinning: false,
          recordTotal: result.result.recordTotal
        })
      } else {
        message.warning(result.message);
        that.setState({
          spinning: false,
        })
      }
    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning: false,
      })
    });
  }

  onShowSizeChange(current, pageSize) {
    this.setState({
      page: current,
      pageSize: pageSize
    })
    console.log(current, pageSize);
    this.getData(current, pageSize)
  }

  onChange = (page) => {
    console.log(page);
    this.setState({
      page: page,
    })
    this.getData(page, this.state.pageSize)

  }
  // 导出
  derive = () => {
    var that = this;
    var url = globals.url.url + '/sale/customer/excel?pageSize=' + that.state.pageSize + '&pageNumber=' + that.state.page;
    var a = document.createElement('a');
    a.href = url;
    a.download = "filename.xlsx";
    a.click();
  }
  // 客户档案详情
  StaffInfo(data) {
    this.props.history.push({ pathname: '/erp/ClientDetail/' + data.id });
    var obj = { name: '客户档案-' + data.name, menuKey: 'ClientDetail/' + data.id, key: 'ClientDetail' };
    this.props.dispatch({ type: 'INCREMENT', text: obj });
  }

  render() {
    const columns = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      filterDropdown: (
        <div className="custom-filter-dropdown">
        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record, i) => (
        <span>{i + 1}</span>
      )
    }, {
      title: '客户编码',
      dataIndex: 'number',
      key: 'number',
      width: 150,
    }, {
      title: '客户',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    }, {
      title: '客户简称',
      dataIndex: 'simpleName',
      key: 'simpleName',
      width: 100,
    }, {
      title: '客户类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text, record, i) => (
        <div>
          {record.type == 1 && '标准客户'}
          {record.type == 2 && '寄存客户'}
          {record.type == 3 && '个人客户'}
          
        </div>
      )
    }, {
      title: '客户级别',
      dataIndex: 'customerRankName',
      key: 'customerRankName',
      width: 100,
    }, {
      title: '业务区域',
      dataIndex: 'businessAreaName',
      key: 'businessAreaName',
      width: 100,
    }, {
      title: '业务员',
      dataIndex: 'salesmanName',
      key: 'salesmanName',
      width: 100,
    }, {
      title: '默认结算币种',
      dataIndex: 'currencyName',
      key: 'currencyName',
      width: 100,
    }, {
      title: '默认税率',
      dataIndex: 'taxRate',
      key: 'taxRate',
      width: 100,
    }, {
      width: 100,
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record, i) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

          <Tooltip title="查看详情">
            <span onClick={this.StaffInfo.bind(this, record)} className="account-table-title" style={{ cursor: 'pointer', marginLeft: 10, marginTop: 3, }}>
              <Icon type="eye" style={{ fontSize: 20, color: '#428ef2' }} />
            </span>
          </Tooltip>
        </div>
      )
    }];
    let width = 0;
    columns.map((item, index) => {
      width += item.width;
    })
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        var arr = [];
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selectedRows.map((data, i) => {
          arr.push(data.id);
        })
        this.setState({
          allId: arr,
        })
      },
      getCheckboxProps: record => ({
        index: record.key,
      }),
    };

    return (
      <div className="page_check">
        <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
          <div className="page_check_head">
            <Button type="primary" icon="save">
              打印
                 </Button>
            <Button type="primary" onClick={this.derive} icon="save">
              导出
                 </Button>
          </div>
          <div className="page_table">
            <Table rowSelection={rowSelection} scroll={{ x: width, y: 'calc(100% - 60px)' }} columns={columns} dataSource={this.state.data} bordered pagination={false} />
          </div>
          <div className="page_pagination">
            <Pagination showSizeChanger showQuickJumper pageSizeOptions={['10', '20', '50']} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={Number(this.state.recordTotal)} />
          </div>
        </Spin>

      </div>
    );
  }
}

export default connect()(DepartureAudit);
