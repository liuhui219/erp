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
    this.getData(1, 20)
  }


  getData(page, num) {
    var that = this;

    fetch(globals.url.url + '/hr/employee/dimissionPageList?pageNumber=' + page + '&pageSize=' + num, {
      method: 'GET',
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      console.log(result)
      var arr = [];
      if (result.code == 0) {
        result.result.object.map((data, i) => {

          switch (data.dimissionType) {
            case 1:
              data.dimissionType = '离职'
              break;
            case 2:
              data.dimissionType = '合同到期'
              break;
            case 3:
              data.dimissionType = '试用期不及格'
              break;
            case 4:
              data.dimissionType = '自动离职'
              break;
            case 5:
              data.dimissionType = '急辞'
              break;
            case 6:
              data.dimissionType = '开除'
              break;
            case 7:
              data.dimissionType = '其他'
              break;
          }
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
    var url = globals.url.url + '/hr/dimission/excel?pageSize=' + that.state.pageSize + '&pageNumber=' + that.state.page;
    var a = document.createElement('a');
    a.href = url;
    a.download = "filename.xlsx";
    a.click();
  }
  // 离职档案详情
  StaffInfo(data) {
    this.props.history.push({ pathname: '/erp/DimissionFile/' + data.id });
    var obj = { name: '离职档案-' + data.name, menuKey: 'DimissionFile/' + data.id, key: 'DimissionFile' };
    this.props.dispatch({ type: 'INCREMENT', text: obj });
  }
  // 复职
  resume = (obj) => {
    this.props.history.push({ pathname: '/erp/resume/' + obj.id });
    var memu = { name: '员工复职-', menuKey: 'resume/' + obj.id, key: '/erp/resume' };
    this.props.dispatch({ type: 'INCREMENT', text: memu });
  }

  render() {
    const columns = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      filterDropdown: (
        <div className="custom-filter-dropdown">
        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record, i) => (
        <span>{i + 1}</span>
      )
    }, {
      title: '工号',
      dataIndex: 'number',
      fixed: 'left',
      key: 'number',
      width: 100,
    }, {
      title: '姓名',
      fixed: 'left',
      dataIndex: 'name',
      key: 'name',
      width: 80,
    }, {
      title: '员工类型',
      dataIndex: 'employeeTypeName',
      key: 'employeeTypeName',
      width: 100,
    }, {
      title: '国籍',
      dataIndex: 'nationTypeName',
      key: 'nationTypeName',
      width: 100,
    }, {
      title: '民族',
      dataIndex: 'ethnicTypeName',
      key: 'ethnicTypeName',
      width: 100,
    }, {
      title: '籍贯',
      dataIndex: 'nativePlace',
      key: 'nativePlace',
      width: 100,
    }, {
      title: '家庭地址',
      dataIndex: 'address',
      key: 'address',
      width: 100,
    }, {
      title: '证件类型',
      dataIndex: 'papersTypeName',
      key: 'papersTypeName',
      width: 100,
    }, {
      title: '证件号码',
      dataIndex: 'papersNumber',
      key: 'papersNumber',
      width: 100,
    }, {
      title: '出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
      width: 100,
    }, {
      title: '最高学历',
      dataIndex: 'educationName',
      key: 'educationName',
      width: 100,
    }, {
      title: '学校',
      dataIndex: 'school',
      key: 'school',
      width: 100,
    }, {
      title: '专业',
      dataIndex: 'professional',
      key: 'professional',
      width: 100,
    }, {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 100,
    }, {
      title: '邮箱地址',
      dataIndex: 'email',
      key: 'email',
      width: 100,
    }, {
      title: '微信号',
      dataIndex: 'wechat',
      key: 'wechat',
      width: 100,
    }, {
      title: '入职日期',
      dataIndex: 'hiredate',
      key: 'hiredate',
      width: 100,
    }, {
      title: '入职部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 100,
    }, {
      title: '入职岗位',
      dataIndex: 'postionName',
      key: 'postionName',
      width: 100,
    }, {
      title: '离职日期',
      dataIndex: 'expectDimissionTime',
      key: 'expectDimissionTime',
      width: 130,
    }, {
      title: '离职类型',
      dataIndex: 'dimissionType',
      key: 'dimissionType',
      width: 100,
    }, {
      title: '离职原因',
      dataIndex: 'dimissionReason',
      key: 'dimissionReason',
      width: 140,
    }, {
      width: 100,
      title: '操作',
      fixed: 'right',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record, i) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Tooltip title="复职">
            <span onClick={this.resume.bind(this, record)} className="account-table-title" style={{ cursor: 'pointer', marginLeft: 10, marginTop: 3, }}>

              <Icon type="folder-open" style={{ fontSize: 18, color: '#428ef2' }} />
            </span>
          </Tooltip>

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
