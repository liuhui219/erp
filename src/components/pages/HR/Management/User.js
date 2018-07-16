import React, { Component } from 'react';
import { Table, Icon, Divider, Button, Popconfirm, message, Pagination, Spin, Input, DatePicker, Modal, Select, Tree, Form } from 'antd';

import globals from 'src/components/unit';
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const FormItem = Form.Item;
class OperationLog extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      treeData: [],
      recordTotal: '',
      pageSize: 10,
      page: 1,
      spinning: true,
      tip: '加载中...',
      visible: false,
      userID:'',
      userAdd: {
        type: ''
      },
      checkedKeys:[],
      showHide: false,
      key: null,
      departmentName: null
    }
  }

  componentDidMount() {
    this.getData(1, 10);
    this.getTreeData()

  }
  // 获取树结构
  getTreeData = () => {

    let that = this;
    fetch(globals.url.url + '/sys/user/tree', {
      method: 'GET',
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then(function (res) {
      if (res.code == 0) {
        let tree = that.disposeTreeData(res.result)
        that.setState({
          treeData: res.result
        })
      } else {
        message.warning(res.message);
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
  // 递归处理数据 筛选树数据
  disposeTreeData(data) {
    return data.map((item, index) => {
      item.title = item.name;
      if(item.hasOwnProperty('perent')){
        item.key =   item.id+'---parent'
      }else{
        item.key =   item.id+'---child'
        
      }
      if (item.employeeList) {
        for ( let i in  item.employeeList) {
          item.employeeList[i].name = item.employeeList[i].name+'('+item.employeeList[i].number+')'

          if(item.children){
            item.children.push(item.employeeList[i])
          }else{
            item.children = [];
            item.children.push(item.employeeList[i])            
          }
        }
      }
      if (item.children) {
        return (
          this.disposeTreeData(item.children)
        );
      }
      return data[index];
    });
  }

  // 筛选用户
  keyChange = (e) => {
    this.setState({
      key: e.target.value
    })
  }
  //  筛选部门
  departmentName = (e) => {
    this.setState({
      departmentName: e.target.value
    })
  }
  confirm = () => {
    this.getData(this.state.page, this.state.pageSize)
  }
  getData(page, num) {
    var that = this;
    let url = globals.url.url + '/sys/user/list?pageNumber=' + page + '&pageSize=' + num;
    if (that.state.key) {
      url = url + '&key=' + that.state.key;
    }
    if (that.state.departmentName) {
      url = url + '&departmentName=' + that.state.departmentName;
    }
    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      var arr = [];
      if (result.code == 0) {
        result.result.object.map((data, i) => {
          result.result.object[i].key = i;
        })
        that.setState({
          data: result.result.object,
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
    current = current == 0 ? 1 : current
    this.setState({
      page: current,
      pageSize: pageSize
    })
    this.getData(current, pageSize)
  }

  onChange = (page) => {
    this.setState({
      page: page,
    })
    this.getData(page, this.state.pageSize)

  }
  add = () => {
    this.setState({ visible: true })
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  selectChang = (e) => {
    let that = this;
    let userAdd = that.state.userAdd;
    let showHide = that.state.showHide;
    if (e == '1') {
      userAdd.type = 1;
      showHide = true;
    } else {
      userAdd.type = 0;
      showHide = false;
    }
    that.setState({
      userAdd: userAdd,
      showHide: showHide
    })
  }

  onCheck = (checkedKeys, info) => {
    this.setState({
      checkedKeys:checkedKeys
    })
  }
  handleOk = () => {
    let form = this.props.form;
    form.validateFields((err, values) => {
     
      if (err) {
        if(this.state.userAdd.type == 0){
            return;
        }else{
          if(this.state.checkedKeys.length == 0){
            return
          }
        }
      }
    var userAdd = this.state.userAdd;
    let  obj = [];
    if(values.type == 1){
      console.log(this.state.checkedKeys)
      this.state.checkedKeys.map((item,index)=>{
       let reg = RegExp('---child');
        if(reg.test(item)){
          var obj_child = {};
          obj_child.type = values.type;
          item = item.replace('---child','');
          obj_child.employeeId = item;
          obj.push(obj_child)
          
        }
      })
    }else{
      obj[0] = values;
    }
      this.addStaff(obj)
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  addStaff = (obj) =>{
    var that = this;
    
    let url = globals.url.url+'/sys/user/add';
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body:JSON.stringify(obj)
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
        console.log(result)
      if (result.code == 0) {
          message.success('操作成功！');
          that.getData(that.state.page, that.state.pageSize);
      }
      if(result.code == '100311'){
        message.warning('用户已存在，请重新添加');
      }


    }).catch((error) => {
      message.warning('加载失败，请刷新重试');
      that.setState({
        spinning: false,
      })
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  // 渲染
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  // 操作
  operate = (record) => {
    let that = this;
    let url = '';
    if (record.status == 2) {
      url = globals.url.url + '/sys/user/updateToFreeze?id=' + record.id;
    }
    if (record.status == 3) {
      url = globals.url.url + '/sys/user/updateToUnfreeze?id=' + record.id;
    }
    that.setState({
      spinning: true,
    })
    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result.code == 0) {
        that.getData(that.state.page, that.state.pageSize)
        that.setState({
          spinning: false,
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const showHide = this.state.showHide;


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const columns = [{
      width: 50,
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      filterDropdown: (
        <div className="custom-filter-dropdown">
        </div>
      ),
      filterIcon: <Icon type="setting" />,
      render: (text, record, i) => (
        <span>{i + 1}</span>
      )
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    }, {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 100,
    }, {
      title: '用户类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (text, record, i) => (
        <span>
          {record.type == 1 ? '内部用户' : '外部用户'}
        </span>
      )
    }, {
      title: '状态',
      dataIndex: 'EmployeeType',
      key: 'EmployeeType',
      width: 100,
      render: (text, record, i) => (
        <span>
          {record.status == 1 && '未激活'}
          {record.status == 2 && '已激活'}
          {record.status == 3 && '冻结'}
        </span>
      )
    }, {
      title: '操作',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
      render: (text, record, i) => (
        <span onClick={this.operate.bind(this, record)}>
          {record.status == 2 && '冻结'}
          {record.status == 3 && '解冻'}
        </span>
      )
    }];
    
    let tree = null;
    if (showHide) {
      tree = <Form layout="vertical">
        <FormItem {...formItemLayout} label="选择员工">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请选择员工' }],
            valuePropName:'selectable'
          })(
            <Tree
              className="tree"
              checkable
              onCheck={this.onCheck}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>

          )}
        </FormItem>
      </Form>
    } else {
      tree = null;
    }

    return (
      <div className="page_check">
        <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
          <div className="pd20 clearfix">
            <div className=" f_left  flex">
              <div className="flex pl20">
                <label >用户：</label>
                <Input className="w200" placeholder="请输入工号/姓名/手机号码" onChange={this.keyChange} />
              </div>
              <div className="flex pl20">
                <label >部门：</label>
                <Input className="w200" onChange={this.departmentName} />
              </div>
              <Button type="primary" className="ml20" onClick={this.confirm} icon="search">
                搜索
                 </Button>
            </div>
            <Button type="primary" className="ml20 f_right" onClick={this.add} icon="search">
              添加
              </Button>
          </div>
          <div className="page_table">
            <Table columns={columns} dataSource={this.state.data} bordered pagination={false} />
          </div>
          <div className="page_pagination">
            <Pagination showSizeChanger showQuickJumper pageSizeOptions={['10', '20', '50']} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange.bind(this)} defaultCurrent={1} total={Number(this.state.recordTotal)} />
          </div>
          <Modal
            title='用户添加'
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel}

            okText="确定"
            cancelText="取消"
          >
            {/* onValuesChange={this.selectChang} */}
            <Form layout="vertical">
              <FormItem {...formItemLayout} label="用户类型">
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择用户类型' }],
                })(
                  <Select style={{ width: 300 }} onSelect={this.selectChang}>
                    <Option value="1">内部用户</Option>
                    <Option value="0">外部用户</Option>
                  </Select>
                )}
              </FormItem>
            </Form>
            {/* 判断是否出现员工树 */}
            {tree}
            
            {this.state.userAdd.type === 0
              ?
             <div>
                <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请选择用户类型' }],
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="电话">
            {getFieldDecorator('phoneNumber', {
              rules: [{ required: true, message: '请选择用户类型' }],
            })(
              <Input/>
            )}
          </FormItem>
             </div>
            :null}
            
          </Modal>
        </Spin>
      </div>
    );
  }
}
export default Form.create()(OperationLog)
