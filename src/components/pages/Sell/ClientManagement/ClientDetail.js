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
                informationVO: {}
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
            data: {
                businessAreaList: [],
                customerRankList: [],
                salesmanList: [],
                taxRateList: [],
                currencyList: []
            }
        };

    }
    componentDidMount() {
        this.getData();
    }


    getData = () => {
        let that = this;
        let ClientA = that.state.ClientA;
        fetch(globals.url.url + '/sale/customer/show?id=' + that.props.match.params.id, {
            method: 'get',
            credentials: 'include'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                if (res.code == 0) {
                    if (!res.result.hasOwnProperty('informationVO')) {
                        res.result.informationVO = {}
                    }
                    if (!res.result.hasOwnProperty('contact')) {
                        res.result.contact = []
                    } else {
                        res.result.contact = JSON.parse(res.result.contact);

                    }
                    if (!res.result.hasOwnProperty('address')) {
                        res.result.address = []
                    } else {
                        res.result.address = JSON.parse(res.result.address);
                    }
                    that.setState({

                        ClientA: res.result
                    })
                } else {
                    message.success('保存失败！');
                }
            })
            .catch((error) => {
                message.warning('加载失败，请刷新重试');
            });
    }

    tabCallback(key) {
        this.setState({
            key: key
        })
    }
    //修改跳转
    edit = (e) =>{
        this.props.history.push({ pathname: '/erp/ClientEdit/' + this.props.match.params.id });
        var obj = { name: '客户档案修改-' + this.state.ClientA.name, menuKey: 'ClientEdit/' + this.props.match.params.id, key: 'ClientEdit' };
        this.props.dispatch({ type: 'INCREMENT', text: obj });
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
        }];
        // const position =
        return (
            <div>
                <div className="w_content ">
                    <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
                        {/* <Form className="page_from" style={{ width: '100%' }} onSubmit={this.submit}> */}
                            <div className="w_header clearfix border1_bottom">
                                <div className="f_right ">
                                    <Button onClick={this.edit} type="primary" htmlType="submit" icon="save">
                                        修改
                                    </Button>
                                </div>
                            </div>
                            <div className="page_add_input_main">
                                <div className="page_add_input_main_form" style={{ width: '28%' }}>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">客户编码</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.number}</span>
                                        </div>
                                    </div>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">客户类型</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >
                                                {this.state.ClientA.type == 1 && '标准客户'}
                                                {this.state.ClientA.type == 2 && '寄存客户'}
                                                {this.state.ClientA.type == 3 && '个人客户'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">业务员</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.salesmanName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="page_add_input_main_form" style={{ width: '35%' }}>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">客户名称</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.name}</span>
                                        </div>
                                    </div>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">客户级别</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.customerRankName}</span>
                                        </div>
                                    </div>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">默认结算币种</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.currencyName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="page_add_input_main_form" style={{ width: '37%' }}>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">客户简称</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.simpleName}</span>
                                        </div>
                                    </div>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">业务区域</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.businessAreaName}</span>
                                        </div>
                                    </div>
                                    <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                            <label className="color_99">默认税率</label>
                                        </div>
                                        <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                            <span >{this.state.ClientA.taxRate ? this.state.ClientA.taxRate + '%' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    </Spin>

                </div>
                <div className="PageMain ">
                    <div className="page_add_tabs">
                        <Tabs defaultActiveKey="1" tabBarStyle={{ border: 'none' }} onChange={this.tabCallback.bind(this)}>
                            <TabPane tab="联系人" key="1">
                                <Table columns={columns1} dataSource={this.state.ClientA.contact} bordered pagination={false} />
                            </TabPane>
                            <TabPane tab="送货地址" key="2">
                                <Table columns={columns2} dataSource={this.state.ClientA.address} bordered pagination={false} />
                            </TabPane>
                            <TabPane tab="财务信息" key="3">
                                {/* <Bank data={this.state.data} information={this.information} ref="bank" /> */}
                                <div className="w_page">
                                    <div className="page_add_input_main">
                                        <div className="page_add_input_main_form" style={{ width: '28%' }}>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">开户银行</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.bankName}</span>
                                                </div>
                                            </div>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">银行账户</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.bankAccount}</span>
                                                </div>
                                            </div>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">财户名称</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.accountName}</span>
                                                </div>
                                            </div>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">币种</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.informationCurrencyName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="page_add_input_main_form" style={{ width: '35%' }}>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">开票抬头</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.ticketHead}</span>
                                                </div>
                                            </div>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">开户行</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.openingBank}</span>
                                                </div>
                                            </div>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">开户账户</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.openingNumber}</span>
                                                </div>
                                            </div>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">纳税人识别号</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.identificationNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="page_add_input_main_form" style={{ width: '37%' }}>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">结算方式</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.receiveWayName}</span>
                                                </div>
                                            </div>
                                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                                    <label className="color_99">收款条件</label>
                                                </div>
                                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                                    <span >{this.state.ClientA.informationVO.settleWayName}</span>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
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
