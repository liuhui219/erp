import React, { Component } from 'react';
import '../../HR/hr.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin, Upload, Select, Modal, Cascader, Tabs, Popconfirm, Tooltip, Table } from 'antd';
import globals from 'src/components/unit';
import moment from 'moment';
import { connect } from 'react-redux';
import Position from '../../../Component/CompanyAddr/Position';
import Bank from './modalForm/bank';

import CollectionCreateForm from 'src/components/Component/ModelType/ClassifyModelType';


import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
class CompanyUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ClientA: {
                contact: [],
                address: [],
                informationVO:{}
            },
            key: 1,
            loading: false,
            spinning: false,
            visible1: false,
            tip: '加载中...',
            DataType: {},
            ModalData: [],
            ModalTitle: '证件类型',
            showHide: true,
            data:{
                businessAreaList:[],
                customerRankList:[],
                salesmanList:[],
                taxRateList:[],
                currencyList:[]
            }
        };

    }
    componentDidMount() {
        this.optionValueList();
    }

    
    optionValueList = () =>{
        let that = this;
        let data = that.state.data;
        fetch(globals.url.url + '/sale/customer/optionValueList', {
            method: 'get',
            credentials: 'include'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                if (res.code == 0) {
                    that.setState({
                        data: res.result
                    })
                    console.log(that.state.data)
                } else {
                    message.success('保存失败！');
                }
            })
            .catch((error) => {
                message.warning('加载失败，请刷新重试');
            });
    }

    //form 数据
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    // 增加
    addBtn() {
        let ModalTitle = this.state.ModalTitle;
        let ModalData = this.state.ModalData;
        let DataType = this.state.DataType;
        if (this.state.key == 1) {
            var staffData = [{
                name: '联系人',
                massage: '请填写联系人',
                key: 'contacts',
                tag: 'input',
                must: true
            }, {
                name: '联系电话',
                key: 'phone',
                tag: 'input',
                must: true,
                massage: '请填写部门'

            }, {
                name: '部门',
                massage: '请填写部门',
                key: 'department',
                tag: 'input',
                must: true
            }, {
                name: '职务',
                massage: '请填写职务',
                key: 'duty',
                tag: 'input',
                must: true
            }, {
                name: '默认联系人',
                key: 'isEmergencyContact',
                options: [{ value: 'isEmergencyContact' }],
                tag: 'checkbox',
                must: false
            }]
            DataType.type = "add";
            ModalTitle = '增加联系人'

        }
        if (this.state.key == 2) {
            var staffData = [{
                name: '地点名称',
                massage: '请填写地点名称',
                key: 'addrName',
                tag: 'input',
                must: true
            }, {
                name: '地址信息',
                key: 'addrCenter',
                tag: 'selectAddr',
                must: true,
                massage: '请选择地址信息'

            }, {
                name: '联系人',
                massage: '请填写部门',
                key: 'phone',
                tag: 'input',
                must: true
            }, {
                name: '默认联系人',
                key: 'isEmergencyContact',
                options: [{ value: 'isEmergencyContact' }],
                tag: 'checkbox',
                must: false
            }]
            DataType.type = "add";
            ModalTitle = '增加送货地址'
        }
        this.setState({
            visible1: true,
            ModalTitle: ModalTitle,
            ModalData: staffData,
            DataType: DataType
        })

    }
    tabCallback(key) {
        this.setState({
            key: key
        })
    }
    submit = (e) => {
        let  that = this;
        let ClientA = that.state.ClientA;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values = that.dataManage(values)
                
                
                for(var i in values){
                    ClientA[i] = values[i]
                }
                var submit = JSON.stringify(ClientA);
                submit = JSON.parse(submit)
                if(submit.contact.length == 0){
                    delete submit.contact
                }
                if(submit.address.length == 0){
                    delete submit.address
                }
                fetch(globals.url.url + '/sale/customer/add', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submit)
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (res) {
                        if (res.code == 0) {
                            message.success('操作成功！');
                            that.props.history.push({ pathname: '/erp/sale-customer-list/' });
                            var obj = { name: '客户档案' , menuKey: 'sale-customer-list' , key: 'sale-customer-list' };
                            that.props.dispatch({ type: 'INCREMENT', text: obj });
                        }
                        if (res.code == 110029) {
                            message.warning(res.message);
                        } 
                        if (res.code == 1) {
                            message.success('保存失败！');
                        }
                    })
                    .catch((error) => {
                        message.warning('加载失败，请刷新重试');
                    });
                
                // this.props.form.resetFields();
            }
        });

    }
    handleSubmits = (e) => {
        let that = this;
        if (this.state.key == 1) {
            that.refs.model.validateFields((err, values) => {
                if (!err) {
                    if (values.isEmergencyContact) {
                        if (values.isEmergencyContact.length == 0) {
                            values.isEmergencyContact = 0
                        } else {
                            values.isEmergencyContact = 1
                        }
                    } else {
                        values.isEmergencyContact = 0
                    }
                    let ClientA = that.state.ClientA;
                    values.key = ClientA.contact.length;
                    ClientA.contact.push(values)
                    that.setState({
                        visible1: false,
                        ClientA: ClientA
                    })
                    that.refs.model.resetFields();
                }
            });
        }
        if (this.state.key == 2) {
            that.refs.model.validateFields((err, values) => {
                if (!err) {
                    if (values.isEmergencyContact) {
                        if (values.isEmergencyContact.length == 0) {
                            values.isEmergencyContact = 0
                        } else {
                            values.isEmergencyContact = 1
                        }
                    } else {
                        values.isEmergencyContact = 0
                    }
                    let ClientA = that.state.ClientA;
                    values.key = ClientA.address.length;
                    ClientA.address.push(values)
                    that.setState({
                        visible1: false,
                        ClientA: ClientA
                    })
                    that.refs.model.resetFields();
                }
            });
        }
    }
    information = (e) =>{
        var ClientA = this.state.ClientA;
        this.refs.bank.validateFields((err, values) => {
            if (!err) {
                values = this.dataManage(values)
                console.log(values)
                // for(var i in values){
                    ClientA.informationVO = values
                    
                // }
                console.log(ClientA)
                this.setState({
                    ClientA:ClientA
                })
            }
        });
    }
    dataManage (data){
        for (var i in data) {
            if (!data[i]) {
                delete data[i]
            }
        }
        return data
    }
    handleCancel = (e) => {
        this.setState({
            visible1: false,
        });
    }
    delList(data, i) {
        var ClientA = this.state.ClientA
        if (this.state.key == 1) {
            ClientA.contact.splice(i, 1);
            this.setState({
                ClientA: ClientA
            })
        }
        if (this.state.key == 2) {
            ClientA.address.splice(i, 1);
            this.setState({
                ClientA: ClientA
            })
        }
    }
    render() {
        var that = this;
        const { getFieldDecorator } = this.props.form;

        const options = Position;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 22 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 7,
                },
            },
        };
        const columns1 = [{
            width: 50,
            dataIndex: 'index',
            key: 'index',
            render: (text, record, i) => (
                <span>{i + 1}</span>
            )
        }, {
            title: '联系人',
            dataIndex: 'contacts',
            key: 'contacts',
        }, {
            title: '部门',
            dataIndex: 'department',
            key: 'department',
        }, {
            title: '职务',
            dataIndex: 'duty',
            key: 'duty',
        }, {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '默认联系人',
            dataIndex: 'isEmergencyContact',
            key: 'isEmergencyContact',
            render: (text, record, index) => record.isEmergencyContact ? '是' : '否'
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, i) => (
                <Popconfirm title="你确定删除吗？" onConfirm={this.delList.bind(this, record, i)} okText="确定" cancelText="取消">
                    <Tooltip title="删除">
                        <span className="account-table-title" style={{ cursor: 'pointer' }}>
                            <Icon type="close-circle" />
                        </span>
                    </Tooltip>
                </Popconfirm>
            )
        }];
        const columns2 = [{
            width: 50,
            dataIndex: 'index',
            key: 'index',
            render: (text, record, i) => (
                <span>{i + 1}</span>
            )
        }, {
            title: '地点名称',
            dataIndex: 'addrName',
            key: 'contacts',
        }, {
            title: '地址信息',
            dataIndex: 'addrCenter',
            key: 'department',
        }, {
            title: '联系人',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: '默认地址',
            dataIndex: 'default',
            key: 'default',
            render: (text, record, i) => (
                <span>
                    {record.default ? '是' : '否'}
                </span>
            )
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, i) => (
                <Popconfirm title="你确定删除吗？" onConfirm={this.delList.bind(this, record, i)} okText="确定" cancelText="取消">
                    <Tooltip title="删除">
                        <span className="account-table-title" style={{ cursor: 'pointer' }}>
                            <Icon type="close-circle" />
                        </span>
                    </Tooltip>
                </Popconfirm>
            )
        }];
        // const position =
        return (
            <div>
                <div className="w_content ">
                    <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
                        <Form className="page_from" style={{ width: '100%' }} onSubmit={this.submit}>
                            <div className="w_header clearfix border1_bottom">
                                <div className="f_right ">

                                    <Button type="primary" htmlType="submit" icon="save">
                                        保存
                            </Button>
                                </div>
                            </div>
                            <div className="page_add_input_main">
                                <div className="page_add_input_main_form" style={{ width: '28%' }}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="客户编码"
                                    >
                                        {getFieldDecorator('number', {
                                            rules: [{
                                                required: true, whitespace: true, message: '请输入客户编码!',
                                            }],
                                            initialValue: this.state.ClientA.number
                                        })(
                                            <Input placeholder="请输入客户编码"  />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="客户类型"
                                    >
                                        {getFieldDecorator('type', {
                                            rules: [{
                                                required: true,  message: '请输入客户类型!',
                                            }]
                                        })(
                                            <Select placeholder="请选择客户类型">
                                                <Option  value='1'>标准客户</Option>
                                                <Option  value='2'>寄存客户</Option>
                                                <Option  value='3'>个人客户</Option>
                                                
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="业务员"
                                    >
                                        {getFieldDecorator('salesmanId', {
                                            rules: [{
                                                required: true,  message: '请选择业务员!',
                                            }]
                                        })(
                                            // salesmanList
                                            <Select placeholder="请选择业务员">
                                            {this.state.data.salesmanList.map((data,i)=>{
                                                return <Option key={i} value={data.id}>{data.name}</Option>
                                            })}
                                        </Select>
                                        )}
                                    </FormItem>

                                </div>
                                <div className="page_add_input_main_form" style={{ width: '35%' }}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="客户名称"
                                    >
                                        {getFieldDecorator('name', {
                                            rules: [{
                                                required: true, whitespace: true, message: '请输入客户名称!',
                                            }]
                                        })(
                                            <Input placeholder="请输入客户名称" />
                                        )}
                                    </FormItem>
                                    {/* customerRankList */}
                                    <FormItem
                                        {...formItemLayout}
                                        label="客户级别"
                                    >
                                        {getFieldDecorator('customerRankId', {
                                            rules: [{
                                                required: false, message: '请选择客户级别!',
                                            }]
                                        })(
                                            <Select placeholder="请选择客户级别">
                                            {this.state.data.customerRankList.map((data,i)=>{
                                                return <Option key={i} value={data.id}>{data.customerRank}</Option>
                                            })}
                                        </Select>
                                            
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="默认结算币种"
                                    >
                                        {getFieldDecorator('currencyId', {
                                            rules: [{
                                                required: true, message: '默认结算币种!',
                                            }]
                                        })(
                                            // currencyList
                                            <Select placeholder="请选择默认结算币种">
                                            {this.state.data.currencyList.map((data,i)=>{
                                                return <Option key={i} value={data.id}>{data.name}</Option>
                                            })}
                                        </Select>
                                        )}
                                    </FormItem>
                                </div>
                                <div className="page_add_input_main_form" style={{ width: '37%' }}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="客户简称"
                                    >
                                        {getFieldDecorator('simpleName', {
                                            rules: [{
                                                required: false, whitespace: true, message: '请输入客户简称!',
                                            }]
                                        })(
                                            <Input placeholder="请输入客户简称" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="业务区域"
                                    >
                                        {getFieldDecorator('businessAreaId')(
                                            <Select placeholder="请选择业务区域">
                                                {this.state.data.businessAreaList.map((data,i)=>{
                                                    return <Option key={i} value={data.id}>{data.businessArea}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="默认税率"
                                    >
                                        {getFieldDecorator('taxRateId')(
                                            // <Input placeholder="请选择行业" />
                                            <Select placeholder="请选择默认税率">
                                                {this.state.data.taxRateList.map((data,i)=>{
                                                    return <Option key={i} value={data.id}>{data.rate}%</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>
                            </div>
                        </Form>

                    </Spin>

                </div>
                <div className="PageMain ">
                    <div className="page_add_tabs">
                       
                        {this.state.key == 3
                             ?null
                             :<Button type="primary" shape="circle" icon="plus" onClick={this.addBtn.bind(this)} style={{ position: 'absolute', right: 20, top: 25, cursor: 'pointer', zIndex: 99 }} />
                        }
                        <Tabs defaultActiveKey="1" tabBarStyle={{ border: 'none' }} onChange={this.tabCallback.bind(this)}>
                            <TabPane tab="联系人" key="1">
                                <Table columns={columns1} dataSource={this.state.ClientA.contact} bordered pagination={false} />
                            </TabPane>
                            <TabPane tab="送货地址" key="2">
                                <Table columns={columns2} dataSource={this.state.ClientA.address} bordered pagination={false} />
                            </TabPane>
                            <TabPane tab="财务信息" key="3">
                                <Bank data={this.state.data} information = {this.information} ref="bank" />
                                
                            </TabPane>

                        </Tabs>
                    </div>
                    <CollectionCreateForm
                        ref="model"
                        title={this.state.ModalTitle}
                        DataType={this.state.DataType}
                        ModalData={this.state.ModalData}
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible1}
                        onCreate={this.handleSubmits}
                        onCancel={this.handleCancel}
                    />
                </div>
            </div>

        );
    }
}
export default Form.create()(connect()(CompanyUpdate));

{/* <Cascader defaultValue={['湖南省', '岳阳市', '岳阳县']}  options={options} onChange={this.onChange} placeholder="请选择省市区" /> */ }
