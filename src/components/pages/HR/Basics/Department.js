import React from 'react';
import { Menu, Icon, Dropdown, Spin, Badge, Popconfirm, Tooltip, Pagination, Input, message, InputNumber, Modal, Table, Button, Switch } from 'antd';

import { Link } from 'react-router-dom';
import 'src/style/pages.less';
import globals from 'src/components/unit';
import ModelDepart from 'src/components/Component/ModelType/ModelDepart';
import ModelPost from 'src/components/Component/ModelType/ModelPost';

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      DataType: {},
      visible: false,
      visiblePost: false,
      ModalData: [{ data: [], value: '' }],
      getTree: '',
      ModalTitle: '部门新增',
    };
  }
  componentDidMount() {
    this.list();

  }
  list() {
    let that = this;
    let data = that.state.data;
    // 请求列表数据
    fetch(globals.url.url + '/hr/department/listAll', {
      method: 'get',
      credentials: 'include',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (res.code == 0) {
          for (let i = 0; i < res.result.length; ++i) {
            res.result[i].key = i;
            if (res.result[i].perent == 0) {
              res.result[i].perentName = '全部'
            }
            for (let j = 0; j < res.result[i].positionList.length; ++j) {
              res.result[i].positionList[j].key = j;


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
    // 请求部门列表数据
    fetch(globals.url.url + '/hr/department/getTree', {
      method: 'get',
      credentials: 'include',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (res.code == 0) {
          for (let i = 0; i < res.result.length; ++i) {
            res.result[i].key = i;
             if(res.result[i].children){
              if (res.result[i].children.length > 0) {
                res.result[i].perentName = '全部'
              }
            }
          }
          that.setState({
            getTree: res.result
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
    let DataType = this.state.DataType;
    let getTree = this.state.getTree;
    let ModalData = this.state.ModalData;
    this.getTreeData(getTree);
    ModalData.data = getTree;
    ModalData.value = JSON.stringify(record.perent);
    ModalData.name = record.name;
    ModalData.type = record.type;
    ModalData.level = record.level;
    DataType.type = "edit";
    DataType.id = record.id;

    this.setState({
      ModalData: ModalData,
      DataType: DataType,
      visible: true
    })
  }
  //岗位修改
  editChild = (record) => {
    let DataType = this.state.DataType;
    let getTree = this.state.getTree;
    let ModalData = this.state.ModalData;
    this.getTreeData(getTree);
    ModalData.data = getTree;
    ModalData.value = JSON.stringify(record.departmentId);
    ModalData.postName = record.postName;
    ModalData.amount = record.amount;
    ModalData.isManager = record.isManager;
    DataType.type = "edit";
    DataType.id = record.id;
    this.setState({
      ModalData: ModalData,
      DataType: DataType,
      visiblePost: true
    })
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
      { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
      { title: '人员编制', dataIndex: 'amount', key: 'amount' },
      { title: '部门管理岗', key: 'isManager', render: (text, record, index) => <span>{record.isManager == 0 ? '不是' : '是'} </span> },
      {
        title: '操作', key: 'operation',
        render: (text, record, index) =>
              <div>
              <Tooltip title="编辑">
                <span className="account-table-title"onClick={this.editChild.bind(this, record)} style={{ cursor: 'pointer' }}>
                  <Icon style={{ color: '#428ef2' }} type="edit" />
                </span>
              </Tooltip>
              <Popconfirm title="你确定删除吗？" onConfirm={this.delete.bind(this, record.id, 'position')} okText="确定" cancelText="取消">
                <Tooltip title="删除">
                  <span className="account-table-title" style={{ cursor: 'pointer', marginLeft: 15 }}>
                    <Icon style={{ color: '#428ef2' }} type="delete" />
                  </span>
                </Tooltip>
              </Popconfirm>
            </div>

      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={e.positionList}
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
  // 新增/修改部门点击确定
  handleCreate = () => {
    let DataType = this.state.DataType;
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let url = '';
      if (DataType.type == 'add') {
        url = '/hr/department/add';
      } else {
        url = '/hr/department/update';
      }
      this.save(values, url)
      form.resetFields();
      this.setState({ visible: false, visiblePost: false });
    });
  }


  // 新增部门/岗位取消
  handleCancel = () => {
    this.setState({ visible: false, visiblePost: false });
  }
  // 新增岗位点击确定
  handleCreatePost = () => {
    let DataType = this.state.DataType;
    const form = this.formRefPost.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let url = '';
      if (DataType.type == 'add') {
        url = '/hr/position/add';
      } else {
        url = '/hr/position/update';
      }
      values.isManager = values.isManager ? '1' : '0';

      this.save(values, url)
      form.resetFields();
      this.setState({ visible: false, visiblePost: false });
    });
  }
  // 岗位form数据
  saveFormRefPost = (formRef) => {
    this.formRefPost = formRef;
  }
  // 部门form数据  
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  // 递归处理数据 筛选树数据
  getTreeData(data) {
    return data.map((item, index) => {
      item.label = item.name;
      item.value = item.id + '';
      item.key = item.level + '-' + index;
      if (item.children) {
        return (
          this.getTreeData(item.children)
        );
      }
      return data[index];
    });
  }
  // 部门新增
  DepartmentAdd = () => {
    let ModalData = this.state.ModalData;
    let DataType = this.state.DataType;
    let getTree = this.state.getTree;
    this.getTreeData(getTree);
    DataType.type = "add";
    ModalData = {
      data: getTree
    }
    this.setState({
      ModalData: ModalData,
      DataType: DataType,
      visible: true
    })
  }
  // 岗位新增
  PostAdd = () => {
    let ModalData = this.state.ModalData;
    let DataType = this.state.DataType;
    let getTree = this.state.getTree;
    this.getTreeData(getTree);
    DataType.type = "add";
    ModalData = {
      data: getTree
    }
    this.setState({
      ModalData: ModalData,
      DataType: DataType,
      visiblePost: true
    })
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
      { title: '上级部门', dataIndex: 'perentName', key: 'perentName' },
      { title: '部门名称', dataIndex: 'name', key: 'name' },
      { title: '部门类型', dataIndex: 'type', key: 'type' },
      {
        title: '操作', key: 'operation', render: (text, record, index) =>
          <div>
            { record.perent != '0' &&
              <Tooltip title="编辑">
                <span className="account-table-title" onClick={that.edit.bind(that, record)} style={{ cursor: 'pointer' }}>
                  <Icon style={{ color: '#428ef2' }} type="edit" />
                </span>
              </Tooltip>
            }
            { record.perent != '0' &&
            <Popconfirm title="你确定删除吗？" onConfirm={this.delete.bind(this, record.id, 'department')} okText="确定" cancelText="取消">
              <Tooltip title="删除">
                <span className="account-table-title" style={{ cursor: 'pointer', marginLeft: 15 }}>
                  <Icon style={{ color: '#428ef2' }} type="delete" />
                </span>
              </Tooltip>
            </Popconfirm>
            }
            
          </div>
        
      },
    ];



    // const position = 
    return (
      <div className="w_content">
        <div className="w_header clearfix">
          <div className="f_right ">
            <Button type="primary" onClick={this.DepartmentAdd.bind(this)} className="mr10"  >
              <i className="icon mr8">&#xe637;</i>
              部门新增
              </Button>
            <Button type="primary" onClick={this.PostAdd.bind(this)} >
              <i className="icon mr8">&#xe637;</i>
              岗位新增
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
        {/* 部门 修改 */}
        <ModelDepart
          title={this.state.ModalTitle}
          DataType={this.state.DataType}
          ModalData={this.state.ModalData}
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
        {/* 岗位新增 修改 */}
        <ModelPost
          title={this.state.ModalTitle}
          DataType={this.state.DataType}
          ModalData={this.state.ModalData}
          wrappedComponentRef={this.saveFormRefPost}
          visiblePost={this.state.visiblePost}
          onCancel={this.handleCancel}
          onCreate={this.handleCreatePost}
        />
      </div>
    );
  }
}
export default Department;
