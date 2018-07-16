import React from 'react';
import { Menu, Icon, Dropdown, Pagination, Tooltip, Popconfirm, Input, message, InputNumber, Modal, Table, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
import globals from '../../../unit';
// import CollectionCreateForm from 'src/components/Component/ModelType/ModelType';
import ClassifyDepart from 'src/components/Component/ModelType/ClassifyDepart';

import { POINT_CONVERSION_UNCOMPRESSED } from 'constants';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalTitle: '',
            data: [],
            DataType: {},
            visible: false,
            ModalData: [],
            showHide: true
        };
    }
    componentDidMount() {
        this.list()
    }
    // 编辑
    edit = (record) => {
        let DataType = this.state.DataType;
        let getTree = this.state.getTree;
        let ModalData = this.state.ModalData;
        this.getTreeData(getTree);
        ModalData.data = getTree;

        ModalData.value = JSON.stringify(record.parentId);


        ModalData.name = record.name;
        ModalData.code = record.code;
        DataType.type = "edit";
        DataType.id = record.id;
        this.setState({
            ModalTitle: '新增分类',
            ModalData: ModalData,
            DataType: DataType
        })
        this.showModal();
    }
    // 删除
    delete = (id) => {
        this.save('', '/hr/papers/delete?id=' + id)
    }
    // 获取列表
    list = () => {
        let that = this;
        let data = that.state.data;
        fetch(globals.url.url + '/product/proCategory/list', {
            method: 'get',
            credentials: 'include'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                console.log(res)
                if (res.code == 0) {
                    for (let i = 0; i < res.result.length; ++i) {
                        res.result[i].key = i;
                        // res.result[i].perentName = '全部'
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
        // 请求产品分类树
        fetch(globals.url.url + '/product/proCategory/getTree', {
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
                        if (res.result[i].children) {
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
    // 递归处理数据 筛选树数据
    getTreeData(data) {
        return data.map((item, index) => {
            item.label = item.name;
            item.value = item.id + '';
            item.key = item.id + '-' + index;
            if (item.children) {
                return (
                    this.getTreeData(item.children)
                );
            }
            return data[index];
        });
    }
    add = () => {
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
            ModalTitle: '新增分类',
            DataType: DataType,
            visible: true
        })
        this.showModal();
    }
    // 显示模态框
    showModal = () => {
        this.setState({ visible: true });
    }
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
    // 冻结/解冻
    freeze(record) {
        let that = this;
        let url = ''
        if(record.freezeStatus == 1){
            url = globals.url.url + '/product/proCategory/freeze?id=' + record.id;
        }else{
            url = globals.url.url + '/product/proCategory/thaw?id=' + record.id;
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
    // 点击确定
    handleCreate = () => {
        let DataType = this.state.DataType;
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let url = '';
            if (DataType.type == 'add') {
                url = '/product/proCategory/add';
            } else {
                url = '/product/proCategory/update';
            }
            this.save(values, url)
            form.resetFields();
            this.setState({ visible: false });
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        var that = this;
        const { selectedRowKeys } = this.state;
        const columns = [
            {
                title: '', dataIndex: 'name', width: 40, key: '1', align: 'center',
                render(text, record, index) {
                    return (
                        <span>{index + 1}</span>
                    )
                }
            },
            { title: '分类编码', dataIndex: 'code', width: 150, key: 'code' },
            { title: '分类名称', dataIndex: 'name', width: 150, key: 'name' },
            { title: '上级分类', dataIndex: 'parentName', width: 150, key: 'parentName' },
            {
                title: '操作', width: 150, key: 'operation', render: (text, record, index) =>

                    <div>
                        <Tooltip title={record.freezeStatus ==2 ? '冻结' : '正常'}>
                            <span className="account-table-title" style={{ cursor: 'pointer', marginLeft: 15 }} onClick={this.freeze.bind(this, record)} >
                                {
                                    record.freezeStatus==2 ? <Icon style={{ color: '#428ef2' }} type="close-circle-o" /> : <Icon style={{ color: '#428ef2' }} type="check-circle-o" />
                                }
                            </span>
                        </Tooltip>
                        {record.parentId == 0 ? '' :
                            <Tooltip title="编辑">
                                <span className="account-table-title" onClick={that.edit.bind(that, record)} style={{ cursor: 'pointer', marginLeft: 15 }}>
                                    <Icon style={{ color: '#428ef2' }} type="edit" />
                                </span>
                            </Tooltip>
                        }

                    </div>
            },
        ];
        return (
            <div className="w_content">
                <div className="w_header clearfix">
                    <div className="f_right ">
                        <Button type="primary" className="mr10" onClick={this.add} >
                            <i className="icon mr8">&#xe637;</i>
                            新增
                        </Button>
                    </div>
                </div>
                <Table
                    bordered
                    className="components-table-demo-nested md15 mt0 heightTable"
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                />
                <ClassifyDepart
                    title={this.state.ModalTitle}
                    DataType={this.state.DataType}
                    ModalData={this.state.ModalData}
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}
