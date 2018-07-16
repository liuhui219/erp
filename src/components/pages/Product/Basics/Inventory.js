import React from 'react';
import { Menu, Icon, Dropdown, Pagination, Tooltip, Popconfirm, Input, message, InputNumber, Modal, Table, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
import globals from '../../../unit';
import CollectionCreateForm from 'src/components/Component/ModelType/ClassifyModelType';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            DataType: {},
            visible: false,
            ModalData: [],
            ModalTitle: '证件类型',
            showHide: true
        };
    }
    componentDidMount() {
        this.list()
    }
    // 编辑
    edit = (record) => {
        let that = this;
        let ModalData = this.state.ModalData;
        let DataType = this.state.DataType;
        var staffData = [{
            name: '存货类型',
            massage: '请填写存货类型',
            key: 'stockType',
            value:record.stockType,
            tag: 'input',
            must: true
        },{
            name: '产品来源',
            massage: '请填写产品来源',
            key: 'productSource',
            value:record.productSource,
            tag: 'input',
            must: true
        }, {
            name: '描述',
            key: 'remarks',
            value:record.remarks,
            tag: 'input',
            must: false
        },{
            name: '可否销售',
            key: 'canSales',
            options:[{value:'canSales'}],
            tag: 'checkbox',
            value:record.canSales ? ['canSales']:[],
            must: false
        }]
        DataType.type = "edit";
        DataType.id = record.id;

        this.setState({
            ModalData: staffData,
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
        fetch(globals.url.url + '/product/proStockType/list', {
            method: 'get',
            credentials: 'include'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                if (res.code == 0) {
                    for (let i = 0; i < res.result.length; ++i) {
                        res.result[i].key = i;
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
    add = () => {
        let that = this;
        let ModalData = this.state.ModalData;
        let DataType = this.state.DataType;
        var staffData = [{
            name: '存货类型',
            massage: '请填写存货类型',
            key: 'stockType',
            tag: 'input',
            must: true
        },{
            name: '产品来源',
            massage: '请填写产品来源',
            key: 'productSource',
            tag: 'input',
            must: true
        }, {
            name: '描述',
            key: 'remarks',
            tag: 'input',
            must: false
        },{
            name: '可否销售',
            key: 'canSales',
            options:[{value:'canSales'}],
            tag: 'checkbox',
           
            must: false
        }]
        DataType.type = "add";
        this.setState({
            ModalData: staffData,
            DataType: DataType
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
            url = globals.url.url + '/product/proStockType/freeze?id=' + record.id;
        }else{
            url = globals.url.url + '/product/proStockType/thaw?id=' + record.id;
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
            // console.log(values)
            if(values.canSales){
                if(values.canSales.length == 0){
                    values.canSales = 0
                }else{
                    values.canSales = 1                    
                }
            }else{
                values.canSales = 0
            }
            if(!values.description){
                delete values.description
            }
            let url = '';
            if (DataType.type == 'add') {
                url = '/product/proStockType/add';
            } else {
                url = '/product/proStockType/update';
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
            { title: '存货类型', dataIndex: 'stockType', width: 150, key: 'stockType' },
            { title: '产品类型', dataIndex: 'productSource', width: 150, key: 'productSource' },
            { title: '可否销售', dataIndex: 'canSales', width: 150, key: 'canSales', render: (text, record, index) => record.canSales ? '是' : '否' },
            { title: '描述', dataIndex: 'remarks', width: 150, key: 'remarks' },
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
                        <Tooltip title="编辑">
                            <span className="account-table-title" onClick={that.edit.bind(that, record)} style={{ cursor: 'pointer', marginLeft: 15  }}>
                                <Icon style={{ color: '#428ef2' }} type="edit" />
                            </span>
                        </Tooltip>

                    </div>
            },
        ];
        // const position =<Icon type="usergroup-add" />
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
