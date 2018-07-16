import React from 'react';
import { Button, Modal, Form, Input, Radio, TreeSelect,Select } from 'antd';
import { Link } from 'react-router-dom';
import 'src/style/pages.less';
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const ModelDepart = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                level:''
            };
        }
        onChange = (value,node) => {
            this.setState({ value });
        }
        onSelect = (value,node,extra) => {
            this.props.ModalData.level=node.props.level
        }
        render() {
            const { visible, onCreate, form, onCancel, title, ModalData, DataType } = this.props;
            const { getFieldDecorator } = form;
            let id = null;  
            if( DataType.type == 'edit'){
            id = <FormItem className="none" key={'id'} label='id'>
                    {getFieldDecorator('id', {
                    initialValue:DataType.id 
                    })(
                    <Input  />
                    )}
                    </FormItem>
            }
            return (
                <Modal
                    visible={visible}
                    DataType={DataType}
                    title={title}
                    okText="确定"
                    cancelText="取消"
                    onOk={onCreate}
                    onCancel={onCancel}
                >
                    <Form layout="vertical" className="w_model_form clearfix">
                        <FormItem key='b' label='上级部门'>
                            {getFieldDecorator('perent', {
                                rules: [{ required: true, message: '请选择上级部门'}],
                                initialValue:ModalData.value
                            })(
                                <TreeSelect
                                    style={{ width: 300 }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={ModalData.data}
                                    treeDefaultExpandAll
                                    placeholder='请选择上级部门'
                                    // treeDataSimpleMode={[{type:'ada'}]}
                                    onChange={this.onChange}
                                    onSelect={this.onSelect}
                                />
                            )}
                        </FormItem>
                        <FormItem  key={'name'} label='部门名称'>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入部门名称'}],
                                    initialValue: ModalData.name
                                })(
                                    <Input placeholder="请输入部门名称"  className="w300"  />
                                )}
                        </FormItem>
                        <FormItem  key={'type'} label='部门类型'>
                                {getFieldDecorator('type', {
                                    rules: [{ required: true, message: '请选择部门类型'}],
                                    initialValue: ModalData.type
                                })(
                                    <Select placeholder="请选择部门类型" style={{ width: 200 }}>
                                        <Option value="管理部门">管理部门</Option>
                                        <Option value="销售部门">销售部门</Option>
                                        <Option value="采购部门">采购部门</Option>
                                        <Option value="基本生产部门">基本生产部门</Option>
                                        <Option value="辅助生产部门">辅助生产部门</Option>
                                        <Option value="研发部门">研发部门</Option>
                                    </Select>
                                )}
                        </FormItem>
                        <FormItem className="none" key={'level'} label='level'>
                                {getFieldDecorator('level', {
                                    initialValue: ModalData.level
                                })(
                                    <Input  />
                                )}
                        </FormItem>
                        {id}
                    </Form>
                </Modal>
            );
        }
    }
);
export default ModelDepart;

