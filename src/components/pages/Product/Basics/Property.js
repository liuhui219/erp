import React from 'react';
import { Menu, Icon, Dropdown, Spin, Badge, Popconfirm, Tooltip, Pagination, Input, message, InputNumber, Modal, Table, Button, Switch } from 'antd';

import { Link } from 'react-router-dom';
import 'src/style/pages.less';
import globals from 'src/components/unit';
import CollectionCreateForm from 'src/components/Component/ModelType/ClassifyModelType';


class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      DataType: {},
      visible: false,
      visiblePost: false,
      ModalData: [],
      getTree: '',
      ModalTitle: '属性类别',
    };
  }
  componentDidMount() {
    this.list();

  }
  list() {
    let that = this;
    let data = that.state.data;
    // 请求列表数据
    fetch(globals.url.url + '/product/proSkuCategory/list', {
      method: 'get',
      credentials: 'include',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (res.code == 0) {
          console.log(res)
          for (let i = 0; i < res.result.length; ++i) {
            res.result[i].key = i;
            if (res.result[i].perent == 0) {
              res.result[i].perentName = '全部'
            }
            for (let j = 0; j < res.result[i].proSkuValueList.length; ++j) {
              res.result[i].proSkuValueList[j].key = j;
            }
          }
          that.setState({
            data: res.result
          })
        } else {
          message.success('保存失败！');
        }
      })
      .catch((error) => {
        message.warning('加载失败，请刷新重试');
      });

  }



  // 编辑表单
  edit = (record) => {
    let ModalData = this.state.ModalData;
    let DataType = this.state.DataType;
    var staffData = [{
      name: '类别名称',
      massage: '请填写类别名称',
      key: 'categoryName',
      tag: 'input',
      value: record.categoryName,
      must: true
    }, {
      name: '描述',
      key: 'remarks',
      value: record.remarks,
      tag: 'input',
      must: false
    }]
    DataType.id = record.id
    DataType.typeName = 1;
    DataType.type = "edit";
    this.setState({
      ModalTitle: '修改类别属性',
      ModalData: staffData,
      DataType: DataType
    })
    this.showModal();
  }
  //属性值修改
  editChild = (record) => {
    let ModalData = this.state.ModalData;
    let DataType = this.state.DataType;
    var staffData = [{
      name: '属性值',
      massage: '请填写属性值',
      key: 'skuValue',
      tag: 'input',
      value: record.skuValue,
      must: true
    }, {
      name: '描述',
      key: 'remarks',
      value: record.remarks,
      tag: 'input',
      must: false
    }, {
      name: 'skuCategoryId',
      key: 'skuCategoryId',
      value: record.skuCategoryId,
      tag: 'input',
      showHide: 0,
      must: false
    }]
    DataType.id = record.id
    DataType.typeName = 2;
    DataType.type = "edit";
    this.setState({
      ModalTitle: '修改类别属性',
      ModalData: staffData,
      DataType: DataType
    })
    this.showModal();
  }

  // 删除表单
  delete = (id, type) => {

    if (type == 'position') {
      this.save('', '/hr/position/delete?id=' + id)
    } else {
      this.save('', '/hr/department/delete?id=' + id)
    }
  }
  expandedRowRender = (e) => {
    const columns = [
      { title: '属性值', dataIndex: 'skuValue', key: 'skuValue' },
      { title: '描述', dataIndex: 'remarks', key: 'remarks' },
      {
        title: '操作', key: 'operation',
        render: (text, record, index) =>
          <div>
            <Tooltip title={record.freezeStatus == 2 ? '冻结' : '正常'}>
              <span className="account-table-title" style={{ cursor: 'pointer' }} onClick={this.freeze.bind(this, record)} >
                {
                  record.freezeStatus == 2 ? <Icon style={{ color: '#428ef2' }} type="close-circle-o" /> : <Icon style={{ color: '#428ef2' }} type="check-circle-o" />
                }
              </span>
            </Tooltip>
            <Tooltip title="编辑">
              <span className="account-table-title" onClick={this.editChild.bind(this, record)} style={{ cursor: 'pointer', marginLeft: 15 }}>
                <Icon style={{ color: '#428ef2' }} type="edit" />
              </span>
            </Tooltip>
            {/* <Popconfirm title="你确定删除吗？" onConfirm={this.delete.bind(this, record.id, 'position')} okText="确定" cancelText="取消">
              <Tooltip title="删除">
                <span className="account-table-title" style={{ cursor: 'pointer', marginLeft: 15 }}>
                  <Icon style={{ color: '#428ef2' }} type="delete" />
                </span>
              </Tooltip>
            </Popconfirm> */}
          </div>

      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={e.proSkuValueList}
        pagination={false}
      />
    );
  };
  // 发送新增数据
  save = (values, url) => {
    let that = this;
    // '/hr/employeeType/add'
    fetch(globals.url.url + url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (res.code == 0) {
          message.success('操作成功！');
          that.list();
        } else {
          message.success('保存失败！');
        }
      })
      .catch((error) => {
        message.warning('加载失败，请刷新重试');
      });
  }


  // 取消
  handleCancel = () => {
    this.setState({ visible: false, visiblePost: false });
  }
  // 点击确定
  handleCreate = () => {
    let DataType = this.state.DataType;
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let url = '';
      // typeName 1   类别    属性值 2
      if (DataType.typeName == 1) {
        if (DataType.type == 'add') {
          url = '/product/proSkuCategory/add';
        } else {
          url = '/product/proSkuCategory/update';
        }
      } else {
        if (DataType.type == 'add') {
          url = '/product/proSkuValue/add';
        } else {
          url = '/product/proSkuValue/update';
        }
      }
      this.save(values, url)
      form.resetFields();
      this.setState({ visible: false, visiblePost: false });
    });
  }
  // form 返回数据  
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  // 冻结/解冻
  freeze(record) {
    let that = this;
    let url = ''
    if (record.freezeStatus == 1) {
      if (record.hasOwnProperty('skuValue')) {
        url = globals.url.url + '/product/proSkuValue/freeze?id=' + record.id;
      } else {
        url = globals.url.url + '/product/proSkuCategory/freeze?id=' + record.id;
      }
    } else {
      if (record.hasOwnProperty('skuValue')) {
        url = globals.url.url + '/product/proSkuValue/thaw?id=' + record.id;
      } else {
        url = globals.url.url + '/product/proSkuCategory/thaw?id=' + record.id;
      }
    }
    fetch(url, {
      method: 'GET',
      credentials: 'include',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (res.code == 0) {
          message.success('操作成功！');
          that.list();
        } else {
          message.success('保存失败！');
        }
      })
      .catch((error) => {
        message.warning('加载失败，请刷新重试');
      });

  }
  // 属性类别修改/新增
  DepartmentAdd = () => {
    let ModalData = this.state.ModalData;
    let DataType = this.state.DataType;
    var staffData = [{
      name: '类别名称',
      massage: '请填写类别名称',
      key: 'categoryName',
      tag: 'input',
      must: true
    }, {
      name: '描述',
      key: 'remarks',
      tag: 'input',
      must: false
    }]
    DataType.typeName = 1;
    DataType.type = "add";
    this.setState({
      ModalTitle: '类别属性',
      ModalData: staffData,
      DataType: DataType
    })
    this.showModal();
  }
  // 显示模态框
  showModal = () => {
    this.setState({ visible: true });
  }
  // 属性值修改/新增
  PostAdd = () => {
    let ModalData = this.state.ModalData;
    let DataType = this.state.DataType;
    var staffData = [{
      name: '类别名称',
      massage: '请选择类别名称',
      key: 'skuCategoryId',
      must: true,
      data: this.state.data,
      tag: 'select'
    }, {
      name: '属性值',
      massage: '请填写类别名称',
      key: 'skuValue',
      must: true,
      tag: 'input'
    }, {
      name: '描述',
      key: 'remarks',
      must: false,
      tag: 'input'
    }]
    DataType.type = "add";
    DataType.typeName = 2;
    this.setState({
      ModalTitle: '属性值',
      ModalData: staffData,
      DataType: DataType
    })
    this.showModal();
  }
  render() {
    var that = this;
    const columns = [
      {
        title: '', dataIndex: '11', width: 60, key: '11', align: 'center',
        render(text, record, index) {
          return (
            <span>{index + 1}</span>
          )
        }
      },
      { title: '属性类别', dataIndex: 'categoryName', key: 'categoryName' },
      { title: '描述', dataIndex: 'remarks', key: 'remarks' },
      // { title: '部门类型', dataIndex: 'type', key: 'type' },
      {
        title: '操作', key: 'operation', render: (text, record, index) =>
          <div>
            <Tooltip title={record.freezeStatus == 2 ? '冻结' : '正常'}>
              <span className="account-table-title" style={{ cursor: 'pointer' }} onClick={this.freeze.bind(this, record)} >
                {
                  record.freezeStatus == 2 ? <Icon style={{ color: '#428ef2' }} type="close-circle-o" /> : <Icon style={{ color: '#428ef2' }} type="check-circle-o" />
                }
              </span>
            </Tooltip>
            <Tooltip title="编辑">
              <span className="account-table-title" onClick={that.edit.bind(that, record)} style={{ cursor: 'pointer', marginLeft: 15 }}>
                <Icon style={{ color: '#428ef2' }} type="edit" />
              </span>
            </Tooltip>
            {/* <Popconfirm title="你确定删除吗？" onConfirm={this.delete.bind(this, record.id, 'department')} okText="确定" cancelText="取消">
              <Tooltip title="删除">
                <span className="account-table-title" style={{ cursor: 'pointer', marginLeft: 15 }}>
                  <Icon style={{ color: '#428ef2' }} type="delete" />
                </span>
              </Tooltip>
            </Popconfirm> */}
          </div>
      },
    ];
    return (
      <div className="w_content">
        <div className="w_header clearfix">
          <div className="f_right ">
            <Button type="primary" onClick={this.DepartmentAdd.bind(this)} className="mr10"  >
              <i className="icon mr8">&#xe637;</i>
              类别新增
              </Button>
            <Button type="primary" onClick={this.PostAdd.bind(this)} >
              <i className="icon mr8">&#xe637;</i>
              属性值新增
              </Button>

          </div>
        </div>
        <Table
          bordered
          className="components-table-demo-nested md15 mt0 heightTable"
          columns={columns}
          expandedRowRender={this.expandedRowRender}
          dataSource={this.state.data}
          pagination={false}
        >
        </Table>
        <CollectionCreateForm
          title={this.state.ModalTitle}
          DataType={this.state.DataType}
          ModalData={this.state.ModalData}
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCreate={this.handleCreate}
          onCancel={this.handleCancel}
        />

      </div>
    );
  }
}
export default Department;
