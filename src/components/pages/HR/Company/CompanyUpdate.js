import React, { Component } from 'react';
import '../hr.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin, Upload, Select, Modal,Cascader } from 'antd';
import globals from 'src/components/unit';
import moment from 'moment';
import { connect } from 'react-redux';

import Position from '../../../Component/CompanyAddr/Position';

import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const { TextArea } = Input;


class CompanyUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyData: {
                id: '',
                name: '',
                number: '',
                logoResourceKey: '',
                legalRepresentative: '',
                societyCode: '',
                scale: '',
                industry: '',
                companyAddress: '',
                companyIntroduction: '',
                businessLicenceResourceKeys: [],

            },
            region:[],
            previewVisible: false,
            previewImage: '',
            loading: false,
            headResourceKey: '',
            key: 1,
            spinning: false,
            tip: '加载中...'
        };

    }
    componentDidMount() {
        // this.props.location.state.id =1
        this.company()
    }
    // 上传修改信息
    handleSubmit = (e) => {
        e.preventDefault();
        let that = this
        let form = that.props.form;
        let companyData = that.state.companyData;
        let images = JSON.stringify(companyData.businessLicenceResourceKeys);
        images = JSON.parse(images)
        let data = {};
        that.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            that.setState({
                loading:true,
                tip:'保存中...'
            })
            images.map((item, index) => {
                if (item.hasOwnProperty('response')) {
                    images[index] = item.response.result;

                } else {
                    images[index] = item.key;
                }

            })
            values.id = 1;
            images = images.join('/')
            values.companyAddressRegion = values.companyAddressRegion.join("/");
            values.companyAddress = values.companyAddressRegion + '/' + values.companyAddress;
            delete values.companyAddressRegion;
            values.businessLicenceResourceKey = images;
            values.logoResourceKey = that.state.headResourceKey;

            fetch(globals.url.url + '/sys/company/edit', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (res) {
                    if (res.code == 0) {
                        that.setState({
                            loading:false
                        })
                        that.skipCompany();
                        message.success('保存成功');

                    } else {
                        message.success('保存失败！');
                    }
                })
                .catch((error) => {
                    message.warning('加载失败，请刷新重试');
                });
            form.resetFields();
        });
    }
    skipCompany = () => {


        var data = { id: this.state.companyData.id};
        var path = {
            pathname: '/erp/sys-company-info',
            state: data,
        }
        this.props.history.push(path)
        var objs = {menuKey:'CompanyUpdate',key:'CompanyUpdate'};
        this.props.dispatch({ type: 'header' ,text:objs});
    }
    getBase64(img, callback) {

        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2M!');
        }
        return isLt2M;
    }


    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true, headResourceKey: '' });
            return;
        }
        if (info.file.status === 'done') {

            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
                headResourceKey: info.file.response.result
            }));
        }
    }

    // 上传完成
    // handleChangeCompany = ({ fileList }) => this.setState({ fileList })
    handleChangeCompany = (info) => {
        let companyData = this.state.companyData;
        let that = this;
        companyData.businessLicenceResourceKeys = info.fileList;
        this.setState({
            companyData: companyData
        })
        if (info.file.status === 'uploading') {
            that.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            that.getBase64(info.file.originFileObj, function (fileList) {
                that.setState({
                    loading: false
                })
            });
        }
    }

    //form 数据
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    // 图片取消
    handleCancel = () => this.setState({ previewVisible: false })
    //图片预览
    handlePreview = (file, i) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    // 获取公司信息
    company = () => {
        let that = this;
        let companyData = that.state.companyData;
        let region = that.state.region;
        let headResourceKey = that.state.headResourceKey;
        let fileList = that.state.fileList;
        fetch(globals.url.url + '/sys/company/show?id=1', {
            method: 'get',
            credentials: 'include'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                if (res.code == 0) {
                    headResourceKey = res.result.logoResourceKey;
                    res.result.logoResourceKey = globals.url.url + '/common/file/download?key=' + res.result.logoResourceKey
                    res.result.businessLicenceResourceKeys.map((item, index) => {
                        res.result.businessLicenceResourceKeys[index] = {}
                        res.result.businessLicenceResourceKeys[index].url = globals.url.url + '/common/file/download?key=' + item;
                        res.result.businessLicenceResourceKeys[index].uid = index;
                        res.result.businessLicenceResourceKeys[index].key = item;
                    })
                    region.push(res.result.province);
                    region.push(res.result.city);
                    region.push(res.result.counties);
                    res.result.companyAddress = res.result.companyAddress.replace(/\//g, "")
                    that.setState({
                        companyData: res.result,
                        region:region,
                        spinning: false,
                        imageUrl: res.result.logoResourceKey,
                        headResourceKey: headResourceKey
                    })
                } else {
                    message.success('保存失败！');
                }
            })
            .catch((error) => {
                message.warning('加载失败，请刷新重试');
            });
    }


    render() {
        var that = this;
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;

        const options =Position;
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
                sm: { span: 2},
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 22  },
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
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'upload'} />
                <div className="ant-upload-text"></div>
            </div>
        );
        const imageUrl = this.state.imageUrl;

        // const position =
        return (
            <div className="w_content ">
                <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
                    <Form className="page_from" style={{ width: '100%' }} onSubmit={this.handleSubmit}>
                        <div className="w_header clearfix border1_bottom">
                            <div className="f_right ">
                                <Button type="primary"  onClick={this.skipCompany} className="mr10" icon="close-square-o">
                                    取消
                            </Button>
                                <Button type="primary" htmlType="submit" icon="save">
                                    保存
                            </Button>
                            </div>   
                        </div>
                        <div className="page_add_input_main">
                            <div className="page_add_input_main_form" style={{ width: '28%' }}>
                                <div className="ant-row ant-form-item" style={{ marginBottom: 15 }}>
                                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                        <label className="ant-form-item-required" title="企业logo">企业logo</label>
                                    </div>
                                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                        <Upload
                                            name="file"
                                            accept='image'
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action={globals.url.url + '/common/file/upLoad'}
                                            withCredentials={true}
                                            data={{ 'publicType': 2 }}
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.handleChange}
                                        >
                                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 90 }} /> : uploadButton}
                                        </Upload>
                                    </div>
                                </div>

                                <FormItem
                                    {...formItemLayout}
                                    label="企业编码"
                                >
                                    {getFieldDecorator('number', {
                                        rules: [{
                                            required: true, whitespace: true, message: '请输入企业编码!',
                                        }],
                                        initialValue: this.state.companyData.number
                                    })(
                                        <Input placeholder="请输入企业编码" disabled />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="企业名称"
                                >
                                    {getFieldDecorator('name', {
                                        rules: [{
                                            required: true, whitespace: true, message: '请输入企业名称!',
                                        }],
                                        initialValue: this.state.companyData.name
                                    })(
                                        <Input placeholder="请输入企业名称" disabled />
                                    )}
                                </FormItem>

                            </div>
                            <div className="page_add_input_main_form" style={{ width: '35%' }}>
                                <div className="ant-row ant-form-item" style={{ marginBottom: 15 }}>
                                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-7">
                                        <label className="ant-form-item-required" title="企业logo">营业执照扫描附件</label>
                                    </div>
                                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-16">
                                        <Upload
                                            name="file"
                                            accept='image'
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            action={globals.url.url + '/common/file/upLoad'}
                                            withCredentials={true}
                                            data={{ 'publicType': 2 }}
                                            fileList={this.state.companyData.businessLicenceResourceKeys}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleChangeCompany}
                                            onRemove={this.handleRemove}
                                        >
                                            {this.state.companyData.businessLicenceResourceKeys.length >= 5 ? null : uploadButton}
                                        </Upload>
                                    </div>
                                </div>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                                <FormItem
                                    {...formItemLayout}
                                    label="法人代表"
                                >
                                    {getFieldDecorator('legalRepresentative', {
                                        rules: [{
                                            required: true, whitespace: true, message: '请输入法人代表!',
                                        }],
                                        initialValue: this.state.companyData.legalRepresentative
                                    })(
                                        <Input placeholder="请输入法人代表" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="企业规模"
                                >
                                    {getFieldDecorator('scale', {
                                        rules: [{
                                            required: false, whitespace: true, message: '请输入企业规模!',
                                        }],
                                        initialValue: this.state.companyData.scale
                                    })(
                                        <Input placeholder="请输入企业规模" />
                                    )}
                                </FormItem>
                            </div>
                            <div className="page_add_input_main_form" style={{ width: '37%' }}>
                                <FormItem
                                    {...formItemLayout}
                                    label="统一社会信用码"
                                >
                                    {getFieldDecorator('societyCode', {
                                        rules: [{
                                            required: true, whitespace: true, message: '请输入统一社会信用码!',
                                        }],
                                        initialValue: this.state.companyData.societyCode
                                    })(
                                        <Input placeholder="请输入统一社会信用码" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="行业"
                                >
                                    {getFieldDecorator('industry', {
                                        initialValue: this.state.companyData.industry
                                    })(
                                        // <Input placeholder="请选择行业" />
                                        <Select
                                        // showSearch
                                        placeholder="请选择行业"
                                        optionFilterProp="children"
                                      >
                                        <Option value="水产加工">水产加工</Option>
                                        <Option value="远洋捕捞">远洋捕捞</Option>
                                        <Option value="水产养殖">水产养殖</Option>
                                        <Option value="近海捕捞">近海捕捞</Option>
                                        <Option value="水产精加工">水产精加工</Option>
                                        <Option value="水产初加工">水产初加工</Option>
                                      </Select>


                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="公司地址"
                                    className="mb10"
                                >
                                    {getFieldDecorator('companyAddressRegion', {

                                        initialValue: this.state.region
                                    })(
                                        <Cascader   options={options} onChange={this.onChange} placeholder="请选择省市区" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...tailFormItemLayout}
                                    label=""
                                >
                                    {getFieldDecorator('companyAddress', {
                                        initialValue: this.state.companyData.otherAddress
                                    })(
                                        <Input placeholder="请选择公司所在的省市区" />

                                    )}
                                </FormItem>
                            </div>
                        </div>
                        <FormItem
                            {...formItemLayout1}
                            className="ml10"
                            label="企业简介"
                        >
                            {getFieldDecorator('companyIntroduction', {
                                rules: [{
                                    required: false, whitespace: true, message: '请输入企业简介!',
                                }],
                                initialValue: this.state.companyData.companyIntroduction
                            })(
                                // <Input placeholder="请输入企业名称" />
                                <TextArea className="ant-col-xs-24 ant-col-sm-23 h100" rows={4} />
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        );
    }
}
export default Form.create()(connect()(CompanyUpdate));

{/* <Cascader defaultValue={['湖南省', '岳阳市', '岳阳县']}  options={options} onChange={this.onChange} placeholder="请选择省市区" /> */ }
