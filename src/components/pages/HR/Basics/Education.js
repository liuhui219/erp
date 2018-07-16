import React from 'react';
import { Menu, Icon, Dropdown, Pagination, Tooltip,Popconfirm,Input, message, InputNumber, Modal, Table, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
import globals from 'src/components/unit';
import CollectionCreateForm from 'src/components/Component/ModelType/ModelType';

export default class Education extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            DataType:{},
            visible: false,
            ModalData: [],
            showHide: true
        };
    }
    componentDidMount() {
        this.list()
    }
    // 编辑
    edit = (id) => {
        let ModalData = this.state.ModalData;
        let DataType = this.state.DataType;
        let data = this.state.data;
        var staffData = [{
            name: '学历',
            massage: '请填写证件学历',
            key:'name',
            must: true,
        }, {
            name: '描述',
            key:'remarks',
            must: false
        }]
        data.map((item) =>{
            if(item.id == id){
                staffData[0].value = item.name
                staffData[1].value = item.remarks == 0 ? '' :item.remarks
            }
        })
        DataType.type ="edit";
        DataType.id = id;
        this.setState({
            ModalData:staffData,
            DataType:DataType
        })
        this.showModal();
    }
    // 删除
    delete= (id) =>  {
        this.save('','/hr/educationType/delete?id='+id)
    }   
    // 获取列表
    list = () => {
        let that = this;
        let data = that.state.data;
        fetch(globals.url.url + '/hr/educationType/list', {
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
        let ModalData = this.state.ModalData;
        let DataType = this.state.DataType;
        var staffData = [{
            name: '学历',
            massage: '请填写学历类型',
            key:'name',
            must: true
        }, {
            name: '描述',
            key:'remarks',
            must: false
        }]
        DataType.type ="add";
        this.setState({
            ModalData:staffData,
            DataType:DataType
        })
        this.showModal();
    }
    // 显示模态框
    showModal = () => {
        this.setState({ visible: true });
    }
    // 发送新增数据
    save = (values,url) =>{
        let that= this;  
        // '/hr/employeeType/add'
        fetch(globals.url.url +  url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(values)
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
    handleCancel = () => {
        let DataType = this.state.DataType;
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let url ='';
            if(DataType.type == 'add'){
                url = '/hr/educationType/add';
            }else{
                url = '/hr/educationType/update';                
            }
            this.save(values,url)
            form.resetFields();
            this.setState({ visible: false });
        });
    }
    handleCreate = () =>{
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
                title: '', dataIndex: 'name', width: 100, key: '1', align: 'center',
                render(text, record, index) {
                    return (
                        <span>{index + 1}</span>
                    )
                }
            },
            { title: '学历', dataIndex: 'name', width: 200, key: 'name' },
            { title: '描述', dataIndex: 'remarks', width: 400, key: 'remarks' },
            { title: '操作',  key: 'operation', render: (text, record, index) =>
             <div>
                <Tooltip title="编辑">
                    <span className="account-table-title" onClick={that.edit.bind(that, record.id)} style={{cursor:'pointer'}}>
                        <Icon style={{color:'#428ef2'}} type="edit" />
                    </span>
                    </Tooltip>
                <Popconfirm title="你确定删除吗？" onConfirm={this.delete.bind(this, record.id)}  okText="确定" cancelText="取消">
                    <Tooltip title="删除">
                    <span className="account-table-title" style={{cursor:'pointer',marginLeft:15}}>
                        <Icon style={{color:'#428ef2'}} type="delete" />
                    </span>
                    </Tooltip>
                </Popconfirm>     
            </div> },
        ];
        // const position = 
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
                    title='学历'
                    DataType={this.state.DataType}
                    ModalData={this.state.ModalData}
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCreate={this.handleCreate}
                    onCancel={this.handleCreate}
                    onCreate={this.handleCancel}
                />
            </div>
        );
    }
}

