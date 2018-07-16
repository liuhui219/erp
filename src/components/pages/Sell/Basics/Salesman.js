import React, { Component } from 'react';

import { Table, Icon, Divider, Button,Tooltip, Popconfirm, message, Pagination, Spin, Input, DatePicker, Modal, Select, Tree, Form } from 'antd';

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
            spinning: true,
            tip: '加载中...',
            visible: false,
            userID: '',
            userAdd: {
                type: ''
                
            },
            checkedKeys: [],
            showHide: false,
            key: null
        }
    }

    componentDidMount() {
        this.getData();
        this.getTreeData()

    }
    // 删除
    delete= (id) =>  {
        this.save('','/sale/salesman/delete?id='+id)
    }
    save = (values,url) =>{
        let that= this;
        // '/hr/employeeType/add'
        fetch(globals.url.url +  url, {
            method: 'GET',
            credentials: 'include',
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                if (res.code == 0) {
                    message.success('操作成功！');
                    that.getData();
                    that.getTreeData();
                } else {
                    message.success('保存失败！');
                }
            })
            .catch((error) => {
                message.warning('加载失败，请刷新重试');
            });
    }
    // 获取树结构
    getTreeData = () => {

        let that = this;
        fetch(globals.url.url + '/hr/department/getDepartmentEmployee', {
            method: 'GET',
            credentials: 'include'
        }).then(function (response) {
            return response.json();
        }).then(function (res) {
            if (res.code == 0) {
                console.log(res)
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
            if (item.hasOwnProperty('perent')) {
                item.key = item.id + '---parent'
            } else {
                item.key = item.id + '---child'
            }
            if (item.employeeVOList) {
                for (let i in item.employeeVOList) {
                    item.employeeVOList[i].name = item.employeeVOList[i].name + '(' + item.employeeVOList[i].phoneNumber + ')'
                    if (item.children) {
                        item.children.push(item.employeeVOList[i])
                    } else {
                        item.children = [];
                        item.children.push(item.employeeVOList[i])
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

    getData() {
        var that = this;
        let url = globals.url.url + '/sale/salesman/list';
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            var arr = [];
            if (result.code == 0) {
                result.result.map((data, i) => {
                    result.result[i].key = i;
                })
                that.setState({
                    data: result.result,
                    spinning: false
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
    add = () => {
        let userAdd = this.state.userAdd;
        userAdd = {};
        userAdd.save = 'add'
        this.setState({ visible: true,userAdd:userAdd })
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
            checkedKeys: checkedKeys
        })
    }
    handleOk = () => {
        let form = this.props.form;
        form.validateFields((err, values) => {

            if (err) {
                if (this.state.userAdd.type == 0) {
                    return;
                } else {
                    if (this.state.checkedKeys.length == 0) {
                        return
                    }
                }
            }
            var userAdd = this.state.userAdd;
            let obj = {};
            if (values.type == 1) {
                let obj_child = []
                obj.type = 1;
                this.state.checkedKeys.map((item, index) => {
                    let reg = RegExp('---child');
                    if (reg.test(item)) {
                        item = item.replace('---child', '');
                        obj_child.push (item);

                    }
                })
                obj_child = obj_child.join(',')
                obj.employeeId = obj_child
            } else {
                obj = values;
            }
            this.addStaff(obj)
            form.resetFields();
            this.setState({ visible: false });
        });
    }
    addStaff = (obj) => {
        var that = this;
        var userAdd = this.state.userAdd;
        let url = ''

        if(userAdd.save =='add'){
           url = globals.url.url + '/sale/salesman/add';
        }else{
            obj.id = userAdd.id
           url = globals.url.url + '/sale/salesman/update';
        }

        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result)
            if (result.code == 0) {
                message.success('操作成功！');
                that.getData();
                that.getTreeData();
                
            }
            if (result.code == '100311') {
                message.warning('用户已存在，请重新添加');
            }
            if(result.code == '110028'){
                message.warning(result.message);
                
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
    // 编辑表单
  edit = (record) => {
        let userAdd = this.state.userAdd
        userAdd.name = record.name;
        userAdd.phoneNumber = record.phoneNumber;
        userAdd.type = '0';
        userAdd.save = 'edit'
        userAdd.id = record.id
        this.setState({
            visible : true,
            userAdd:userAdd
        })
  }
    // 操作

     


    operate = (record) => {
        let that = this;
        let url = '';
        if(record.freezeStatus == 1){
            url = globals.url.url + '/sale/salesman/freeze?id=' + record.id;
        }else{
            url = globals.url.url + '/sale/salesman/thaw?id=' + record.id;
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
                that.getData()
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
            title: '部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
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
            title: '操作',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 100,
            render: (text, record, i) => (
                <div>
                <Tooltip title={record.freezeStatus == 2 ? '冻结' : '正常'}>
                  <span className="account-table-title" style={{ cursor: 'pointer' }} onClick={this.operate.bind(this, record)} >
                    {
                      record.freezeStatus == 2 ? <Icon style={{ color: '#428ef2' }} type="close-circle-o" /> : <Icon style={{ color: '#428ef2' }} type="check-circle-o" />
                    }
                  </span>
                </Tooltip>

                {record.type != 1 
                ? <Tooltip title="编辑">
                    <span className="account-table-title" onClick={this.edit.bind(this, record)} style={{ cursor: 'pointer', marginLeft: 15 }}>
                        <Icon style={{ color: '#428ef2' }} type="edit" />
                    </span>
                    </Tooltip>
                : null}
                <Popconfirm title="你确定删除吗？" onConfirm={this.delete.bind(this, record.id)}  okText="确定" cancelText="取消">
                    <Tooltip title="删除">
                    <span className="account-table-title" style={{cursor:'pointer',marginLeft:15}}>
                        <Icon style={{color:'#428ef2'}} type="delete" />
                    </span>
                    </Tooltip>
                </Popconfirm>
                
              </div>
            )
        }];

        let tree = null;
        if (showHide) {
            tree = <Form layout="vertical">
                <FormItem {...formItemLayout} label="选择员工">
                    {getFieldDecorator('id', {
                        rules: [{ required: true, message: '请选择员工' }],
                        valuePropName: 'selectable'
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
                        
                        <Button type="primary" className="ml20 f_right" onClick={this.add} icon="search">
                            添加
                        </Button>
                    </div>
                    <div className="page_table">
                        <Table columns={columns} dataSource={this.state.data} bordered pagination={false} />
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
                                    initialValue: this.state.userAdd.type
                                })(
                                    <Select style={{ width: 300 }} onSelect={this.selectChang}>
                                        <Option value="1">内部用户</Option>
                                        <Option value="0">外部用户</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Form>
                        {/* 判断是否出现员工树 */}
                        

                        {this.state.userAdd.type == 0
                            ?
                            <div>
                                <FormItem {...formItemLayout} label="姓名">
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: '请选择用户类型' }],
                                    initialValue: this.state.userAdd.name
                                        
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="电话">
                                    {getFieldDecorator('phoneNumber', {
                                        rules: [{ required: true, message: '请选择用户类型' }],
                                        initialValue: this.state.userAdd.phoneNumber   
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </div>
                            : <div>{tree}</div>}

                    </Modal>
                </Spin>
            </div>
        );
    }
}
export default Form.create()(OperationLog)
