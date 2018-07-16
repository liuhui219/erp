import React from 'react';
import { Menu, Icon, Dropdown, Pagination, Input, message, Spin, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
import { connect } from 'react-redux';
import globals from 'src/components/unit';
import img from 'src/style/imgs/b1.jpg';
// import '../hr.less';


 class Company  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyData: {
                id:'1',
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

            tip: '加载中',
            spinning: true
        };
    }
    componentDidMount() {
        this.company()
    }
    handleSubmit = () => {

    }
    edit = () => {
        var data = { id: this.state.companyData.id};
        var path = {
            pathname: '/erp/CompanyUpdate/'+this.state.companyData.id
        }
        this.props.history.push(path)
        var obj = {name:'修改公司信息-'+this.state.companyData.name,menuKey:'CompanyUpdate/1',key:'CompanyUpdate'};
        this.props.dispatch({ type: 'INCREMENT' ,text:obj});
       
    }
    // 获取公司信息
    company = () => {
        let that = this;
        let companyData = that.state.companyData;
        let region = that.state.region;
        fetch(globals.url.url + '/sys/company/show?id=1', {
            method: 'get',
            credentials: 'include'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (res) {
                if (res.code == 0) {
                    res.result.logoResourceKey = globals.url.url+'/common/file/download?key='+res.result.logoResourceKey
                    res.result.businessLicenceResourceKeys.map((item,index) => {
                         res.result.businessLicenceResourceKeys[index] = globals.url.url+'/common/file/download?key='+item
                    })
                    res.result.companyAddress = res.result.companyAddress.replace(/\//g, "")
                    that.setState({
                        companyData: res.result,
                        spinning: false,
                        region:region
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
        const companyData = this.state.companyData;
        return (
            <div className="w_content ">
                <Spin size="large" tip={this.state.tip} spinning={this.state.spinning}>
                    <div className="w_header clearfix border1_bottom">
                        <div className="f_right ">
                            <Button type="primary" className="mr10" onClick={this.edit} >
                                <i className="icon mr8">&#xe62f;</i>
                                修改
                        </Button>
                        </div>
                    </div>
                    {/* <Form className="page_from" style={{ width: '100%' }} onSubmit={this.handleSubmit}> */}
                    <div className="page_add_input_main">
                        <div className="page_add_input_main_form" style={{ width: '28%' }}>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">企业logo</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <img className="icon90" src={companyData.logoResourceKey} />
                                </div>
                            </div>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">企业编码</label>
                                </div>
                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <span >{companyData.number}</span>
                                </div>
                            </div>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">企业名称</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <span>{companyData.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="page_add_input_main_form" style={{ width: '35%' }}>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">营业执照扫描件</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    {companyData.businessLicenceResourceKeys.map((item, index) => {
                                        return (
                                            <img key={index} className="icon90" src={item} />
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">法人代表</label>
                                </div>
                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <span >{companyData.legalRepresentative}</span>
                                </div>
                            </div>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">企业规模</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <span>{companyData.scale}</span>
                                </div>
                            </div>
                        </div>
                        <div className="page_add_input_main_form" style={{ width: '37%' }}>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">统一社会信用代码</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <span >{companyData.societyCode}</span>
                                </div>
                            </div>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">行业</label>
                                </div>
                                <div className=" ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <span >{companyData.industry}</span>
                                </div>
                            </div>
                            <div className="ant-row ant-form-item" style={{ marginBottom: 35 }}>
                                <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-8">
                                    <label className="color_99">公司地址</label>
                                </div>
                                <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-13">
                                    <span>{companyData.companyAddress}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="companyIntroduction">
                        <div className="ant-form-item-label ln1-5 ant-col-xs-24 ant-col-sm-2 ln1-5">
                            <label className="color_99">公司简介</label>
                        </div>
                        <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-22">
                            <span>{companyData.companyIntroduction}</span>
                        </div>
                    </div>
                    {/* </Form> */}
                </Spin>
            </div>
        );
    }
}
export default connect()(Company)